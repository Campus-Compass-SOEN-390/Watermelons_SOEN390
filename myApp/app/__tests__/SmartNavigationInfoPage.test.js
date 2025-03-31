import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoPage3 from '../app/screens/SmartNavigationInfoPage'; 

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Optional: Mock expo-av Video
jest.mock('expo-av', () => {
  const React = require('react');
  return {
    Video: (props) => <></>, // Render an empty placeholder
  };
});

describe('SmartNavigationInfoPage', () => {
  it('renders the Smart Navigation title and description', () => {
    const { getByText } = render(<InfoPage3 />);
    expect(getByText('Smart Navigation')).toBeTruthy();
    expect(
      getByText('Get directions to your next event on campus in seconds.')
    ).toBeTruthy();
  });

  it('has working navigation buttons', () => {
    const { getAllByRole } = render(<InfoPage3 />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
