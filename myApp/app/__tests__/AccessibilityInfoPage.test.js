import React from 'react';
import { render } from '@testing-library/react-native';
import InfoPage6 from '../app/screens/AccessibilityInfoPage';

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('AccessibilityInfoPage', () => {
  it('renders title, section label, and descriptive text', () => {
    const { getByText } = render(<InfoPage6 />);

    expect(getByText('Campus Map Features')).toBeTruthy();
    expect(getByText('Accessibility-Friendly Routes')).toBeTruthy();
    expect(
      getByText(/On the left is the standard route/i)
    ).toBeTruthy();
  });

  it('renders two accessibility screenshots', () => {
    const { getAllByRole } = render(<InfoPage6 />);
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('displays navigation buttons', () => {
    const { getAllByRole } = render(<InfoPage6 />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
