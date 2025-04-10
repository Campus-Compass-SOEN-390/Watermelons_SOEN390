import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomePage from "../screens/HomePage";
import RNUxcam from "react-native-ux-cam";
import { ThemeContext } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../constants/themes";

// Create mocks
const mockPush = jest.fn();
const mockHandleButtonPress = jest.fn();

// Mock RNUxcam
jest.mock("react-native-ux-cam", () => ({
  logEvent: jest.fn(),
  tagScreenName: jest.fn(),
}));

// Mock useButtonInteraction
jest.mock("../hooks/useButtonInteraction", () => ({
  useButtonInteraction: () => ({
    handleButtonPress: mockHandleButtonPress,
  }),
}));

// Mock useRouter
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
// Correctly mock LayoutWrapper
jest.mock("../components/LayoutWrapper.js", () => {
  const React = require("react");
  const PropTypes = require("prop-types");
  const { View } = require("react-native");
  const LayoutWrapper = ({ children }) => React.createElement(View, null, children);
  LayoutWrapper.propTypes = {
    children: PropTypes.node,
  };
  return LayoutWrapper;
});

// Correctly mock HeaderButtons
jest.mock("../components/HeaderButtons.js", () => {
  const React = require("react");
  const PropTypes = require("prop-types");
  const { View, Text } = require("react-native");
  const HeaderButtons = ({ children }) =>
    React.createElement(
      View,
      null,
      React.createElement(Text, null, "HeaderButtons Mock"),
      children
    );
  HeaderButtons.propTypes = {
    children: PropTypes.node,
  };
  return HeaderButtons;
});

// Helper function to render with ThemeContext
const renderWithTheme = (ui, { isDarkMode = false } = {}) => {
  const mockToggleTheme = jest.fn();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return render(
    <ThemeContext.Provider
      value={{ theme, isDarkMode, toggleTheme: mockToggleTheme }}
    >
      {ui}
    </ThemeContext.Provider>
  );
};

describe("Home page", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should load homepage and buttons on startup", () => {
    const page = renderWithTheme(<HomePage />);
    const logo = page.getByTestId("logo");
    const googleIcon = page.getByTestId("googleIcon");
    const sgwButton = page.getByTestId("sgwButton");
    const loyolaButton = page.getByTestId("loyolaButton");
    const shuttleScheduleButton = page.getByTestId("shuttleScheduleButton");
    const interestButton = page.getByTestId("interestButton");
    const googleButton = page.getByTestId("calendarfetchbutton");

    expect(logo).toBeTruthy();
    expect(googleIcon).toBeTruthy();
    expect(sgwButton).toBeTruthy();
    expect(loyolaButton).toBeTruthy();
    expect(shuttleScheduleButton).toBeTruthy();
    expect(interestButton).toBeTruthy();
    expect(googleButton).toBeTruthy();
    expect(RNUxcam.tagScreenName).toHaveBeenCalledWith("HomePage");
  });

  it("should go to sgw campus and log event when sgw campus button is pressed", () => {
    const page = renderWithTheme(<HomePage />);
    const sgwButton = page.getByTestId("sgwButton");

    fireEvent.press(sgwButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith("SGW Campus Button Pressed");
    expect(mockHandleButtonPress).toHaveBeenCalledWith(
      "/(tabs)/map?type=sgw",
      "SGW Campus"
    );
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/map?type=sgw");
  });

  it("should go to loyola campus and log event when loyola campus button is pressed", () => {
    const page = renderWithTheme(<HomePage />);
    const loyolaButton = page.getByTestId("loyolaButton");

    fireEvent.press(loyolaButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Loyola Campus Button Pressed"
    );
    expect(mockHandleButtonPress).toHaveBeenCalledWith(
      "/(tabs)/map?type=loy",
      "Loyola Campus"
    );
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/map?type=loy");
  });

  it("should navigate to Shuttle Bus Schedule when shuttle schedule button is pressed", () => {
    const page = renderWithTheme(<HomePage />);
    const shuttleScheduleButton = page.getByTestId("shuttleScheduleButton");

    fireEvent.press(shuttleScheduleButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Shuttle Bus Schedule Button Pressed"
    );
    expect(mockHandleButtonPress).toHaveBeenCalledWith(
      "/screens/ShuttleScheduleScreen",
      "Shuttle Bus Schedule"
    );
    expect(mockPush).toHaveBeenCalledWith("/screens/ShuttleScheduleScreen");
  });

  it("should navigate to Point of Interest Page and log event when point of interest button is pressed", () => {
    const page = renderWithTheme(<HomePage />);
    const interestButton = page.getByTestId("interestButton");

    fireEvent.press(interestButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Interest Points Button Pressed"
    );
    expect(mockHandleButtonPress).toHaveBeenCalledWith(
      "(tabs)/interest-points",
      "Interest Points"
    );
    expect(mockPush).toHaveBeenCalledWith("(tabs)/interest-points");
  });

  it("should navigate to calendar fetching and log event when calendar button is pressed", () => {
    const page = renderWithTheme(<HomePage />);
    const calendarButton = page.getByTestId("calendarfetchbutton");

    fireEvent.press(calendarButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith(
      "Connect Calendars Button Pressed"
    );
    expect(mockHandleButtonPress).toHaveBeenCalledWith(
      "screens/CalendarFetching",
      "Connect Calendars"
    );
    expect(mockPush).toHaveBeenCalledWith("screens/CalendarFetching");
  });

  it("should display Google icon in Connect Calendars button", () => {
    const page = renderWithTheme(<HomePage />);
    const googleIcon = page.getByTestId("googleIcon");
    const calendarButton = page.getByTestId("calendarfetchbutton");

    expect(googleIcon).toBeTruthy();
    expect(calendarButton).toContainElement(googleIcon);
  });

  it("should render correctly in dark mode", () => {
    const page = renderWithTheme(<HomePage />, { isDarkMode: true });
    // This confirms that the page loads in dark mode without errors
    expect(page.getByTestId("logo")).toBeTruthy();
    // You could add more specific assertions here if the HomePage has
    // visually distinct elements in dark mode
  });
});
