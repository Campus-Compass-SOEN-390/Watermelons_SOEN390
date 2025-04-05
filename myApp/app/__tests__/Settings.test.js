import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Settings from "../screens/SettingsPage";
import { ThemeContext } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../constants/themes";

// Mock the FeedbackContext
const mockToggleVibration = jest.fn();
const mockToggleSound = jest.fn();
const mockToggleSpeech = jest.fn();

jest.mock("../context/FeedbackContext", () => ({
  useFeedback: () => ({
    vibrationEnabled: false,
    soundEnabled: false,
    speechEnabled: false,
    toggleVibration: mockToggleVibration,
    toggleSound: mockToggleSound,
    toggleSpeech: mockToggleSpeech,
  }),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock useButtonInteraction hook
jest.mock("../hooks/useButtonInteraction", () => ({
  useButtonInteraction: () => ({
    handleButtonPress: jest.fn(),
  }),
}));

// Mock HeaderButtons
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

// Helper function to render with ThemeContext
const renderWithTheme = (ui, { isDarkMode = false } = {}) => {
  const mockToggleTheme = jest.fn(); // Mock the toggleTheme function
  const theme = isDarkMode ? darkTheme : lightTheme;

  return {
    ...render(
      <ThemeContext.Provider
        value={{ theme, isDarkMode, toggleTheme: mockToggleTheme }}
      >
        {ui}
      </ThemeContext.Provider>
    ),
    mockToggleTheme, // Return the mock function so tests can check it
  };
};

describe("Settings Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId, getByText } = renderWithTheme(<Settings />);
    expect(getByText("Settings")).toBeTruthy();
    expect(getByTestId("dark-mode-toggle")).toBeTruthy(); // Changed from black-mode-toggle
    expect(getByTestId("vibration-toggle")).toBeTruthy();
    expect(getByTestId("sound-toggle")).toBeTruthy();
    expect(getByTestId("speech-toggle")).toBeTruthy();
  });

  it("calls toggleTheme when dark mode switch is toggled", () => {
    const { getByTestId, mockToggleTheme } = renderWithTheme(<Settings />);
    const darkModeToggle = getByTestId("dark-mode-toggle");

    fireEvent(darkModeToggle, "onValueChange", true);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("calls toggleVibration when vibration switch is toggled", () => {
    const { getByTestId } = renderWithTheme(<Settings />);
    const vibrationToggle = getByTestId("vibration-toggle");

    fireEvent(vibrationToggle, "onValueChange", true);
    expect(mockToggleVibration).toHaveBeenCalledTimes(1);
  });

  it("calls toggleSound when sound switch is toggled", () => {
    const { getByTestId } = renderWithTheme(<Settings />);
    const soundToggle = getByTestId("sound-toggle");

    fireEvent(soundToggle, "onValueChange", true);
    expect(mockToggleSound).toHaveBeenCalledTimes(1);
  });

  it("calls toggleSpeech when speech switch is toggled", () => {
    const { getByTestId } = renderWithTheme(<Settings />);
    const speechToggle = getByTestId("speech-toggle");

    fireEvent(speechToggle, "onValueChange", true);
    expect(mockToggleSpeech).toHaveBeenCalledTimes(1);
  });

  it("renders in dark mode correctly", () => {
    const { getByTestId, mockToggleTheme } = renderWithTheme(<Settings />, {
      isDarkMode: true,
    });

    const darkModeToggle = getByTestId("dark-mode-toggle");

    // Verify that dark mode switch is turned on
    expect(darkModeToggle.props.value).toBe(true);

    // Toggle the switch and check that toggleTheme was called
    fireEvent(darkModeToggle, "onValueChange", false);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
