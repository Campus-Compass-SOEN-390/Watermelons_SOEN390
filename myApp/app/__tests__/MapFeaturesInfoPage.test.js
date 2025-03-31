import React from 'react';
import { render } from '@testing-library/react-native';
import InfoPage4 from '../app/screens/MapFeaturesInfoPage';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('MapFeaturesInfoPage', () => {
  it('renders title, description, and instructions', () => {
    const { getByText } = render(<InfoPage4 />);

    expect(getByText('Campus Map Features')).toBeTruthy();
    expect(getByText('Interactive building pop up.')).toBeTruthy();

    // Instructional steps
    expect(getByText(/1. Tap on any building/i)).toBeTruthy();
    expect(getByText(/2. Use \"Get Directions\"/i)).toBeTruthy();
    expect(getByText(/3. Choose \"Use as Starting Point\"/i)).toBeTruthy();
  });

  it('renders the two popup images', () => {
    const { getAllByRole } = render(<InfoPage4 />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});
