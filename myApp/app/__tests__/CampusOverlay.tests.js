import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

// Simple test to ensure our testing setup works
describe('CampusOverlay tests', () => {
  it('testing environment works', () => {
    expect(true).toBe(true);
  });

  it('can render a simple component', () => {
    const { getByTestId } = render(<View testID="test-view" />);
    expect(getByTestId('test-view')).toBeTruthy();
  });
}); 