import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../screens/HomePage';

// Create mocks
const mockPush = jest.fn();
const mockHandleButtonPress = jest.fn();

// Mock useButtonInteraction
jest.mock('../hooks/useButtonInteraction', () => ({
  useButtonInteraction: () => ({
    handleButtonPress: mockHandleButtonPress,
  }),
}));

jest.mock('react-native-ux-cam', () => ({
  __esModule: true,
  default: {
    tagScreenName: jest.fn(),
    logEvent: jest.fn(),
  },
}), { virtual: true });

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

jest.mock('../components/LayoutWrapper.js', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }) => React.createElement(View, null, children);
});

jest.mock('../components/HeaderButtons.js', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return () =>
    React.createElement(View, null, React.createElement(Text, null, 'HeaderButtons Mock'));
});

describe('Home page', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockHandleButtonPress.mockClear();
  });

  it('should load homepage and buttons on startup', () => {
    const page = render(<HomePage />);
    expect(page.getByTestId('logo')).toBeTruthy();
    expect(page.getByTestId('googleIcon')).toBeTruthy();
    expect(page.getByTestId('sgwButton')).toBeTruthy();
    expect(page.getByTestId('loyolaButton')).toBeTruthy();
    expect(page.getByTestId('shuttleScheduleButton')).toBeTruthy();
    expect(page.getByTestId('interestButton')).toBeTruthy();
    expect(page.getByTestId('calendarfetchbutton')).toBeTruthy();
    expect(page.getByTestId('infoButton')).toBeTruthy();
  });

  it('should go to sgw campus and log event when sgw campus button is pressed', () => {
    const page = render(<HomePage />);
    const sgwButton = page.getByTestId('sgwButton');
    
    fireEvent.press(sgwButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('/(tabs)/map?type=sgw', 'SGW Campus');
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=sgw');
  });

  it('should go to loyola campus and log event when loyola campus button is pressed', () => {
    const page = render(<HomePage />);
    const loyolaButton = page.getByTestId('loyolaButton');
    
    fireEvent.press(loyolaButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('/(tabs)/map?type=loy', 'Loyola Campus');
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=loy');
  });

  it('should navigate to Shuttle Bus Schedule and log event when shuttle schedule button is pressed', () => {
    const page = render(<HomePage />);
    const shuttleScheduleButton = page.getByTestId('shuttleScheduleButton');
    
    fireEvent.press(shuttleScheduleButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('/screens/ShuttleScheduleScreen', 'Shuttle Bus Schedule');
    expect(mockPush).toHaveBeenCalledWith('/screens/ShuttleScheduleScreen');
  });

  it('should navigate to Point of Interest Page and log event when point of interest button is pressed', () => {
    const page = render(<HomePage />);
    const interestButton = page.getByTestId('interestButton');
    
    fireEvent.press(interestButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('(tabs)/interest-points', 'Interest Points');
    expect(mockPush).toHaveBeenCalledWith('(tabs)/interest-points');
  });

  it('should navigate to calendar fetching and log event when calendar button is pressed', () => {
    const page = render(<HomePage />);
    const calendarButton = page.getByTestId('calendarfetchbutton');
    
    fireEvent.press(calendarButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('screens/CalendarFetching', 'Connect Calendars');
    expect(mockPush).toHaveBeenCalledWith('screens/CalendarFetching');
  });

  it('should navigate to Info Page when infoButton is pressed', () => {
    const page = render(<HomePage />);
    const infoButton = page.getByTestId('infoButton');
    
    fireEvent.press(infoButton);
    
    expect(mockHandleButtonPress).toHaveBeenCalledWith('/screens/InfoPage', 'Info Page');
    expect(mockPush).toHaveBeenCalledWith('/screens/InfoPage');
  });
});
