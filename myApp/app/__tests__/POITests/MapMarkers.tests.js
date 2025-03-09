// __tests__/POITests/MapMarkers.tests.js

// Mock the native settings module so that Settings.getConstants() works
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
    __esModule: true,
    default: {
      getConstants: () => ({}),
      settings: {},
    },
  }));
  
  // Mock react-native
  jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    return {
      ...rn,
      TouchableOpacity: ({ children, onPress }) => (
        <rn.View testID="touchable-opacity" onPress={onPress}>
          {children}
        </rn.View>
      ),
    };
  });
  
  // Mock Mapbox MarkerView from @rnmapbox/maps
  jest.mock('@rnmapbox/maps', () => {
    const rn = require('react-native'); // require locally to ensure proper scoping
    return {
      MarkerView: ({ children, coordinate, id, title }) => (
        <rn.View
          testID={`marker-${id}`}
          data-coordinate={JSON.stringify(coordinate)}
          data-title={title || ''}
        >
          {children}
        </rn.View>
      ),
    };
  });
  
  import React from 'react';
  import { render, fireEvent } from '@testing-library/react-native';
  import { View } from 'react-native';
  import MapMarkers from '../../components/POI/MapMarkers';
  
  // Mock console.log to avoid cluttering test output
  jest.spyOn(console, 'log').mockImplementation(() => {});
  
  describe('MapMarkers component', () => {
    // Sample data for testing
    const mockData = [
      {
        place_id: 'place123',
        name: 'Coffee Shop',
        geometry: {
          location: {
            lat: 45.5017,
            lng: -73.5673,
          },
        },
      },
      {
        place_id: 'place456',
        name: 'Restaurant',
        geometry: {
          location: {
            lat: 45.5020,
            lng: -73.5680,
          },
        },
      },
    ];
  
    const MockMarkerComponent = () => (
      <View testID="mock-marker">Marker</View>
    );
    const onMarkerPressMock = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders markers for each data point with valid coordinates', () => {
      const { getAllByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
          onMarkerPress={onMarkerPressMock} 
        />
      );
      
      expect(getAllByTestId(/^marker-/)).toHaveLength(2);
      expect(getAllByTestId('mock-marker')).toHaveLength(2);
    });
  
    it('uses the place_id as key/id when available', () => {
      const { getByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
          onMarkerPress={onMarkerPressMock} 
        />
      );
      
      expect(getByTestId('marker-place123')).toBeTruthy();
      expect(getByTestId('marker-place456')).toBeTruthy();
    });
  
    it('generates a random id when place_id is not available', () => {
      // Mock Math.random to return consistent values for testing
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.123456789);
      
      const dataWithoutId = [
        {
          name: 'Test Point',
          geometry: {
            location: {
              lat: 45.5017,
              lng: -73.5673,
            },
          },
        },
      ];
      
      const { getAllByTestId } = render(
        <MapMarkers 
          data={dataWithoutId} 
          MarkerComponent={MockMarkerComponent} 
        />
      );
      
      // We expect a marker id that starts with "marker-marker-"
      const markers = getAllByTestId(/^marker-marker-/);
      expect(markers).toHaveLength(1);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
  
    it('correctly formats coordinates for Mapbox', () => {
      const { getByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
        />
      );
      
      const marker = getByTestId('marker-place123');
      const coordinateStr = marker.props['data-coordinate'];
      const coordinates = JSON.parse(coordinateStr);
      
      // Mapbox expects coordinates as [longitude, latitude]
      expect(coordinates).toEqual([-73.5673, 45.5017]);
    });
  
    it('skips rendering markers with missing coordinates', () => {
      const incompleteData = [
        ...mockData,
        { place_id: 'missing_coords', name: 'Invalid Point' }, // Missing geometry
        { place_id: 'null_coords', name: 'Null Coords', geometry: { location: { lat: null, lng: null } } }
      ];
      
      const { getAllByTestId } = render(
        <MapMarkers 
          data={incompleteData} 
          MarkerComponent={MockMarkerComponent} 
        />
      );
      
      // Should still only render 2 valid markers
      expect(getAllByTestId(/^marker-/)).toHaveLength(2);
    });
  
    it('calls onMarkerPress with the correct point data when pressed', () => {
      const { getAllByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
          onMarkerPress={onMarkerPressMock} 
        />
      );
      
      // Find the TouchableOpacity inside the first marker and trigger press
      const touchables = getAllByTestId('touchable-opacity');
      fireEvent.press(touchables[0]);
      
      // Check if onMarkerPress was called with the correct point data
      expect(onMarkerPressMock).toHaveBeenCalledWith(mockData[0]);
    });
  
    it('handles markers with no onMarkerPress handler', () => {
      const { getAllByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
        />
      );
      
      // Should not throw an error even though no onMarkerPress is provided
      const touchables = getAllByTestId('touchable-opacity');
      expect(() => fireEvent.press(touchables[0])).not.toThrow();
    });
  
    it('renders correctly with an empty data array', () => {
      const { queryByTestId } = render(
        <MapMarkers 
          data={[]} 
          MarkerComponent={MockMarkerComponent} 
          onMarkerPress={onMarkerPressMock}
        />
      );
      
      // No markers should be rendered
      expect(queryByTestId(/^marker-/)).toBeNull();
    });
  
    it('sets the correct title from point name', () => {
      const { getByTestId } = render(
        <MapMarkers 
          data={mockData} 
          MarkerComponent={MockMarkerComponent} 
          onMarkerPress={onMarkerPressMock}
        />
      );
      
      const marker = getByTestId('marker-place123');
      expect(marker.props['data-title']).toBe('Coffee Shop');
    });
  
    it('uses "Location" as fallback title when name is missing', () => {
      const dataWithoutName = [
        {
          place_id: 'no_name',
          geometry: {
            location: {
              lat: 45.5017,
              lng: -73.5673,
            },
          },
        },
      ];
      
      const { getByTestId } = render(
        <MapMarkers 
          data={dataWithoutName} 
          MarkerComponent={MockMarkerComponent} 
        />
      );
      
      const marker = getByTestId('marker-no_name');
      expect(marker.props['data-title']).toBe('Location');
    });
  });
  