import React, { useEffect } from "react"; // Combine React and useEffect imports
import { LogBox, View } from "react-native";
import HomePage from "./screens/HomePage";
import "react-native-get-random-values";
import { ThemeProvider } from "./context/ThemeContext";
import { initialize } from '@microsoft/react-native-clarity';

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Index() {
  useEffect(() => {
    initialize("qzkzyic29f");
  }, []);

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
