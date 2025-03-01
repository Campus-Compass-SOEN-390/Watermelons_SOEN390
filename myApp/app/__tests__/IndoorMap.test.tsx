import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import IndoorMap from '../(tabs)/indoor-map';

// Mock `expo-router`
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
      push: jest.fn(),
  })),
}));

describe('IndoorMap', () => {
  it('should load indoor navigation buttons on startup', () => {
      const { getByTestId } = render(<IndoorMap />);

      expect(getByTestId('floor-up')).toBeTruthy();
      expect(getByTestId('floor-down')).toBeTruthy();
      expect(getByTestId('buildings-button')).toBeTruthy();
      
  });
});
