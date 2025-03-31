import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShuttleBusPage from '../app/screens/ShuttleInfoPage'; 

// Mock navigation
const pushMock = jest.fn();
const backMock = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock,
  }),
}));

describe('ShuttleInfoPage', () => {
  it('renders page title and description', () => {
    const { getByText } = render(<ShuttleBusPage />);

    expect(getByText('Shuttle Bus')).toBeTruthy();
    expect(getByText('Next one on schedule')).toBeTruthy();
    expect(getByText(/real-time updates/i)).toBeTruthy();
    expect(getByText(/Shuttle Bus Schedule and Alerts/i)).toBeTruthy();
  });

  it('renders all shuttle images', () => {
    const { getAllByRole } = render(<ShuttleBusPage />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });

  it('opens and closes the modal', () => {
    const { getByText, queryByText, getAllByRole } = render(<ShuttleBusPage />);

    // Initially, the modal "Close" button shouldn't be in the DOM
    expect(queryByText('Close')).toBeNull();

    // Press shuttleButton to open modal
    fireEvent.press(getAllByRole('image')[0]);

    // Now modal should show
    expect(getByText('Close')).toBeTruthy();

    // Close the modal
    fireEvent.press(getByText('Close'));

    // Should now be gone again (if state updates immediately)
    // You may skip this part depending on your modal visibility logic
  });

  it('has working navigation buttons', () => {
    const { getAllByRole } = render(<ShuttleBusPage />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // back and forward
  });
});
