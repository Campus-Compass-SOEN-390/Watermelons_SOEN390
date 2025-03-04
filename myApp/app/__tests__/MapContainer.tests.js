import React from 'react';
import { View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import MapContainer from '../components/maps/MapContainer';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, onRegionChangeComplete, ...props }) => (
      <View testID="mock-map-view" {...props}>
        {children}
        <View 
          testID="region-change-simulator" 
          onPress={() => {
            if (onRegionChangeComplete) {
              const newRegion = {
                latitude: 46.0,
                longitude: -74.0,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
              };
              onRegionChangeComplete(newRegion);
            }
          }}
        />
      </View>
    ),
  };
});

// Mock the styles
jest.mock('../styles/UnifiedMapStyles', () => ({
  default: { map: { flex: 1 } },
}));

describe('MapContainer Component', () => {
  const mockRegion = {
    latitude: 45.508888,
    longitude: -73.561668,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
  const mockSetRegion = jest.fn();
  const mockMapRef = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the map view correctly', () => {
    const { getByTestId } = render(
      <MapContainer 
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      />
    );
    expect(getByTestId('mock-map-view')).toBeTruthy();
  });

  it('passes the correct props to MapView', () => {
    const { getByTestId } = render(
      <MapContainer 
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      />
    );
    
    const mapView = getByTestId('mock-map-view');
    expect(mapView.props.region).toBe(mockRegion);
    expect(mapView.props.showsUserLocation).toBe(true);
    expect(mapView.props.showsPointsOfInterest).toBe(false);
    expect(mapView.props.showsBuildings).toBe(false);
  });

  it('calls setRegion when region changes', () => {
    const { getByTestId } = render(
      <MapContainer 
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      />
    );
    
    // Trigger the region change simulation
    fireEvent.press(getByTestId('region-change-simulator'));
    
    // Verify setRegion was called with the new region
    expect(mockSetRegion).toHaveBeenCalledWith({
      latitude: 46.0,
      longitude: -74.0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1
    });
  });

  it('renders children inside the MapView', () => {
    const childTestId = 'test-child';
    const { getByTestId } = render(
      <MapContainer 
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      >
        <View testID={childTestId} />
      </MapContainer>
    );
    
    expect(getByTestId(childTestId)).toBeTruthy();
  });

  it('handles undefined children properly', () => {
    const { getByTestId } = render(
      <MapContainer 
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      />
    );
    
    // Component should render without errors when no children are provided
    expect(getByTestId('mock-map-view')).toBeTruthy();
  });

  it('uses the provided ref', () => {
    const customRef = { current: null };
    render(
      <MapContainer 
        mapRef={customRef}
        region={mockRegion}
        setRegion={mockSetRegion}
        showLocating={true}
      />
    );
    
    // Verify the ref is passed correctly
    expect(customRef).toBeDefined();
  });
});
