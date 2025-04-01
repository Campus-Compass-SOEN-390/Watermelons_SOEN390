import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FeedbackProvider>
        <Stack
          screenOptions={{
            // Hide the header for ALL screens in this stack
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          {/* If your TabLayout is at (tabs), add it here too */}
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </FeedbackProvider>
    </ThemeProvider>
  );
}
