// app/__tests__/CalendarFetching.tests.js
import React from 'react';
import { render } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';
// Import NavigationContainer from react-navigation
import { NavigationContainer } from '@react-navigation/native';

describe('CalendarFetching', () => {
  it('renders text input and connect button', () => {
    // Wrap the component in a NavigationContainer
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <CalendarFetching />
      </NavigationContainer>
    );

    // Check if text input exists
    const textInput = getByPlaceholderText('Paste Calendar ID here');
    expect(textInput).toBeDefined();

    // Check if connect button exists
    const connectButton = getByText('Connect');
    expect(connectButton).toBeDefined();
  });
});
