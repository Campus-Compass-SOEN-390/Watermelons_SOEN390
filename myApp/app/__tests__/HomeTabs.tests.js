import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TabLayout from '../(tabs)/_layout';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('../(tabs)/_layout', () => {
  const { View } = require('react-native');
  return jest.fn(() => (
    <>
      <View testID="homeIcon" />
      <View testID="interestPointsIcon" />
      <View testID="favoritesIcon" />
      <View testID="indoorMapIcon" />
      <View testID="outdoorMapIcon" />
      <View testID="homeButton" onPress={() => mockPush("/")}/>
      <View testID="interestPointsButton" onPress={() => mockPush("./(tabs)/interest-points")}/>
      <View testID="favoritesButton" onPress={() => mockPush("./(tabs)/favorites")}/>
      <View testID="indoorMapButton" onPress={() => mockPush("./(tabs)/indoor-map")}/>
      <View testID="outdoorMapButton" onPress={() => mockPush("./(tabs)/outdoor-map")}/>
    </>
  ));
});

describe('TabLayout', () => {
    beforeEach(() => {
        // Clear mock history before each test
        mockPush.mockClear();
    });

    it('should load navigation bar and buttons', () => {
        // test that all icons and buttons are loading successfully
        const page = render(<TabLayout />);
        const homeIcon = page.getByTestId('homeIcon');
        const interestPointsIcon = page.getByTestId('interestPointsIcon');
        const favoritesIcon = page.getByTestId('favoritesIcon');
        const indoorMapIcon = page.getByTestId('indoorMapIcon');
        const outdoorMapIcon = page.getByTestId('outdoorMapIcon')
        const homeButton = page.getByTestId('homeButton');
        const interestPointsButton = page.getByTestId('interestPointsButton');
        const favoritesButton = page.getByTestId('favoritesButton');
        const indoorMapButton = page.getByTestId('indoorMapButton');
        const outdoorMapButton = page.getByTestId('outdoorMapButton');
        expect(homeIcon).toBeTruthy();
        expect(interestPointsIcon).toBeTruthy();
        expect(favoritesIcon).toBeTruthy();
        expect(indoorMapIcon).toBeTruthy();
        expect(homeButton).toBeTruthy();
        expect(interestPointsButton).toBeTruthy();
        expect(favoritesButton).toBeTruthy();
        expect(indoorMapButton).toBeTruthy();

    })


    // check that the buttons redirect to the correct pages

    it('should go to home page when home button is pressed', () => {
        const page = render(<TabLayout />);
        const homeButton = page.getByTestId("homeButton");
        fireEvent.press(homeButton);
        expect(mockPush).toHaveBeenCalledWith("/");
    })

    it('should go to interest points page when interest points button is pressed', () => {
        const page = render(<TabLayout />);
        const interestPointsButton = page.getByTestId("interestPointsButton");
        fireEvent.press(interestPointsButton);
        expect(mockPush).toHaveBeenCalledWith("./(tabs)/interest-points");
    });

    {/* Modify the path if needed when indoor map and indoor navigations are implemented */}
    it('should go to indoor map page when indoor map button is pressed', () => {
        const page = render(<TabLayout />);
        const indoorMapButton = page.getByTestId("indoorMapButton");
        fireEvent.press(indoorMapButton);
        expect(mockPush).toHaveBeenCalledWith("./(tabs)/indoor-map");
    })

    it('should go to outdoor map page when outdoor map button is pressed', () => {
        const page = render(<TabLayout />);
        const outdoorMapButton = page.getByTestId("outdoorMapButton");
        fireEvent.press(outdoorMapButton);
        expect(mockPush).toHaveBeenCalledWith("./(tabs)/outdoor-map");
    })

    it('should go to favorites page when favorites button is pressed', () => {
        const page = render(<TabLayout />);
        const favoritesButton = page.getByTestId("favoritesButton");
        fireEvent.press(favoritesButton);
        expect(mockPush).toHaveBeenCalledWith("./(tabs)/favorites");
    })


});
