import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import StartAndDestinationPoints from '../components/StartAndDestinationPoints';

const mockPush = jest.fn();
const mockSetRenderMap = jest.fn();
const mockSetTravelMode = jest.fn();
const mockSetSelectedMode = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../components/StartAndDestinationPoints', () => {
  const { View, TouchableOpacity } = require('react-native');
  return jest.fn(() => (
    <>
      <View testID="startPointInput" />
      <View testID="destinationPointInput" />
      <View testID="getDirectionsButton" onPress={() => mockPush('/directions')} />
      <View testID="transportationButtons">
        <TouchableOpacity testID="transport-button-DRIVING" onPress={() => mockSetTravelMode('DRIVING')} />
        <TouchableOpacity testID="transport-button-TRANSIT" onPress={() => mockSetTravelMode('TRANSIT')} />
        <TouchableOpacity testID="transport-button-WALKING" onPress={() => mockSetTravelMode('WALKING')} />
        <TouchableOpacity testID="transport-button-BICYCLING" onPress={() => mockSetTravelMode('BICYCLING')} />
      </View>
    </>
  ));
});

describe('StartAndDestinationPoints', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSetTravelMode.mockClear();
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

  it('should render transportation buttons after pressing Get Directions', async () => {
    const { getByTestId } = render(<StartAndDestinationPoints />);

    await act(async () => {
      fireEvent.press(getByTestId('getDirectionsButton'));
    });

    expect(getByTestId('transport-button-DRIVING')).toBeTruthy();
    expect(getByTestId('transport-button-TRANSIT')).toBeTruthy();
    expect(getByTestId('transport-button-WALKING')).toBeTruthy();
    expect(getByTestId('transport-button-BICYCLING')).toBeTruthy();
  });

  it('should update selected mode when a transportation button is clicked', async () => {
    const { getByTestId } = render(<StartAndDestinationPoints />);

    await act(async () => {
      fireEvent.press(getByTestId('getDirectionsButton'));
    });

    await act(async () => {
      fireEvent.press(getByTestId('transport-button-TRANSIT'));
    });

    expect(mockSetTravelMode).toHaveBeenCalledWith('TRANSIT');
  });
});
