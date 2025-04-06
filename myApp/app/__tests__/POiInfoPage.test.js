import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PoiInfoPage from '../../app/screens/PoiInfoPage';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

jest.mock('expo-av', () => {
  const React = require('react');
  return {
    Video: () => <></>, // Mock Video component
  };
});

describe('PoiInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('renders title, section name, and description', () => {
    const { getByText } = render(<PoiInfoPage />);
    expect(getByText('Campus Map Features')).toBeTruthy();
    expect(getByText('Points of Interest')).toBeTruthy();
    expect(getByText(/Explore nearby points of interest/i)).toBeTruthy();
  });

  it('displays navigation buttons', () => {
    const { getAllByRole } = render(<PoiInfoPage />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('navigates back when Back button is pressed', () => {
    const { getByTestId } = render(<PoiInfoPage />);
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates to AccessibilityInfoPage when Next button is pressed', () => {
    const { getByTestId } = render(<PoiInfoPage />);
    fireEvent.press(getByTestId('nextButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/AccessibilityInfoPage');
  });
});
