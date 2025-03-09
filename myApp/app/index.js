import { View } from "react-native";
import React from "react";
import HomePage from "./screens/HomePage";
import 'react-native-get-random-values';

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HomePage/>
    </View>
  );
}