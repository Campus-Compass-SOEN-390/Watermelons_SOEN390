import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomePage from "../screens/HomePage";
import RNUxcam from "react-native-ux-cam";

// Create a mock for the push function
const mockPush = jest.fn();

// Mock useFeedback hook
jest.mock('../context/FeedbackContext', () => ({
    useFeedback: () => ({
        vibrationEnabled: true,
        soundEnabled: true,
        speechEnabled: true
    })
}));

// Mock useButtonInteraction hook
jest.mock('../hooks/useButtonInteraction', () => ({
    useButtonInteraction: () => ({
        handleButtonPress: (route, buttonText) => {
            mockPush(route);
        }
    })
}));

// Mocking useRouter from expo-router to return the mock push function
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock UXCam for testing
jest.mock("react-native-ux-cam", () => ({
  tagScreenName: jest.fn(),
  logEvent: jest.fn(),
  startWithConfiguration: jest.fn(),
  optIntoSchematicRecordings: jest.fn(),
  // Add any other UXCam methods you use
}));

describe("Home page", () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockPush.mockClear();
    RNUxcam.tagScreenName.mockClear();
    RNUxcam.logEvent.mockClear();
  });

  it("should load homepage and buttons on startup", () => {
    const page = render(<HomePage />);
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
  });

  it("should tag the screen name with UXCam when component mounts", () => {
    render(<HomePage />);
    expect(RNUxcam.tagScreenName).toHaveBeenCalledWith("HomePage");
  });

  it("should go to sgw campus and log event when sgw campus button is pressed", () => {
    const page = render(<HomePage />);
    const sgwButton = page.getByTestId("sgwButton");
    fireEvent.press(sgwButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith("SGW Campus Button Pressed");
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/map?type=sgw");
  });

  it("should go to loyola campus and log event when loyola campus button is pressed", () => {
    const page = render(<HomePage />);
    const loyolaButton = page.getByTestId("loyolaButton");
    fireEvent.press(loyolaButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith("Loyola Campus Button Pressed");
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/map?type=loy");
  });

  it("should navigate to Shuttle Bus Schedule when shuttle schedule button is pressed", () => {
    const page = render(<HomePage />);
    const shuttleScheduleButton = page.getByTestId("shuttleScheduleButton");
    fireEvent.press(shuttleScheduleButton);

    // No UXCam event for shuttle button in the component
    expect(RNUxcam.logEvent).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/screens/ShuttleScheduleScreen");
  });

  it("should navigate to Point of Interest Page and log event when point of interest button is pressed", () => {
    const page = render(<HomePage />);
    const interestButton = page.getByTestId("interestButton");
    fireEvent.press(interestButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith("Interest point Button Pressed");
    expect(mockPush).toHaveBeenCalledWith("(tabs)/interest-points");
  });

  it("should navigate to calendar fetching and log event when calendar button is pressed", () => {
    const page = render(<HomePage />);
    const calendarButton = page.getByTestId("calendarfetchbutton");
    fireEvent.press(calendarButton);

    expect(RNUxcam.logEvent).toHaveBeenCalledWith("Google Calendar Button Pressed");
    expect(mockPush).toHaveBeenCalledWith("screens/CalendarFetching");
  });

  it('should display Google icon in Connect Calendars button', () => {
    const page = render(<HomePage />);
    const googleIcon = page.getByTestId('googleIcon');
    const calendarButton = page.getByTestId('calendarfetchbutton');
    
    expect(googleIcon).toBeTruthy();
    expect(calendarButton).toContainElement(googleIcon);
  });
});
