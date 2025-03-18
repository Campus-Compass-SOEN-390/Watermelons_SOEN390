if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}

// For the navigation test below, we’ll override the navigation hook within this file.
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

// Helper to render the component wrapped in NavigationContainer
const renderWithNavigation = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching - Coverage for two functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('fetchCalendarEvents sets success screen on valid API response', async () => {
    // This dummy response simulates a successful API call with events.
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

    // Simulate entering a valid calendar ID and pressing "Connect"
    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    // Wait for the success screen to be rendered (triggered by fetchCalendarEvents)
    await waitFor(() => {
      expect(queryByText(/Successful Connection to Google Calendar ID/)).toBeTruthy();
    });
  });

  it('fetchCalendarEvents handles API error when API returns an error', async () => {
    // This dummy response simulates an API error.
    const dummyErrorResponse = {
      error: { message: 'Test API error' },
    };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(dummyErrorResponse),
    });

    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = renderWithNavigation(<CalendarFetching />);

    fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'dummy-id');
    fireEvent.press(getByText('Connect'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "API Error: Test API error"
      );
    });
  });
});
