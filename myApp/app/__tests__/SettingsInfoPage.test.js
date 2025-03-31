import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsInfoPage from '../../app/screens/SettingsInfoPage';

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('SettingsInfoPage', () => {
  it('renders title and description text', () => {
    const { getByText } = render(<SettingsInfoPage />);

    expect(getByText('Settings Page')).toBeTruthy();
    expect(
      getByText(/Adjust settings according to your preferences/i)
    ).toBeTruthy();
    expect(
      getByText(/Describe the usability of each feature/i)
    ).toBeTruthy();
  });

  it('renders settings image', () => {
    const { getByRole } = render(<SettingsInfoPage />);
    expect(getByRole('image')).toBeTruthy();
  });

  it('displays all navigation buttons', () => {
    const { getAllByRole } = render(<SettingsInfoPage />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(3); // Home, Settings, Back
  });
});
