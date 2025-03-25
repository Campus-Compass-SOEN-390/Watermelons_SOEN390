import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, View, Text } from "react-native";
import RNUxcam from "react-native-ux-cam";
import * as FileSystem from "expo-file-system";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
}));

// Mock UXCam for testing
jest.mock("react-native-ux-cam", () => ({
  tagScreenName: jest.fn(),
  logEvent: jest.fn(),
  startWithConfiguration: jest.fn(),
  optIntoSchematicRecordings: jest.fn(),
}));

// Mock expo-file-system
jest.mock("expo-file-system", () => ({
  writeAsStringAsync: jest.fn().mockResolvedValue(true),
  documentDirectory: "mockedDir/",
}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: { extra: { apiKey: "mocked-api-key" } },
}));

// Mock expo-router with captured push function
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Correctly mock LayoutWrapper
jest.mock("../components/LayoutWrapper.js", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => React.createElement(View, null, children);
});

// Correctly mock HeaderButtons
jest.mock("../components/HeaderButtons.js", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return () =>
    React.createElement(
      View,
      null,
      React.createElement(Text, null, "HeaderButtons Mock")
    );
});

// Correctly mock MonthPicker with interactive props
jest.mock("../components/MonthPicker.js", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity, TextInput } = require("react-native");

  return ({ monthsAhead, setMonthsAhead, styles }) => {
    return React.createElement(View, { testID: "month-picker" }, [
      React.createElement(Text, { key: "title" }, "Select months ahead:"),
      React.createElement(
        TextInput,
        {
          key: "input",
          testID: "months-input",
          value: monthsAhead,
          onChangeText: setMonthsAhead,
        },
        null
      ),
    ]);
  };
});

// Correctly mock Ionicons with accessible props
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Ionicons: (props) =>
      React.createElement(View, { ...props, testID: "icon" }),
  };
});

// Spy on console methods
global.console = {
  ...global.console,
  log: jest.fn(),
  error: jest.fn(),
};

// Import after mocking
import CalendarFetching from "../screens/CalendarFetching";

