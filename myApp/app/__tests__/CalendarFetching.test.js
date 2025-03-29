import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, View, Text } from 'react-native';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn() } })),
    },
  },
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(),
  documentDirectory: 'mockedDir/',
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { apiKey: 'mocked-api-key' } },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useButtonInteraction hook
jest.mock('../hooks/useButtonInteraction', () => ({
  useButtonInteraction: () => ({
    handleButtonPress: jest.fn(),
  }),
}));

// Correctly mock LayoutWrapper
jest.mock('../components/LayoutWrapper.js', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, null, children);
});

// Correctly mock HeaderButtons
jest.mock('../components/HeaderButtons.js', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () => React.createElement(View, null, React.createElement(Text, null, 'HeaderButtons Mock'));
});

// Mock MonthPicker component
jest.mock('../components/MonthPicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, null);
});

// Correctly mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: () => React.createElement(View),
  };
});

// Import after mocking
import CalendarFetching from '../screens/CalendarFetching';

// Render helper
const renderWithNav = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching Component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders correctly with inputs and buttons', async () => {
    const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

    expect(getByPlaceholderText('Paste Calendar ID here')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
    expect(getByText('Clear History')).toBeTruthy();
  });

  test('shows alert when trying to connect with empty input', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = renderWithNav(<CalendarFetching />);

    fireEvent.press(getByText('Connect'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'Invalid',
        'Please enter a valid Calendar ID'
      )
    );
  });

  test('clears calendar history when pressing Clear History', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const { getByText } = renderWithNav(<CalendarFetching />);

    fireEvent.press(getByText('Clear History'));

    await waitFor(() =>
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('calendarIds')
    );
  });

  test('fetches and displays calendar events successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              { summary: 'Meeting', start: { dateTime: '2025-03-21T10:00:00Z' }, end: { dateTime: '2025-03-21T11:00:00Z' } },
            ],
          }),
      })
    );

  });

  test('loads stored calendar IDs on mount', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'saved-id', name: 'Saved Calendar' }])
    );

    const { findByText } = renderWithNav(<CalendarFetching />);

    expect(await findByText('Saved Calendar')).toBeTruthy();
  });
  test('allows selecting a stored calendar ID', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'stored-calendar', name: 'Stored Calendar' }])
    );

    const { findByText, getByPlaceholderText } = renderWithNav(<CalendarFetching />);

    const storedCalendar = await findByText('Stored Calendar');
    fireEvent.press(storedCalendar);

    expect(getByPlaceholderText('Paste Calendar ID here').props.value).toBe('stored-calendar');
  });


});

test('renders calendar history box with stored calendar IDs', async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  AsyncStorage.getItem.mockResolvedValue(
    JSON.stringify([
      { id: 'calendar-1', name: 'Work Calendar' },
      { id: 'calendar-2', name: 'Personal Calendar' },
    ])
  );

  const { findByText } = renderWithNav(<CalendarFetching />);

  // Check that history items are rendered in the box
  expect(await findByText('Work Calendar')).toBeTruthy();
  expect(await findByText('Personal Calendar')).toBeTruthy();
});

test('handles API error from fetch', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
    })
  );
  const alertSpy = jest.spyOn(Alert, 'alert');

  const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
  
  fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'test-calendar');
  fireEvent.press(getByText('Connect'));

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Error', 'API Error: Invalid API key');
  });
});

test('handles API error from fetch', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ error: { message: 'Invalid API key' } }),
  });

  const alertSpy = jest.spyOn(Alert, 'alert');

  const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

  fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'invalid-id');
  fireEvent.press(getByText('Connect'));

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith("Error", "API Error: Invalid API key");
  });
});

test('fetches and stores calendar events successfully', async () => {
  const mockItems = [
    {
      summary: "Event 1",
      start: { dateTime: "2025-03-21T10:00:00Z" },
      end: { dateTime: "2025-03-21T11:00:00Z" },
      location: "Conference Room",
      htmlLink: "http://example.com"
    },
  ];

  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ items: mockItems, summary: "Test Calendar" }),
  });

  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const FileSystem = require('expo-file-system');

  const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

  fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'test-calendar');
  fireEvent.press(getByText('Connect'));

  await waitFor(() => {
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'mockedDir/calendar_events.csv',
      expect.stringContaining("Event 1")
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'calendarIds',
      JSON.stringify([{ id: 'test-calendar', name: 'Test Calendar' }])
    );

    expect(getByText('Successful Connection to Google Calendar ID: test-calendar')).toBeTruthy();
  });
});
