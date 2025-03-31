jest.mock('react-native-ux-cam', () => ({
    __esModule: true,
    default: {
      tagScreenName: jest.fn(),
      logEvent: jest.fn(),
    },
  }), { virtual: true });
  
  jest.mock('../hooks/useButtonInteraction', () => ({
    useButtonInteraction: () => ({
      handleButtonPress: jest.fn(),
    }),
  }));
  
  const mockPush = jest.fn();
  
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
  
  import React from 'react';
  import { render, fireEvent } from '@testing-library/react-native';
  import HomePage from '../screens/HomePage';
  
  describe('Home page', () => {
    beforeEach(() => {
      mockPush.mockClear();
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
  
    it('should go to sgw campus when sgw campus button is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('sgwButton'));
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=sgw');
    });
  
    it('should go to loyola campus when loyola campus button is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('loyolaButton'));
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/map?type=loy');
    });
  
    it('should navigate to Shuttle Bus Schedule when shuttle schedule button is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('shuttleScheduleButton'));
      expect(mockPush).toHaveBeenCalledWith('/screens/ShuttleScheduleScreen');
    });
  
    it('should navigate to Point of Interest Page when point of interest button is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('interestButton'));
      expect(mockPush).toHaveBeenCalledWith('(tabs)/interest-points');
    });
  
    it('should navigate to Calendar Fetching Page when calendarfetchbutton is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('calendarfetchbutton'));
      expect(mockPush).toHaveBeenCalledWith('screens/CalendarFetching');
    });
  
    it('should navigate to Info Page when infoButton is pressed', () => {
      const page = render(<HomePage />);
      fireEvent.press(page.getByTestId('infoButton'));
      expect(mockPush).toHaveBeenCalledWith('/screens/InfoPage');
    });
  });
  