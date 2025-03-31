import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccessibilityInfoPage from '../../app/screens/AccessibilityInfoPage';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('AccessibilityInfoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, section label, and descriptive text', () => {
    const { getByText } = render(<AccessibilityInfoPage />);
    expect(getByText('Campus Map Features')).toBeTruthy();
    expect(getByText('Accessibility-Friendly Routes')).toBeTruthy();
    expect(
      getByText(/On the left is the standard route/i)
    ).toBeTruthy();
  });

  it('renders two accessibility screenshots', () => {
    const { getAllByRole } = render(<AccessibilityInfoPage />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('renders and interacts with all navigation buttons', () => {
    const { getByTestId } = render(<AccessibilityInfoPage />);

    // Press home button
    fireEvent.press(getByTestId('backToHomeButton'));
    expect(mockPush).toHaveBeenCalledWith('/');

    // Press settings button
    fireEvent.press(getByTestId('settingsButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/SettingsPage');

    // Press back button
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();

    // Press next page button
    fireEvent.press(getByTestId('nextPageButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/ShuttleInfoPage');
  });
});
