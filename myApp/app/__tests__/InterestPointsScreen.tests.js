import React from 'react';
import { render } from '@testing-library/react-native';
import InterestPointsScreen from '../(tabs)/interest-points';
import { useLocalSearchParams } from 'expo-router';

// Mock the useLocation hook
jest.mock('../hooks/useLocation', () => ({
  __esModule: true,
  default: () => ({
    location: null,
    hasPermission: true,
  }),
}));

// Mock the MapContainer and overlays
jest.mock('../components/maps/MapContainer', () => {
  return jest.fn(({ children }) => <div testID="map-container">{children}</div>);
});

jest.mock('../components/maps/CampusOverlay', () => {
  return jest.fn(() => <div testID="campus-overlay"></div>);
});

jest.mock('../components/maps/POIOverlay', () => {
  return jest.fn(() => <div testID="poi-overlay"></div>);
});

// Mock useLocalSearchParams
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

describe('InterestPointsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the MapContainer component', () => {
    // Mock params for POI mode
    useLocalSearchParams.mockReturnValue({ mode: 'poi' });
    
    const { getByTestId } = render(<InterestPointsScreen />);
    expect(getByTestId('map-container')).toBeTruthy();
  });

  it('should render the CampusOverlay when mode is campus', () => {
    // Set up mock to return campus mode
    useLocalSearchParams.mockReturnValue({ mode: 'campus', campus: 'sgw' });
    
    const { getByTestId } = render(<InterestPointsScreen />);
    expect(getByTestId('campus-overlay')).toBeTruthy();
  });

  it('should render the POIOverlay when mode is poi', () => {
    // Set up mock to return poi mode
    useLocalSearchParams.mockReturnValue({ mode: 'poi' });
    
    const { getByTestId } = render(<InterestPointsScreen />);
    expect(getByTestId('poi-overlay')).toBeTruthy();
  });
  
  it('should use default params when none are provided', () => {
    // Set up mock to return empty params
    useLocalSearchParams.mockReturnValue({});
    
    const { getByTestId } = render(<InterestPointsScreen />);
    // Default mode should be 'poi'
    expect(getByTestId('poi-overlay')).toBeTruthy();
  });

  it('should handle location updates', () => {
    // Override the default mock for this specific test
    jest.resetModules();
    jest.mock('../hooks/useLocation', () => ({
      __esModule: true,
      default: () => ({
        location: { coords: { latitude: 45.5, longitude: -73.6 } },
        hasPermission: true,
      }),
    }));
    
    useLocalSearchParams.mockReturnValue({ mode: 'poi' });
    
    const { getByTestId } = render(<InterestPointsScreen />);
    expect(getByTestId('map-container')).toBeTruthy();
  });
}); 