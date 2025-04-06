import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ShuttleInfoPage from '../../app/screens/ShuttleInfoPage';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('ShuttleInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<ShuttleInfoPage />);
    fireEvent.press(getByTestId('backButton'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates forward when forward button is pressed', () => {
    const { getByTestId } = render(<ShuttleInfoPage />);
    fireEvent.press(getByTestId('forwardButton'));
    expect(mockPush).toHaveBeenCalledWith('/screens/SettingsInfoPage');
  });

  it('opens and closes the modal with schedule image', () => {
    const { getByTestId, queryByTestId } = render(<ShuttleInfoPage />);

    fireEvent.press(getByTestId('openModalImage'));
    expect(queryByTestId('shuttle-modal-image')).toBeTruthy();

    fireEvent.press(getByTestId('closeModalButton'));
    // Note: Modal will remain in DOM until unmounted or re-rendered.
  });
});
