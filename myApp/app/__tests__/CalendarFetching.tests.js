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

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

// Helper to render the component wrapped in NavigationContainer
const renderWithNavigation = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
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

    global.fetch.mockResolvedValue({
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

    global.fetch.mockResolvedValue({
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
    global.fetch.mockResolvedValue({
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
    global.fetch.mockRejectedValue(new Error("Network Error"));

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
