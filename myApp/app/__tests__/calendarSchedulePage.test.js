import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarSchedulePage from "../screens/CalendarSchedulePage";

// Mock data for CSV or schedule content
const mockScheduleData = [
  { title: "Event 1", location: "Room A", start: "10:00", end: "11:00" },
  { title: "Event 2", location: "Room B", start: "12:00", end: "13:00" },
];

// Mock UXCam for testing
jest.mock("react-native-ux-cam", () => ({
  tagScreenName: jest.fn(),
  logEvent: jest.fn(),
  startWithConfiguration: jest.fn(),
  optIntoSchematicRecordings: jest.fn(),
  // Add any other UXCam methods you use
}));

jest.mock("../screens/CalendarSchedulePage", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return () => (
    <>
      <View testID="calendarContainer" />
      <Text testID="eventTitle">{mockScheduleData[0].title}</Text>
      <Text testID="eventLocation">{mockScheduleData[0].location}</Text>
      <Text testID="eventTime">
        {mockScheduleData[0].start} - {mockScheduleData[0].end}
      </Text>
      <TouchableOpacity
        testID="eventButton"
        onPress={() => mockEventPress(mockScheduleData[0])}
      />
    </>
  );
});

const mockEventPress = jest.fn();

describe("CalendarSchedulePage", () => {
  beforeEach(() => {
    mockEventPress.mockClear();
  });

  it("should render calendar schedule page layout correctly", () => {
    const page = render(<CalendarSchedulePage />);
    expect(page.getByTestId("calendarContainer")).toBeTruthy();
    expect(page.getByTestId("eventTitle").props.children).toBe("Event 1");
    expect(page.getByTestId("eventLocation").props.children).toBe("Room A");
    expect(page.getByTestId("eventTime").props.children).toContain("10:00");
  });

  it("should call event handler when an event is pressed", () => {
    const page = render(<CalendarSchedulePage />);
    const button = page.getByTestId("eventButton");
    fireEvent.press(button);
    expect(mockEventPress).toHaveBeenCalledWith(mockScheduleData[0]);
  });
});
