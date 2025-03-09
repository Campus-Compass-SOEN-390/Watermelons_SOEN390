import React from 'react';
import { render } from '@testing-library/react-native';
import { CoffeeMarker, RestaurantMarker, ActivityMarker } from '../../components/POI/Markers';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock the @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: jest.fn(({ name, size, color }) => (
      <View testID={`icon-${name}`} size={size} color={color} />
    )),
  };
});

describe('Marker Components', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    MaterialCommunityIcons.mockClear();
  });

  describe('CoffeeMarker', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(<CoffeeMarker />);
      expect(getByTestId('icon-coffee')).toBeTruthy();
    });

    it('uses the correct icon properties', () => {
      render(<CoffeeMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'coffee',
          size: 24,
          color: 'black'
        }),
        expect.anything()
      );
    });

    it('has the correct container styling', () => {
      const { UNSAFE_getByType } = render(<CoffeeMarker />);
      const view = UNSAFE_getByType('View');
      expect(view.props.style).toEqual({
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5
      });
    });
  });

  describe('RestaurantMarker', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(<RestaurantMarker />);
      expect(getByTestId('icon-silverware-fork-knife')).toBeTruthy();
    });

    it('uses the correct icon properties', () => {
      render(<RestaurantMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'silverware-fork-knife',
          size: 24,
          color: 'orange'
        }),
        expect.anything()
      );
    });

    it('has the correct container styling', () => {
      const { UNSAFE_getByType } = render(<RestaurantMarker />);
      const view = UNSAFE_getByType('View');
      expect(view.props.style).toEqual({
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5
      });
    });
  });

  describe('ActivityMarker', () => {
    it('renders correctly', () => {
      const { getByTestId } = render(<ActivityMarker />);
      expect(getByTestId('icon-run')).toBeTruthy();
    });

    it('uses the correct icon properties', () => {
      render(<ActivityMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'run',
          size: 20,
          color: 'green'
        }),
        expect.anything()
      );
    });

    it('has the correct container styling', () => {
      const { UNSAFE_getByType } = render(<ActivityMarker />);
      const view = UNSAFE_getByType('View');
      expect(view.props.style).toEqual({
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5
      });
    });
  });

  describe('Snapshots', () => {
    it('CoffeeMarker matches snapshot', () => {
      const tree = render(<CoffeeMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('RestaurantMarker matches snapshot', () => {
      const tree = render(<RestaurantMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('ActivityMarker matches snapshot', () => {
      const tree = render(<ActivityMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
