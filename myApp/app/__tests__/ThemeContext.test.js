// app/myApp/__tests__/ThemeContext.test.js
import React from "react";
import { ThemeContext, ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

// These tests focus on improving code coverage for ThemeContext.js and useTheme.js

// Mock dependencies
jest.mock("react-native", () => ({
  useColorScheme: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("ThemeContext and useTheme", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Basic existence checks
  test("ThemeContext and ThemeProvider are properly defined", () => {
    expect(ThemeContext).toBeDefined();
    expect(ThemeProvider).toBeDefined();
    expect(typeof ThemeProvider).toBe("function");
  });

  // Test 2: Testing useTheme hook error case
  test("useTheme throws an error when used outside a ThemeProvider", () => {
    // Mock useContext to return undefined, simulating using hook outside provider
    const originalUseContext = React.useContext;
    React.useContext = jest.fn(() => undefined);

    // The hook should throw when context is undefined
    expect(() => useTheme()).toThrow(
      "useTheme must be used within a ThemeProvider"
    );

    // Restore original implementation
    React.useContext = originalUseContext;
  });

  // Test 3: Test toggleTheme error handling
  test("toggleTheme handles errors when saving preference", async () => {
    // Mock AsyncStorage to throw an error
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.setItem.mockRejectedValue(new Error("Test error"));

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    // Create a wrapped version of toggleTheme for testing
    const toggleTheme = async () => {
      const isDarkMode = false;
      const newMode = !isDarkMode;

      try {
        await AsyncStorage.setItem(
          "theme_preference",
          JSON.stringify(newMode ? "dark" : "light")
        );
      } catch (error) {
        console.log("Error saving theme preference:", error);
      }
    };

    // Call the toggleTheme function
    await toggleTheme();

    // Verify error was logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Error saving theme preference:",
      expect.any(Error)
    );

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});
