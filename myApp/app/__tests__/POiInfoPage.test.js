import React from 'react';
import { render } from '@testing-library/react-native';
import PoiInfoPage from '../../app/screens/PoiInfoPage';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock expo-av Video
jest.mock('expo-av', () => {
  const React = require('react');
  return {
    Video: () => <></>, // Placeholder for video during tests
  };
});

describe('PoiInfoPage', () => {
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
});
