import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterModal from '../../components/POI/FilterModal';

describe('FilterModal', () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
    distance: 2,
    setDistance: jest.fn(),
    showCafes: true,
    setShowCafes: jest.fn(),
    showRestaurants: true,
    setShowRestaurants: jest.fn(),
    showActivities: false,
    setShowActivities: jest.fn(),
    useDistance: true,
    setUseDistance: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when visible', () => {
    const { getByText, getByTestId } = render(<FilterModal {...defaultProps} />);
    
    expect(getByText('Filter Points of Interest')).toBeTruthy();
    expect(getByText('Distance Filter')).toBeTruthy();
    expect(getByText('Categories')).toBeTruthy();
    expect(getByTestId('distanceSwitch')).toBeTruthy();
  });

  test('handles close button press', () => {
    const { getByText } = render(<FilterModal {...defaultProps} />);
    
    fireEvent.press(getByText('×'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('handles apply filters button press', () => {
    const { getByText } = render(<FilterModal {...defaultProps} />);
    
    fireEvent.press(getByText('Apply Filters'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('toggles distance filter', () => {
    const { getByTestId } = render(<FilterModal {...defaultProps} />);
    const distanceSwitch = getByTestId('distanceSwitch');
    
    fireEvent(distanceSwitch, 'valueChange', false);
    expect(defaultProps.setUseDistance).toHaveBeenCalledWith(false);
  });

  test('shows/hides distance slider based on useDistance', () => {
    const { queryByText, rerender } = render(<FilterModal {...defaultProps} />);
    
    // When useDistance is true
    expect(queryByText(/Maximum distance:/)).toBeTruthy();

    // When useDistance is false
    rerender(<FilterModal {...defaultProps} useDistance={false} />);
    expect(queryByText(/Maximum distance:/)).toBeFalsy();
  });

  test('handles category toggles', () => {
    const { getByTestId } = render(<FilterModal {...defaultProps} />);
    
    // Test cafes toggle
    fireEvent(getByTestId('cafeSwitch'), 'valueChange', false);
    expect(defaultProps.setShowCafes).toHaveBeenCalledWith(false);

    // Test restaurants toggle
    fireEvent(getByTestId('restaurantSwitch'), 'valueChange', false);
    expect(defaultProps.setShowRestaurants).toHaveBeenCalledWith(false);

    // Test activities toggle
    fireEvent(getByTestId('activitySwitch'), 'valueChange', true);
    expect(defaultProps.setShowActivities).toHaveBeenCalledWith(true);
  });

  test('handles distance slider change', () => {
    const { UNSAFE_getByProps } = render(<FilterModal {...defaultProps} />);
    const slider = UNSAFE_getByProps({ minimumValue: 0.5, maximumValue: 10 });
    
    fireEvent(slider, 'valueChange', 5);
    expect(defaultProps.setDistance).toHaveBeenCalledWith(5);
  });

  test('renders correctly when not visible', () => {
    const { queryByTestId } = render(
      <FilterModal {...defaultProps} isVisible={false} />
    );
    
    // When modal is not visible, it should not be present in the rendered output
    expect(queryByTestId('modalContainer')).toBeNull();
  });

  test('displays correct initial values', () => {
    const { getByTestId } = render(<FilterModal {...defaultProps} />);
    
    expect(getByTestId('cafeSwitch').props.value).toBe(true);
    expect(getByTestId('restaurantSwitch').props.value).toBe(true);
    expect(getByTestId('activitySwitch').props.value).toBe(false);
    expect(getByTestId('distanceSwitch').props.value).toBe(true);
  });

  test('slider behavior when distance changes', () => {
    const { UNSAFE_getByProps, rerender } = render(<FilterModal {...defaultProps} />);
    const slider = UNSAFE_getByProps({ minimumValue: 0.5, maximumValue: 10 });
    
    expect(slider.props.value).toBe(2);
    
    rerender(<FilterModal {...defaultProps} distance={5} />);
    expect(UNSAFE_getByProps({ minimumValue: 0.5, maximumValue: 10 }).props.value).toBe(5);
  });
});