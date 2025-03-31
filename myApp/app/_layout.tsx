import React from 'react';
import { Stack } from 'expo-router';
import { FeedbackProvider } from './context/FeedbackContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <FeedbackProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="index" 
        />
        <Stack.Screen 
          name="(tabs)" 
        />
      </Stack>
      <Toast />
    </FeedbackProvider>
  );
}