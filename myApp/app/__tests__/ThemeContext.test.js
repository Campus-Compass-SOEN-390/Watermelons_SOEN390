// app/__tests__/ThemeContext.test.js
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Mock just useColorScheme — not the whole react-native package
import * as reactNative from "react-native";
jest.spyOn(reactNative, "useColorScheme").mockReturnValue("light");

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("ThemeContext", () => {
  const TestComponent = () => (
    <ThemeContext.Consumer>
      {({ isDarkMode, toggleTheme }) => (
        <>
          <reactNative.Text testID="modeText">
            {isDarkMode ? "Dark" : "Light"}
          </reactNative.Text>
          <reactNative.Button title="Toggle" onPress={toggleTheme} />
        </>
      )}
    </ThemeContext.Consumer>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads saved theme preference from AsyncStorage", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify("dark"));
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId("modeText").props.children).toBe("Dark");
    });
  });

  it("uses device theme if no preference is saved", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // no saved preference
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId("modeText").props.children).toBe("Light");
    });
  });

  it("toggles theme and updates AsyncStorage", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify("light"));
    const { getByTestId, getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId("modeText").props.children).toBe("Light");
    });

    fireEvent.press(getByText("Toggle"));

    await waitFor(() => {
      expect(getByTestId("modeText").props.children).toBe("Dark");
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "theme_preference",
      JSON.stringify("dark")
    );
  });
});
