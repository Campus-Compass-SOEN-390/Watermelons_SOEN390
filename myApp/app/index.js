import { LogBox, View } from "react-native";
import React from "react";
import HomePage from "./screens/HomePage";
import "react-native-get-random-values";
import { ThemeProvider } from "./context/ThemeContext";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Index() {
  return (
    <ThemeProvider>
      <View
        style={{
          flex: 1,
        }}
      >
        <HomePage />
      </View>
    </ThemeProvider>
  );
}
