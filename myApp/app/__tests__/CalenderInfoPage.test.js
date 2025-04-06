import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalenderInfoPage from '../../app/screens/CalenderInfoPage';

// Mock expo-router
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('CalenderInfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('renders title, description, and image', () => {
    const { getAllByText, getByTestId } = render(<CalenderInfoPage />);

    const titles = getAllByText('Google Calendar');
    expect(titles.length).toBeGreaterThanOrEqual(1);

    expect(
      getAllByText(/Import your events from Google Calendar seamlessly/i)[0]
    ).toBeTruthy();

    const image = getByTestId('calendar-image');
    expect(image).toBeTruthy();
  });

  it('has working footer navigation buttons', () => {
    const { getByTestId } = render(<CalenderInfoPage />);

    fireEvent.press(getByTestId('back-button'));
    expect(mockBack).toHaveBeenCalled();

    fireEvent.press(getByTestId('next-button'));
    expect(mockPush).toHaveBeenCalledWith('/screens/SmartNavigationInfoPage');
  });
  
});
