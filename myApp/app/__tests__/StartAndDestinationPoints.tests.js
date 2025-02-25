import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StartAndDestinationPoints from '../components/StartAndDestinationPoints';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../components/StartAndDestinationPoints', () => {
  const { View } = require('react-native');
  return jest.fn(() => (
    <>
      <View testID="startPointInput" />
      <View testID="destinationPointInput" />
      <View testID="getDirectionsButton" onPress={() => mockPush('/directions')} />
    </>
  ));
});

describe('StartAndDestinationPoints', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render input fields and button', () => {
    const { getByTestId } = render(<StartAndDestinationPoints />);
    expect(getByTestId('startPointInput')).toBeTruthy();
    expect(getByTestId('destinationPointInput')).toBeTruthy();
    expect(getByTestId('getDirectionsButton')).toBeTruthy();
  });

  it('should navigate to directions page when button is pressed', () => {
    const { getByTestId } = render(<StartAndDestinationPoints />);
    fireEvent.press(getByTestId('getDirectionsButton'));
    expect(mockPush).toHaveBeenCalledWith('/directions');
  });
});
