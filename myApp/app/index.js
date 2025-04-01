import { LogBox, View } from "react-native";
import React from "react";
import HomePage from "./screens/HomePage";
import "react-native-get-random-values";
// import RNUxcam from "react-native-ux-cam";
import Constants from "expo-constants";
import { ThemeProvider } from "./context/ThemeContext";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Index() {
  return (
    // Wrap your app with ThemeProvider
    <ThemeProvider>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HomePage />
      </View>
    </ThemeProvider>
  );
}
