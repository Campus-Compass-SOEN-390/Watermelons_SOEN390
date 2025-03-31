import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import POIPopup from '../../components/POI/POIPopup';

// Add these mocks at the top of your test file
jest.mock('../../hooks/useButtonInteraction', () => ({
  useButtonInteraction: () => ({
    handleButtonPress: jest.fn()
  })
}));

jest.mock('../../context/FeedbackContext', () => ({
  useFeedback: () => ({
    vibrationEnabled: true,
    soundEnabled: true,
    speechEnabled: true
  })
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn() } }))
    }
  }
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn()
}));

describe('POIPopup Component', () => {
  // Test data
  const mockPoi = {
    name: 'Test Location',
    rating: 4.5,
    user_ratings_total: 100,
    vicinity: '123 Test Street'
  };

  const mockPoiNoRating = {
    name: 'No Rating Location',
    vicinity: '456 Test Avenue'
  };

  // Mock functions
  const mockOnClose = jest.fn();
  const mockOnGetDirections = jest.fn();

  beforeEach(() => {
    // Clear mock function calls before each test
    mockOnClose.mockClear();
    mockOnGetDirections.mockClear();
  });

  test('does not render when poi is null', () => {
    const { queryByTestId } = render(
      <POIPopup 
        poi={null}
        distance={100}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(queryByTestId('poi-popup')).toBeNull();
  });

  test('renders POI information correctly', () => {
    const { getByText } = render(
      <POIPopup 
        poi={mockPoi}
        distance={500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(getByText('Test Location')).toBeTruthy();
    expect(getByText('★ 4.5 (100 ratings)')).toBeTruthy();
    expect(getByText('123 Test Street')).toBeTruthy();
    expect(getByText('Distance: 500 m')).toBeTruthy();
    expect(getByText('Get Directions')).toBeTruthy();
  });

  test('formats distance in meters correctly', () => {
    const { getByText } = render(
      <POIPopup 
        poi={mockPoi}
        distance={750}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(getByText('Distance: 750 m')).toBeTruthy();
  });

  test('formats distance in kilometers correctly', () => {
    const { getByText } = render(
      <POIPopup 
        poi={mockPoi}
        distance={1500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(getByText('Distance: 1.5 km')).toBeTruthy();
  });

  test('displays "No ratings" when rating is not available', () => {
    const { getByText } = render(
      <POIPopup 
        poi={mockPoiNoRating}
        distance={500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(getByText('No ratings')).toBeTruthy();
  });

  test('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <POIPopup 
        poi={mockPoi}
        distance={500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
        testID="poi-popup"
      />
    );
    
    // Since the close button doesn't have a testID, we need to add one
    // For this test to work, you would need to add testID="close-button" to the close button in POIPopup.js
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onGetDirections when directions button is pressed', () => {
    const { getByText } = render(
      <POIPopup 
        poi={mockPoi}
        distance={500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    const directionsButton = getByText('Get Directions');
    fireEvent.press(directionsButton);
    
    expect(mockOnGetDirections).toHaveBeenCalledTimes(1);
  });

  test('handles null distance correctly', () => {
    const { queryByText } = render(
      <POIPopup 
        poi={mockPoi}
        distance={null}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(queryByText(/Distance:/)).toBeNull();
  });

  test('handles empty vicinity correctly', () => {
    const poiNoVicinity = {
      name: 'No Vicinity Location',
      rating: 4.0,
      user_ratings_total: 50
    };
    
    const { queryByText } = render(
      <POIPopup 
        poi={poiNoVicinity}
        distance={500}
        onClose={mockOnClose}
        onGetDirections={mockOnGetDirections}
      />
    );
    
    expect(queryByText('123 Test Street')).toBeNull();
  });
});
