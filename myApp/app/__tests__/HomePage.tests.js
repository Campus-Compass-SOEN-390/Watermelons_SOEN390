import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../screens/HomePage';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/', // Mock current path if used in component
}));

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
});
