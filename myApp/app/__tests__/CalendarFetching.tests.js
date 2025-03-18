import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CalendarFetching from '../screens/CalendarFetching';

describe('CalendarFetching', () => {
  it('renders text input and connect button', () => {
    const { getByPlaceholderText, getByText } = render(<CalendarFetching />);
    
    // Check if text input exists
    const textInput = getByPlaceholderText('Paste Calendar ID here');
    expect(textInput).toBeDefined();
    
    // Check if connect button exists
    const connectButton = getByText('Connect');
    expect(connectButton).toBeDefined();
  });
});