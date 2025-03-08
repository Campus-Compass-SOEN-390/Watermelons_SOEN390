import React from 'react';
import { Stack } from 'expo-router';
import { IndoorMapProvider } from './context/IndoorMapContext';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Hide the header for ALL screens in this stack
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
      />
      {/* If your TabLayout is at (tabs), add it here too */}
      <Stack.Screen 
        name="(tabs)" 
      />
    </Stack>
  );
}