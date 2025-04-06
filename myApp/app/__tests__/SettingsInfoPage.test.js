import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsInfoPage from '../../app/screens/SettingsInfoPage';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('SettingsInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('renders title and description text', () => {
    const { getByText } = render(<SettingsInfoPage />);

    expect(getByText('Settings Page')).toBeTruthy();
    expect(getByText(/Adjust settings according to your preferences/i)).toBeTruthy();
    expect(getByText(/Describe the usability of each feature/i)).toBeTruthy();
  });

  it('renders settings image', () => {
    const { getByRole } = render(<SettingsInfoPage />);
    expect(getByRole('image')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<SettingsInfoPage />);
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();
  });
});
