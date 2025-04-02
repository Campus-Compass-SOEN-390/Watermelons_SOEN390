import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { lightTheme } from "../constants/themes";
import CalendarFetching from "../screens/CalendarFetching";

// Mock external dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock FeedbackContext
jest.mock("../context/FeedbackContext", () => ({
  useFeedback: () => ({
    vibrationEnabled: false,
    soundEnabled: false,
    speechEnabled: false,
  }),
}));

// Mock feedback utils
jest.mock("../utils/feedback", () => ({
  triggerVibration: jest.fn(),
  triggerSound: jest.fn(),
  triggerSpeech: jest.fn(),
}));

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({ sound: { playAsync: jest.fn() } })
      ),
    },
  },
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => {
  const originalModule = jest.requireActual(
    "@react-native-async-storage/async-storage"
  );
  return {
    ...originalModule,
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn(() => Promise.resolve()),
  };
});

jest.mock("expo-file-system", () => ({
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  documentDirectory: "mockedDir/",
}));

jest.mock("expo-constants", () => ({
  expoConfig: { extra: { apiKey: "mocked-api-key" } },
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

// Correctly mock MonthPicker
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

// Updated render helper with Navigation and Theme contexts
const renderWithNavAndTheme = (ui, { isDarkMode = false } = {}) => {
  const theme = lightTheme;
  const toggleTheme = jest.fn();

  return render(
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <NavigationContainer>{ui}</NavigationContainer>
    </ThemeContext.Provider>
  );
};

describe("CalendarFetching Component", () => {
  let mockAlert;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockAlert = jest.spyOn(Alert, "alert");
  });

  afterEach(() => {
    mockAlert.mockRestore();
  });

  test("fetches and stores calendar events successfully", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    const FileSystem = require("expo-file-system");

    // Mock a successful API response
    const mockItems = [
      {
        summary: "Event 1",
        start: { dateTime: "2025-03-21T10:00:00Z" },
        end: { dateTime: "2025-03-21T11:00:00Z" },
        location: "Conference Room",
        htmlLink: "http://example.com",
      },
    ];

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          items: mockItems,
          summary: "Test Calendar",
        }),
      })
    );

    // Ensure file system write succeeds
    FileSystem.writeAsStringAsync.mockResolvedValue(undefined);

    const { getByPlaceholderText, getByText } = renderWithNavAndTheme(
      <CalendarFetching />
    );

    // Enter calendar ID and press Connect
    fireEvent.changeText(
      getByPlaceholderText("Paste Calendar ID here"),
      "test-calendar"
    );
    fireEvent.press(getByText("Connect"));

    // Wait for and check AsyncStorage.setItem
    await waitFor(
      () => {
        // Log all calls to AsyncStorage.setItem for debugging
        console.log(
          "AsyncStorage.setItem mock calls:",
          AsyncStorage.setItem.mock.calls
        );

        // Expect setItem to be called with these specific arguments
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "calendarIds",
          JSON.stringify([{ id: "test-calendar", name: "Test Calendar" }])
        );
      },
      { timeout: 5000 }
    );

    // Check for success message
    await waitFor(
      () => {
        expect(
          getByText(
            "Successful Connection to Google Calendar ID: test-calendar"
          )
        ).toBeTruthy();
      },
      { timeout: 5000 }
    );
  });
});
