import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapFeaturesInfoPage from '../../app/screens/MapFeaturesInfoPage';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('MapFeaturesInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('renders title, description, and instructions', () => {
    const { getByText } = render(<MapFeaturesInfoPage />);

    expect(getByText('Campus Map Features')).toBeTruthy();
    expect(getByText('Interactive building pop up.')).toBeTruthy();

    expect(getByText(/1. Tap on any building/i)).toBeTruthy();
    expect(getByText(/2. Use \"Get Directions\"/i)).toBeTruthy();
    expect(getByText(/3. Choose \"Use as Starting Point\"/i)).toBeTruthy();
  });

  it('renders the two popup images', () => {
    const { getAllByRole } = render(<MapFeaturesInfoPage />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('calls router.back() when Back button is pressed', () => {
    const { getByTestId } = render(<MapFeaturesInfoPage />);
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates to POI Info Page when Next button is pressed', () => {
    const { getByTestId } = render(<MapFeaturesInfoPage />);
    fireEvent.press(getByTestId('nextButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/PoiInfoPage');
  });
});
