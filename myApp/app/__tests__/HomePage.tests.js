import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../screens/HomePage';

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
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('Home page', () => {
    beforeEach(() => {
        // Clear mock history before each test
        mockPush.mockClear();
    });

    it('should load homepage and buttons on startup', () => {
        const page = render(<HomePage />);
        const logo = page.getByTestId('logo');
        const googleIcon = page.getByTestId('googleIcon');
        const sgwButton = page.getByTestId('sgwButton');
        const loyolaButton = page.getByTestId('loyolaButton');
        const shuttleScheduleButton = page.getByTestId('shuttleScheduleButton');
        const interestButton = page.getByTestId('interestButton');
        const googleButton = page.getByTestId('calendarfetchbutton');

        expect(logo).toBeTruthy();
        expect(googleIcon).toBeTruthy();
        expect(sgwButton).toBeTruthy();
        expect(loyolaButton).toBeTruthy();
        expect(shuttleScheduleButton).toBeTruthy();
        expect(interestButton).toBeTruthy();
        expect(googleButton).toBeTruthy();
    });

    it('should go to sgw campus when sgw campus button is pressed', () => {
        const page = render(<HomePage />);
        const sgwButton = page.getByTestId('sgwButton');
        fireEvent.press(sgwButton);
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=sgw');
    });

    it('should go to loyola campus when loyola campus button is pressed', () => {
        const page = render(<HomePage />);
        const loyolaButton = page.getByTestId('loyolaButton');
        fireEvent.press(loyolaButton);
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=loy');
    });

    it('should navigate to Shuttle Bus Schedule when shuttle schedule button is pressed', () => {
        const page = render(<HomePage />);
        const shuttleScheduleButton = page.getByTestId('shuttleScheduleButton');
        fireEvent.press(shuttleScheduleButton);
        expect(mockPush).toHaveBeenCalledWith('/screens/ShuttleScheduleScreen');
    });

    it('should navigate to Point of Interest Page when point of interest button is pressed', () => {
        const page = render(<HomePage />);
        const interestButton = page.getByTestId('interestButton');
        fireEvent.press(interestButton);
        expect(mockPush).toHaveBeenCalledWith('(tabs)/interest-points');
    });

    it('should navigate to Calendar Fetching screen when Connect Calendars button is pressed', () => {
        const page = render(<HomePage />);
        const calendarButton = page.getByTestId('calendarfetchbutton');
        
        fireEvent.press(calendarButton);
        
        expect(mockPush).toHaveBeenCalledWith('screens/CalendarFetching');
    });

    it('should display Google icon in Connect Calendars button', () => {
        const page = render(<HomePage />);
        const googleIcon = page.getByTestId('googleIcon');
        const calendarButton = page.getByTestId('calendarfetchbutton');
        
        expect(googleIcon).toBeTruthy();
        expect(calendarButton).toContainElement(googleIcon);
    });
});