// Render helper
const renderWithNav = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe("CalendarFetching Component", () => {
  // Mock successful fetch response
  const mockSuccessResponse = {
    summary: "Test Calendar",
    items: [
      {
        summary: "Meeting",
        start: { dateTime: "2025-03-21T10:00:00Z" },
        end: { dateTime: "2025-03-21T11:00:00Z" },
        location: "Conference Room",
        htmlLink: "https://calendar.google.com/event?id=123",
      },
    ],
  };

  // Mock error fetch response
  const mockErrorResponse = {
    error: {
      message: "Invalid calendar ID",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch = jest.fn();
    // Reset setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("tags the screen name with UXCam when component mounts", async () => {
    renderWithNav(<CalendarFetching />);

    expect(RNUxcam.tagScreenName).toHaveBeenCalledWith("Calendar Fetching");
  });

  test("renders correctly with inputs and buttons", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWithNav(
      <CalendarFetching />
    );

    expect(getByPlaceholderText("Paste Calendar ID here")).toBeTruthy();
    expect(getByText("Connect")).toBeTruthy();
    expect(getByText("Clear History")).toBeTruthy();
    expect(getByTestId("month-picker")).toBeTruthy();
  });

  test("user can input calendar ID", async () => {
    const { getByPlaceholderText } = renderWithNav(<CalendarFetching />);
    const input = getByPlaceholderText("Paste Calendar ID here");

    await act(async () => {
      fireEvent.changeText(input, "test.calendar@gmail.com");
    });

    expect(input.props.value).toBe("test.calendar@gmail.com");
  });

  test("user can change months ahead", async () => {
    const { getByTestId } = renderWithNav(<CalendarFetching />);
    const monthsInput = getByTestId("months-input");

    await act(async () => {
      fireEvent.changeText(monthsInput, "3");
    });

    expect(monthsInput.props.value).toBe("3");
  });

  test("shows alert when trying to connect with empty input", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByText } = renderWithNav(<CalendarFetching />);

    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Invalid",
      "Please enter a valid Calendar ID"
    );
  });

  test("fetches calendar events successfully and redirects to calendar page", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");

    // Mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSuccessResponse),
    });

    const { getByText, getByPlaceholderText, findByText } = renderWithNav(
      <CalendarFetching />
    );

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "test.calendar@gmail.com"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Wait for API response to be processed
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Verify CSV was created
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();

    // Verify calendar ID was saved to AsyncStorage
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "calendarIds",
      JSON.stringify([{ id: "test.calendar@gmail.com", name: "Test Calendar" }])
    );

    // Verify success screen appears
    const successMessage = await findByText(/Successful Connection/);
    expect(successMessage).toBeTruthy();

    // Fast-forward timers to trigger redirect
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify navigation to calendar page
    expect(mockPush).toHaveBeenCalledWith("../screens/CalendarSchedulePage");
  });

  test("handles API error responses correctly", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    // Mock fetch to return error
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockErrorResponse),
    });

    const { getByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "invalid.calendar@gmail.com"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Wait for API response to be processed
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Verify error alert was shown
    expect(alertSpy).toHaveBeenCalledWith(
      "Error",
      "API Error: Invalid calendar ID"
    );
  });

  test("handles empty events array correctly", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    // Mock fetch to return empty events array
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ summary: "Empty Calendar", items: [] }),
    });

    const { getByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "empty.calendar@gmail.com"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Wait for API response to be processed
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Verify error alert was shown
    expect(alertSpy).toHaveBeenCalledWith(
      "No Events",
      "No upcoming events found."
    );
  });

  test("handles network fetch error correctly", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    // Mock fetch to throw error
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { getByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "test.calendar@gmail.com"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Wait for error to be caught
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    // Verify error alert was shown
    expect(alertSpy).toHaveBeenCalledWith(
      "Error",
      "Something went wrong while fetching the events."
    );
  });

  test("logs event and clears calendar history when pressing Clear History", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    const { getByText } = renderWithNav(<CalendarFetching />);

    await act(async () => {
      fireEvent.press(getByText("Clear History"));
    });

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Clear History Button Pressed"
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
  });

  test("logs error when clearing history fails", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.removeItem.mockRejectedValue(new Error("Storage error"));

    const { getByText } = renderWithNav(<CalendarFetching />);

    await act(async () => {
      fireEvent.press(getByText("Clear History"));
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to clear calendar history",
        expect.any(Error)
      );
    });
  });

  test("loads stored calendar IDs on mount", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: "saved-id", name: "Saved Calendar" }])
    );

    const { findByText } = renderWithNav(<CalendarFetching />);

    expect(await findByText("Saved Calendar")).toBeTruthy();
  });

  test("handles error when loading stored calendar IDs", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

    renderWithNav(<CalendarFetching />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error loading stored calendar IDs",
        expect.any(Error)
      );
    });
  });

  test("logs event and allows selecting a stored calendar ID", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: "stored-calendar", name: "Stored Calendar" }])
    );

    const { findByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    const storedCalendar = await findByText("Stored Calendar");

    await act(async () => {
      fireEvent.press(storedCalendar);
    });

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Stored Calendar Ids Button Pressed"
    );
    expect(getByPlaceholderText("Paste Calendar ID here").props.value).toBe(
      "stored-calendar"
    );
  });

  test("renders calendar history box with multiple stored calendar IDs", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([
        { id: "calendar-1", name: "Work Calendar" },
        { id: "calendar-2", name: "Personal Calendar" },
      ])
    );

    const { findByText } = renderWithNav(<CalendarFetching />);

    // Check that history items are rendered in the box
    expect(await findByText("Work Calendar")).toBeTruthy();
    expect(await findByText("Personal Calendar")).toBeTruthy();
  });

  test("skips saving duplicate calendar IDs", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");

    // Set up initial stored calendars
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: "existing-calendar", name: "Existing Calendar" }])
    );

    // Mock fetch to return success for the same ID that's already stored
    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          summary: "Existing Calendar",
          items: [{ summary: "Some Event" }],
        }),
    });

    const { getByText, getByPlaceholderText, findByText } = renderWithNav(
      <CalendarFetching />
    );

    // Wait for stored calendars to load
    await findByText("Existing Calendar");

    // Enter the same calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "existing-calendar"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Verify AsyncStorage was not called to store a duplicate
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test("shows 'No history yet' when no calendars are stored", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue(null);

    const { findByText } = renderWithNav(<CalendarFetching />);

    expect(await findByText("No history yet.")).toBeTruthy();
  });

  test("handles saving calendar ID error", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");

    // Set AsyncStorage to throw on setItem
    AsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

    // Mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          summary: "New Calendar",
          items: [{ summary: "Some Event" }],
        }),
    });

    const { getByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "new.calendar@gmail.com"
      );
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
    });

    // Verify error was logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to save calendar ID and name",
        expect.any(Error)
      );
    });
  });
});
