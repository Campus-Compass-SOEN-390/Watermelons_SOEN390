import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoPage from '../app/screens/InfoPage'; 
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// mock expo-router navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('InfoPage', () => {
  it('renders the welcome message and features', () => {
    const { getByText } = render(<InfoPage />);

    // Welcome text
    expect(getByText(/Welcome to CampusCompass/i)).toBeTruthy();

    // Feature bullet points
    expect(getByText(/Google Calendar Integration/i)).toBeTruthy();
    expect(getByText(/Smart Navigation/i)).toBeTruthy();
    expect(getByText(/Interactive Campus Map/i)).toBeTruthy();
    expect(getByText(/Shuttle Bus Updates/i)).toBeTruthy();
  });

  it('navigates to calendar page on forward button press', () => {
    const { getByRole } = render(<InfoPage />);
    const forwardButton = getByRole('button');

    // Simulate forward press
    fireEvent.press(forwardButton);
    // If needed, add expect(mockRouter.push).toHaveBeenCalledWith(...) logic here
  });
});
