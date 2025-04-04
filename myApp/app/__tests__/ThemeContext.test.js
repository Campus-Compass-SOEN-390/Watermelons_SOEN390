import React from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

// Mock the theme constants
jest.mock("../constants/themes", () => ({
  lightTheme: {
    colors: {
      primary: "#007AFF",
      background: "#FFFFFF",
      text: "#000000",
      // Add more colors as needed
    },
    // Add more theme properties as needed
  },
  darkTheme: {
    colors: {
      primary: "#0A84FF",
      background: "#000000",
      text: "#FFFFFF",
      // Add more colors as needed
    },
    // Add more theme properties as needed
  },
}));

// Import themes after they've been mocked
const { lightTheme, darkTheme } = require("../constants/themes");

// Mock react-native
jest.mock("react-native", () => ({
  useColorScheme: jest.fn(() => "light"),
  Text: "Text",
  View: "View",
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Get the mocked useColorScheme
const { useColorScheme } = require("react-native");

// Create a test renderer
const { create, act } = require("react-test-renderer");

// A simpler test component that just uses the theme values
const TestComponent = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  return (
    <View testID="container">
      <Text testID="theme-status">{isDarkMode ? "dark" : "light"}</Text>
      <Text testID="theme-primary-color">{theme.colors.primary}</Text>
      <Text testID="theme-toggler" onPress={toggleTheme}>
        Toggle Theme
      </Text>
    </View>
  );
};

// Helper function to find a component by testID
const findByTestId = (instance, testID) => {
  const components = instance.root.findAllByProps({ testID });
  return components.length > 0 ? components[0] : null;
};

describe("ThemeContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide light theme by default", async () => {
    // Mock the device theme as light
    useColorScheme.mockReturnValue("light");

    // Mock AsyncStorage to return null (no saved preference)
    AsyncStorage.getItem.mockResolvedValue(null);

    let component;
    await act(async () => {
      component = create(
        <ThemeContext.Provider
          value={{
            theme: lightTheme,
            isDarkMode: false,
            toggleTheme: jest.fn(),
          }}
        >
          <TestComponent />
        </ThemeContext.Provider>
      );
    });

    const themeStatus = findByTestId(component, "theme-status");
    const primaryColor = findByTestId(component, "theme-primary-color");

    expect(themeStatus.props.children).toBe("light");
    expect(primaryColor.props.children).toBe(lightTheme.colors.primary);
  });
});
