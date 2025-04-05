import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import fetchMock from "jest-fetch-mock";
import CalendarFetching from "../screens/CalendarFetching";

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
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

// Mock expo-file-system
jest.mock("expo-file-system", () => ({
    writeAsStringAsync: jest.fn(),
    documentDirectory: "mock_directory/",
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock RNUxcam
jest.mock('react-native-ux-cam', () => ({
    logEvent: jest.fn(),
    tagScreenName: jest.fn()
}));

// Mock useButtonInteraction
jest.mock('../hooks/useButtonInteraction', () => ({
    useButtonInteraction: () => ({
        handleButtonPress: jest.fn()
    })
}));

// Mock components
jest.mock('../components/LayoutWrapper.js', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ children }) => React.createElement(View, null, children);
});

jest.mock('../components/HeaderButtons.js', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => React.createElement(View, null, React.createElement(Text, null, 'HeaderButtons Mock'));
});

jest.mock("../components/MonthPicker.js", () => {
    const React = require("react");
    const { View, Text, TextInput } = require("react-native");
    return ({ monthsAhead, setMonthsAhead }) => {
        return React.createElement(View, { testID: "month-picker" }, [
            React.createElement(Text, { key: "title" }, "Select months ahead:"),
            React.createElement(TextInput, {
                key: "input",
                testID: "months-input",
                value: monthsAhead,
                onChangeText: setMonthsAhead,
            }, null),
        ]);
    };
});

jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View);
    },
}));

jest.spyOn(Alert, "alert");
fetchMock.enableMocks();

// Render helper
const renderWithNav = (ui) => render(<NavigationContainer>{ui}</NavigationContainer>);

describe('CalendarFetching Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
    });

    test("renders correctly", () => {
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
        expect(getByPlaceholderText(/Paste Calendar ID here/i)).toBeDefined();
        expect(getByText(/Connect/i)).toBeDefined();
    });

    test("shows error alert when Calendar ID is blank", async () => {
        const { getByText } = renderWithNav(<CalendarFetching />);
        fireEvent.press(getByText(/Connect/i));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Invalid", "Please enter a valid Calendar ID");
        });
    });

    test("fetches calendar events successfully", async () => {
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

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
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

        fetchMock.mockResponseOnce(JSON.stringify({ error: { message: "API Error" } }));

        fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
        fireEvent.press(getByText(/Connect/i));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "API Error: API Error");
        });
    });

    test("shows no events alert when no events are found", async () => {
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

        fetchMock.mockResponseOnce(JSON.stringify({ items: [] }));

        fireEvent.changeText(getByPlaceholderText(/Paste Calendar ID here/i), "test-calendar-id");
        fireEvent.press(getByText(/Connect/i));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("No Events", "No upcoming events found.");
        });
    });

    test("stores calendar ID in AsyncStorage", async () => {
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
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
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
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
        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
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
        const { getByText } = renderWithNav(<CalendarFetching />);
        fireEvent.press(getByText(/Clear History/i));
        await waitFor(() => {
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith("calendarIds");
        });
    });

    test('renders calendar history box with stored calendar IDs', async () => {
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        AsyncStorage.getItem.mockResolvedValue(
            JSON.stringify([
                { id: 'calendar-1', name: 'Work Calendar' },
                { id: 'calendar-2', name: 'Personal Calendar' },
            ])
        );

        const { findByText } = renderWithNav(<CalendarFetching />);

        // Check that history items are rendered in the box
        expect(await findByText('Work Calendar')).toBeTruthy();
        expect(await findByText('Personal Calendar')).toBeTruthy();
    });

    test('handles API error from fetch', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
            })
        );
        const alertSpy = jest.spyOn(Alert, 'alert');

        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);
        
        fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'test-calendar');
        fireEvent.press(getByText('Connect'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'API Error: Invalid API key');
        });
    });

    test('handles API error from fetch', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: async () => ({ error: { message: 'Invalid API key' } }),
        });

        const alertSpy = jest.spyOn(Alert, 'alert');

        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

        fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'invalid-id');
        fireEvent.press(getByText('Connect'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Error", "API Error: Invalid API key");
        });
    });

    test('fetches and stores calendar events successfully', async () => {
        const mockItems = [
            {
                summary: "Event 1",
                start: { dateTime: "2025-03-21T10:00:00Z" },
                end: { dateTime: "2025-03-21T11:00:00Z" },
                location: "Conference Room",
                htmlLink: "http://example.com"
            },
        ];

        global.fetch = jest.fn().mockResolvedValue({
            json: async () => ({ items: mockItems, summary: "Test Calendar" }),
        });

        const AsyncStorage = require('@react-native-async-storage/async-storage');
        const FileSystem = require('expo-file-system');

        const { getByPlaceholderText, getByText } = renderWithNav(<CalendarFetching />);

        fireEvent.changeText(getByPlaceholderText('Paste Calendar ID here'), 'test-calendar');
        fireEvent.press(getByText('Connect'));

        await waitFor(() => {
            expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
                'mockedDir/calendar_events.csv',
                expect.stringContaining("Event 1")
            );

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                'calendarIds',
                JSON.stringify([{ id: 'test-calendar', name: 'Test Calendar' }])
            );

            expect(getByText('Successful Connection to Google Calendar ID: test-calendar')).toBeTruthy();
        });
    });
});
