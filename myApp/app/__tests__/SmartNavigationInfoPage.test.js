import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SmartNavigationInfoPage from '../screens/SmartNavigationInfoPage';

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
    Video: () => <></>,
  };
});

describe('SmartNavigationInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('renders the Smart Navigation title and description', () => {
    const { getByText, getAllByText } = render(<SmartNavigationInfoPage />);
    const headings = getAllByText('Smart Navigation');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(getByText('Get directions to your next event on campus in seconds.')).toBeTruthy();
  });

  it('calls router.back() when Back button is pressed', () => {
    const { getByTestId } = render(<SmartNavigationInfoPage />);
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates to MapFeaturesInfoPage when Next button is pressed', () => {
    const { getByTestId } = render(<SmartNavigationInfoPage />);
    fireEvent.press(getByTestId('nextButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/MapFeaturesInfoPage');
  });
});
