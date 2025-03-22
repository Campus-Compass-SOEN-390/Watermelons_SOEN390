import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CalendarFetching from "../screens/CalendarFetching";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import fetchMock from "jest-fetch-mock";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  writeAsStringAsync: jest.fn(),
  documentDirectory: "mock_directory/",
}));

jest.spyOn(Alert, "alert");
fetchMock.enableMocks();

describe("CalendarFetching Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  test("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    expect(getByPlaceholderText(/Paste Calendar ID here/i)).toBeDefined();
    expect(getByText(/Connect/i)).toBeDefined();
  });

  test("shows error alert when Calendar ID is blank", async () => {
    const { getByText } = render(<CalendarFetching />);
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Invalid", "Please enter a valid Calendar ID");
    });
  });

  test("fetches calendar events successfully", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  test("handles API errors correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(JSON.stringify({ error: { message: "API Error" } }));

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "API Error: API Error");
    });
  });

  test("shows no events alert when no events are found", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);

    fetchMock.mockResponseOnce(JSON.stringify({ items: [] }));

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("No Events", "No upcoming events found.");
    });
  });

  test("stores calendar ID in AsyncStorage", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  test("does not store duplicate calendar IDs", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    fetchMock.mockClear();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  test("writes CSV file after fetching events", async () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        items: [{ summary: "Event 1", start: {}, end: {}, location: "", htmlLink: "" }],
        summary: "Mock Calendar",
      })
    );

    fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
    fireEvent.press(getByText(/Connect/i));

    await waitFor(() => {
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        "mock_directory/calendar_events.csv",
        expect.any(String)
      );
    });
  });

  test("clears calendar history", async () => {
    const { getByText } = render(<CalendarFetching />);
    fireEvent.press(getByText(/Clear History/i));
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
    });
  });
});