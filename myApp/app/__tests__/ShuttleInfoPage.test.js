import React from 'react';
import { render } from '@testing-library/react-native';
import ShuttleBusPage from '../../app/screens/ShuttleInfoPage';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('ShuttleInfoPage', () => {
  it('renders title and description text', () => {
    const { getAllByText, getByText } = render(<ShuttleBusPage />);
    expect(getAllByText('Shuttle Bus').length).toBeGreaterThanOrEqual(1);
    expect(getByText(/Next one on schedule/i)).toBeTruthy();
    expect(getByText(/View bus schedules and real-time updates/i)).toBeTruthy();
  });

  it('renders all shuttle-related images with correct accessibility role', () => {
    const { getAllByRole } = render(<ShuttleBusPage />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(4); // at least 4 shuttle-related images
  });

  it('displays all navigation buttons (Home, Settings, Back, Forward)', () => {
    const { getAllByRole } = render(<ShuttleBusPage />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });
});
