if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

// A helper to render the component wrapped in NavigationContainer
const renderWithNavigation = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch if it was mocked previously
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
          start: { dateTime: '2023-09-01T10:00:00Z' } 
        }
      ]
    };

    // Mock fetch to resolve with a successful response
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyResponse),
    });

    const { getByPlaceholderText, getByText, queryByText } = renderWithNavigation(
      <CalendarFetching />
    );

    // Enter a valid calendar ID and press Connect
    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    // Wait for success screen to be rendered
    await waitFor(() => {
      expect(queryByText(/Successful Connection to Google Calendar ID/)).toBeTruthy();
    });
  });

  it('handles API error by showing an alert', async () => {
    const dummyErrorResponse = {
      error: { message: 'API Error Message' }
    };

    // Mock fetch to resolve with an error response
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyErrorResponse),
    });

    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <CalendarFetching />
    );

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    // Wait for the error alert to be triggered
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "API Error: API Error Message"
      );
    });
  });

  it('opens modal when "View Events" button is pressed', async () => {
    // Render the component without triggering the fetch (so success screen doesn't override)
    const { getByText, queryByText } = renderWithNavigation(
      <CalendarFetching />
    );

    // Press the "View Events" button
    fireEvent.press(getByText('View Events'));

    // The modal should appear with "Upcoming Events" text
    await waitFor(() => {
      expect(queryByText('Upcoming Events')).toBeTruthy();
    });
  });
});
