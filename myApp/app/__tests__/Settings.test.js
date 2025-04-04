import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from '../screens/SettingsPage';

// Mock the FeedbackContext
const mockToggleVibration = jest.fn();
const mockToggleSound = jest.fn();
const mockToggleSpeech = jest.fn();

jest.mock('../context/FeedbackContext', () => ({
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
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Mock useButtonInteraction hook
jest.mock('../hooks/useButtonInteraction', () => ({
    useButtonInteraction: () => ({
        handleButtonPress: jest.fn(),
    }),
}));

// Mock LayoutWrapper
jest.mock('../components/LayoutWrapper.js', () => {
    const { View } = require('react-native');
    const React = require('react');
    const PropTypes = require('prop-types');
    const LayoutWrapperMock = ({ children }) => React.createElement(View, null, children);
    LayoutWrapperMock.propTypes = {
        children: PropTypes.node,
    };
    return LayoutWrapperMock;
});

// Mock HeaderButtons
jest.mock('../components/HeaderButtons.js', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => React.createElement(View, null, React.createElement(Text, null, 'HeaderButtons Mock'));
});

describe('Settings Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByTestId, getByText } = render(<Settings />);
        expect(getByText('Settings')).toBeTruthy();
        expect(getByTestId('black-mode-toggle')).toBeTruthy();
        expect(getByTestId('vibration-toggle')).toBeTruthy();
        expect(getByTestId('sound-toggle')).toBeTruthy();
        expect(getByTestId('speech-toggle')).toBeTruthy();
    });

    it('toggles black mode setting', () => {
        const { getByTestId } = render(<Settings />);
        const blackMode = getByTestId('black-mode-toggle');

        fireEvent(blackMode, 'onValueChange', true);
        expect(blackMode.props.value).toBe(true);

        fireEvent(blackMode, 'onValueChange', false);
        expect(blackMode.props.value).toBe(false);
    });


    it('calls toggleVibration when vibration switch is toggled', () => {
        const { getByTestId } = render(<Settings />);
        const vibrationToggle = getByTestId('vibration-toggle');

        fireEvent(vibrationToggle, 'onValueChange', true);
        expect(mockToggleVibration).toHaveBeenCalledTimes(1);
    });

    it('calls toggleSound when sound switch is toggled', () => {
        const { getByTestId } = render(<Settings />);
        const soundToggle = getByTestId('sound-toggle');

        fireEvent(soundToggle, 'onValueChange', true);
        expect(mockToggleSound).toHaveBeenCalledTimes(1);
    });

    it('calls toggleSpeech when speech switch is toggled', () => {
        const { getByTestId } = render(<Settings />);
        const speechToggle = getByTestId('speech-toggle');

        fireEvent(speechToggle, 'onValueChange', true);
        expect(mockToggleSpeech).toHaveBeenCalledTimes(1);
    });
});