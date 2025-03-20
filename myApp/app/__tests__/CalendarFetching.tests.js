if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(null)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve(null)),
}));


import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import fetchMock from 'jest-fetch-mock'; // Ensure this is imported

// Helper to render the component wrapped in NavigationContainer
const renderWithNavigation = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks(); // Reset fetch mocks for each test
  });

  it('renders text input and connect button', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <CalendarFetching />
    );
    expect(getByPlaceholderText('Paste Calendar ID here')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
  });

  it('alerts when calendar ID is empty and Connect is pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderWithNavigation(<CalendarFetching />);
    fireEvent.press(getByText('Connect'));
    expect(alertSpy).toHaveBeenCalledWith(
      "Invalid",
      "Please enter a valid Calendar ID"
    );
  });

  it('fetches events and shows success screen on successful API response', async () => {
    const dummyResponse = {
      items: [
        {
          id: '1',
          summary: 'Test Event',
          start: { dateTime: '2023-09-01T10:00:00Z' },
        },
      ],
    };

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyResponse),
    });

    const { getByPlaceholderText, getByText, queryByText } = renderWithNavigation(
      <CalendarFetching />
    );

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(queryByText(/Successful Connection to Google Calendar ID/)).toBeTruthy();
    });
  });

  it('handles API error by showing an alert when API returns an error', async () => {
    const dummyErrorResponse = {
      error: { message: 'API Error Message' },
    };

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyErrorResponse),
    });

    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <CalendarFetching />
    );

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "API Error: API Error Message"
      );
    });
  });

  it('alerts when API returns no events (no items)', async () => {
    const dummyResponse = {}; // No 'items'
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyResponse),
    });

    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <CalendarFetching />
    );

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "No Events",
        "No upcoming events found."
      );
    });
  });

  it('handles fetch error (catch block) by showing an alert', async () => {
    fetchMock.mockRejectedValue(new Error("Network Error"));

    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <CalendarFetching />
    );

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "Something went wrong while fetching the events."
      );
    });
  });
});
