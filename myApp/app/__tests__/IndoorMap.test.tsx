import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import IndoorMap from '../(tabs)/map';

// Create a mock for the push function
const mockPush = jest.fn();

// Mocking useRouter from expo-router to return the mock push function
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('Indoor map', () => {
    beforeEach(() => {
        // Clear mock history before each test
        mockPush.mockClear();
    });

    it('should load indoor map and buttons on startup', () => {
        const page = render(<IndoorMap />);
        const floorUpButton = page.getByTestId('floor-up');
        const floorDownButton = page.getByTestId('floor-down');
        const buildingsButton = page.getByTestId('buildings-button');

        expect(floorUpButton).toBeTruthy();
        expect(floorDownButton).toBeTruthy();
        expect(buildingsButton).toBeTruthy();
    });
});