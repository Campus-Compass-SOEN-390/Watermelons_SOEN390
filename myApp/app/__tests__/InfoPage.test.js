import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoPage from '../../app/screens/InfoPage';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('InfoPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the welcome message and features', () => {
    const { getByText } = render(<InfoPage />);

    expect(getByText(/Welcome to CampusCompass/i)).toBeTruthy();
    expect(getByText(/Google Calendar Integration/i)).toBeTruthy();
    expect(getByText(/Smart Navigation/i)).toBeTruthy();
    expect(getByText(/Interactive Campus Map/i)).toBeTruthy();
    expect(getByText(/Shuttle Bus Updates/i)).toBeTruthy();
  });

  it('navigates to calendar page on forward button press', () => {
    const { getAllByRole } = render(<InfoPage />);
    const buttons = getAllByRole('button');
    const forwardButton = buttons[buttons.length - 1];
    fireEvent.press(forwardButton);
    expect(mockPush).toHaveBeenCalledWith('/screens/CalenderInfoPage');
  });

  it('navigates to SettingsPage when settings button is pressed', () => {
    const { getByTestId } = render(<InfoPage />);
    const settingsButton = getByTestId('settingsButton');
    fireEvent.press(settingsButton);
    expect(mockPush).toHaveBeenCalledWith('/screens/SettingsPage');
  });

  it('renders and responds to dummy button', () => {
    const { getByTestId } = render(<InfoPage />);
    const dummyButton = getByTestId('dummyButton');
    fireEvent.press(dummyButton); // should not throw
    expect(dummyButton).toBeTruthy();
  });
  it('navigates to Home when Home button is pressed', () => {
    const { getByTestId } = render(<InfoPage />);
    const homeButton = getByTestId('homeButton');
    fireEvent.press(homeButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  
});
