// app/__tests__/POITests/POIList.tests.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator, FlatList, Image, Text } from 'react-native';
import POIList from '../../components/POI/POIList';
import Constants from 'expo-constants';

// Ensure a dummy API key is available
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: { apiKey: 'dummy-key' } },
  },
}));

// Mock Ionicons from @expo/vector-icons to simply render a Text component
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native'); // now in-scope
  return {
    Ionicons: (props) => <Text {...props} />,
  };
});

describe('POIList Component', () => {
  // Dummy distance calculation function (always returns 1.2 km)
  const dummyDistance = 1.2;
  const calculateDistance = jest.fn(() => dummyDistance);
  const userLocation = { latitude: 45.5017, longitude: -73.5673 };

  const sampleData = [
    {
      place_id: '1',
      name: 'Test Place 1',
      geometry: { location: { lat: 45.5017, lng: -73.5673 } },
      vicinity: 'Test Address 1',
      category: 'cafe',
      rating: 4.5,
      photos: [{ photo_reference: 'ref1' }],
    },
    {
      place_id: '2',
      name: 'Test Place 2',
      geometry: { location: { lat: 45.5020, lng: -73.5680 } },
      vicinity: 'Test Address 2',
      category: 'restaurant',
      rating: 4.0,
      photos: [], // No photo; placeholder should be rendered
    },
  ];

  it('renders loading state correctly', () => {
    const { getByText, queryByTestId } = render(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={true}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    // Check for the loading text
    expect(getByText('Loading places...')).toBeTruthy();
    // Assumes the ActivityIndicator has testID="activity-indicator"
    expect(queryByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders error state with retry button when error exists and no data', () => {
    const onRefreshMock = jest.fn();
    const { getByText } = render(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={false}
        error={'Error fetching data'}
        refreshing={false}
        onRefresh={onRefreshMock}
        calculateDistance={calculateDistance}
      />
    );

    expect(getByText('Error fetching data')).toBeTruthy();
    const retryButton = getByText('Retry');
    expect(retryButton).toBeTruthy();

    fireEvent.press(retryButton);
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it('renders empty state when data is empty', () => {
    const { getByText } = render(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    expect(
      getByText(/No places found with the current filters/)
    ).toBeTruthy();
  });

  it('renders list items correctly when data is provided', () => {
    const { getByText, getAllByText } = render(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    expect(getByText('Test Place 1')).toBeTruthy();
    expect(getByText('Test Place 2')).toBeTruthy();

    // Since "1.2 km" appears for each item, use getAllByText and check its length.
    const distanceElements = getAllByText(`${dummyDistance.toFixed(1)} km`);
    expect(distanceElements.length).toBe(sampleData.length);

    expect(getByText('Test Address 1')).toBeTruthy();
    expect(getByText('Test Address 2')).toBeTruthy();
    // Instead of getByText (which fails if multiple exist), use getAllByText
    const directionsButtons = getAllByText('Get Directions');
    expect(directionsButtons.length).toBeGreaterThan(0);
  });

  it('calls onRefresh when pull-to-refresh is triggered on the FlatList', () => {
    const onRefreshMock = jest.fn();
    const { getByTestId } = render(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={true}
        onRefresh={onRefreshMock}
        calculateDistance={calculateDistance}
      />
    );

    // Assumes the FlatList has testID="poi-flatlist"
    const flatList = getByTestId('poi-flatlist');
    // Trigger the refresh event from the RefreshControl
    flatList.props.refreshControl.props.onRefresh();
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it('handles Get Directions button press in list item', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { getAllByText } = render(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    const getDirectionsButtons = getAllByText('Get Directions');
    fireEvent.press(getDirectionsButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Get directions to: Test Place 1');
    expect(consoleSpy).toHaveBeenCalledWith('Address: Test Address 1');
    consoleSpy.mockRestore();
  });

  it('shows no image placeholder when image fails to load', () => {
    const { getByText, getByTestId } = render(
      <POIList
        data={[sampleData[0]]}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    // Assumes the Image in POIListItem has testID="poi-image"
    const imageComponent = getByTestId('poi-image');
    fireEvent(imageComponent, 'error', {
      nativeEvent: { error: 'error loading image' },
    });

    expect(getByText('No Image Available')).toBeTruthy();
  });
});
