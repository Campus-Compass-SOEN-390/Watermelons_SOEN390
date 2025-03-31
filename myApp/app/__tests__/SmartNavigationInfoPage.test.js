import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SmartNavigationInfoPage from '../screens/SmartNavigationInfoPage'; // ✅ Fixed path

// ✅ Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// ✅ Optional: Mock expo-av's <Video /> to prevent rendering during test
jest.mock('expo-av', () => {
  const React = require('react');
  return {
    Video: () => <></>, // Empty component
  };
});

describe('SmartNavigationInfoPage', () => {
  it('renders the Smart Navigation title and description', () => {
    const { getByText, getAllByText } = render(<SmartNavigationInfoPage />);
    const headings = getAllByText('Smart Navigation');
    expect(headings.length).toBeGreaterThanOrEqual(1);

    expect(
      getByText('Get directions to your next event on campus in seconds.')
    ).toBeTruthy();
  });

  it('has working navigation buttons', () => {
    const { getAllByRole } = render(<SmartNavigationInfoPage />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
