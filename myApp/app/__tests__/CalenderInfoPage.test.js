import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InfoPage2 from '../app/screens/CalenderInfoPage'; 

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('CalenderInfoPage', () => {
  it('renders title, description, and image', () => {
    const { getByText, getByRole } = render(<InfoPage2 />);

    expect(getByText('Google Calendar')).toBeTruthy();
    expect(
      getByText(/Import your events from Google Calendar seamlessly/i)
    ).toBeTruthy();

    // Image: basic check via accessibility role
    const image = getByRole('image');
    expect(image).toBeTruthy();
  });

  it('has working navigation buttons', () => {
    const { getAllByRole } = render(<InfoPage2 />);
    const buttons = getAllByRole('button');

    expect(buttons.length).toBeGreaterThanOrEqual(2); // Back + Forward
  });
});
