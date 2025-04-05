import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import fetchMock from "jest-fetch-mock";

// Mock all dependencies
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn() } })),
    },
  },
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  writeAsStringAsync: jest.fn(),
  documentDirectory: "mock_directory/",
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../hooks/useButtonInteraction', () => ({
  useButtonInteraction: () => ({
    handleButtonPress: jest.fn()
  })
}));

// Mock components
jest.mock('../components/LayoutWrapper.js', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, null);
});

jest.mock('../components/HeaderButtons.js', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, null);
});

jest.mock("../components/MonthPicker.js", () => {
  const React = require("react");
  const { View } = require("react-native");
  return () => React.createElement(View, null);
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View);
  },
}));

jest.spyOn(Alert, "alert");
fetchMock.enableMocks();

// Import component after mocks
import CalendarFetching from '../screens/CalendarFetching';

// Helper function
const renderWithNav = (ui) => render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  // All existing tests merged together
  test('renders correctly with inputs and buttons', () => {
    const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
    expect(getByPlaceholderText('Paste Calendar ID here')).toBeTruthy();
    expect(getByText('Connect')).toBeTruthy();
    expect(getByText('Clear History')).toBeTruthy();
  });

  test("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    expect(getByPlaceholderText(/Paste Calendar ID here/i)).toBeDefined();
    expect(getByText(/Connect/i)).toBeDefined();
  });

  test("shows error alert when Calendar ID is blank", async () => {
    const { getByText } = render(<CalendarFetching />);
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Invalid", "Please enter a valid Calendar ID");
    });
  });

  test("fetches calendar events successfully", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  test("handles API errors correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(JSON.stringify({ error: { message: "API Error" } }));

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "API Error: API Error");
    });
  });

  test("shows no events alert when no events are found", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(JSON.stringify({ items: [] }));

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("No Events", "No upcoming events found.");
    });
  });

  test("stores calendar ID in AsyncStorage", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  test("does not store duplicate calendar IDs", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    fetchMock.mockClear();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  test("writes CSV file after fetching events", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        "mock_directory/calendar_events.csv",
        expect.any(String)
      );
    });
  });

  test("clears calendar history", async () => {
    const { getByText } = render(<CalendarFetching />);
    fireEvent.press(getByText(/Clear History/i));
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
    });
  });

  test('renders calendar history box with stored calendar IDs', async () => {
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([
        { id: 'calendar-1', name: 'Work Calendar' },
        { id: 'calendar-2', name: 'Personal Calendar' },
      ])
    );

    const { findByText } = renderWithNav(<CalendarFetching />);
    expect(await findByText('Work Calendar')).toBeTruthy();
    expect(await findByText('Personal Calendar')).toBeTruthy();
  });

  test('clears calendar history and logs event', async () => {
    const { getByText } = renderWithNav(<CalendarFetching />);
    fireEvent.press(getByText(/Clear History/i));
    
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
    });
  });
});
