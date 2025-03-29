import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import RNUxcam from "react-native-ux-cam";

// Mock setImmediate for React Native animations
global.setImmediate = jest.fn((callback) => setTimeout(callback, 0));

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
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
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
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
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
      { testID: "header-buttons" },
      React.createElement(Text, null, "HeaderButtons Mock")
    );
});

// Correctly mock MonthPicker with interactive props
jest.mock("../components/MonthPicker.js", () => {
  const React = require("react");
  const { View, Text, TextInput } = require("react-native");

  return ({ monthsAhead, setMonthsAhead }) => {
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

// Helper function to flush promises
const flushPromises = () =>
  new Promise(jest.requireActual("timers").setImmediate);

describe("CalendarFetching Component", () => {
  // Increase timeout for all tests in this describe block
  jest.setTimeout(10000);

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset default mock implementations
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));
    global.fetch = jest.fn();
  });

  test("tags the screen name with UXCam when component mounts", async () => {
    renderWithNav(<CalendarFetching />);

    // Ensure all promises are resolved
    await act(async () => {
      await flushPromises();
    });

    expect(RNUxcam.tagScreenName).toHaveBeenCalledWith("Calendar Fetching");
  }, 10000);

  test("renders correctly with inputs and buttons", async () => {
    const { getByPlaceholderText, getByText } = renderWithNav(
      <CalendarFetching />
    );

    // Ensure all promises are resolved
    await act(async () => {
      await flushPromises();
    });

    expect(getByPlaceholderText("Paste Calendar ID here")).toBeTruthy();
    expect(getByText("Connect")).toBeTruthy();
    expect(getByText("Clear History")).toBeTruthy();
  }, 10000);

  test("shows alert when trying to connect with empty input", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByText } = renderWithNav(<CalendarFetching />);

    // Ensure all promises are resolved
    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      fireEvent.press(getByText("Connect"));
      await flushPromises();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Invalid",
      "Please enter a valid Calendar ID"
    );
  }, 10000);

  test("logs event and clears calendar history when pressing Clear History", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    const { getByText } = renderWithNav(<CalendarFetching />);

    // Ensure all promises are resolved
    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      fireEvent.press(getByText("Clear History"));
      await flushPromises();
    });

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Clear History Button Pressed"
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
  }, 10000);

  test("loads stored calendar IDs on mount", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockImplementation(() =>
      Promise.resolve(
        JSON.stringify([{ id: "saved-id", name: "Saved Calendar" }])
      )
    );

    const { findByText } = renderWithNav(<CalendarFetching />);

    // Use findByText which waits for the element to appear
    const element = await findByText("Saved Calendar");
    expect(element).toBeTruthy();
  }, 10000);

  test("logs event and selects a stored calendar ID", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockImplementation(() =>
      Promise.resolve(
        JSON.stringify([{ id: "stored-calendar", name: "Stored Calendar" }])
      )
    );

    const { findByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Wait for the stored calendar to appear
    const storedCalendar = await findByText("Stored Calendar");

    await act(async () => {
      fireEvent.press(storedCalendar);
      await flushPromises();
    });

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Stored Calendar Ids Button Pressed"
    );
    expect(getByPlaceholderText("Paste Calendar ID here").props.value).toBe(
      "stored-calendar"
    );
  }, 10000);

  // Basic API tests that don't try to test everything but cover UXCam functionality
  test("API fetch and CSV writing test", async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            summary: "Test Calendar",
            items: [
              {
                summary: "Meeting",
                start: { dateTime: "2025-03-21T10:00:00Z" },
                end: { dateTime: "2025-03-21T11:00:00Z" },
              },
            ],
          }),
      })
    );

    const { getByText, getByPlaceholderText } = renderWithNav(
      <CalendarFetching />
    );

    // Ensure all promises are resolved first
    await act(async () => {
      await flushPromises();
    });

    // Enter calendar ID
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("Paste Calendar ID here"),
        "test@calendar.com"
      );
      await flushPromises();
    });

    // Press connect button
    await act(async () => {
      fireEvent.press(getByText("Connect"));
      await flushPromises();
    });

    // Verify that fetch was called
    expect(global.fetch).toHaveBeenCalled();

    // Verify that file system write was called
    const FileSystem = require("expo-file-system");
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
  }, 10000);
});

// Test outside the main test group
test("renders no history message when no calendars are stored", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage");
  AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

  const { findByText } = renderWithNav(<CalendarFetching />);

  // Use findByText which waits for the element to appear
  const element = await findByText("No history yet.");
  expect(element).toBeTruthy();
}, 10000);

test("renders multiple stored calendar IDs", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage");
  AsyncStorage.getItem.mockImplementation(() =>
    Promise.resolve(
      JSON.stringify([
        { id: "calendar-1", name: "Work Calendar" },
        { id: "calendar-2", name: "Personal Calendar" },
      ])
    )
  );

  const { findByText } = renderWithNav(<CalendarFetching />);

  // Check that history items are rendered in the box
  const element1 = await findByText("Work Calendar");
  const element2 = await findByText("Personal Calendar");

  expect(element1).toBeTruthy();
  expect(element2).toBeTruthy();
}, 10000);

test("handles API error from fetch", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ error: { message: "Invalid API key" } }),
    })
  );
  const alertSpy = jest.spyOn(Alert, "alert");

  const { getByPlaceholderText, getByText } = renderWithNav(
    <CalendarFetching />
  );

  fireEvent.changeText(
    getByPlaceholderText("Paste Calendar ID here"),
    "test-calendar"
  );
  fireEvent.press(getByText("Connect"));

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith(
      "Error",
      "API Error: Invalid API key"
    );
  });
});

test("fetches and stores calendar events successfully", async () => {
  const mockItems = [
    {
      summary: "Event 1",
      start: { dateTime: "2025-03-21T10:00:00Z" },
      end: { dateTime: "2025-03-21T11:00:00Z" },
      location: "Conference Room",
      htmlLink: "http://example.com",
    },
  ];

  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ items: mockItems, summary: "Test Calendar" }),
  });

  const AsyncStorage = require("@react-native-async-storage/async-storage");
  const FileSystem = require("expo-file-system");

  const { getByPlaceholderText, getByText } = renderWithNav(
    <CalendarFetching />
  );

  fireEvent.changeText(
    getByPlaceholderText("Paste Calendar ID here"),
    "test-calendar"
  );
  fireEvent.press(getByText("Connect"));

  await waitFor(() => {
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      "mockedDir/calendar_events.csv",
      expect.stringContaining("Event 1")
    );

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "calendarIds",
      JSON.stringify([{ id: "test-calendar", name: "Test Calendar" }])
    );

    expect(
      getByText("Successful Connection to Google Calendar ID: test-calendar")
    ).toBeTruthy();
  });
});
