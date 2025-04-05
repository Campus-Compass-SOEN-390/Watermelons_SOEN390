import { LogBox, View } from "react-native";
import React from "react";
import HomePage from "./screens/HomePage";
import 'react-native-get-random-values';
import { initialize } from '@microsoft/react-native-clarity';
import { useEffect } from "react";

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
]);


export default function Index() {

  useEffect(() => {
    initialize("qzkzyic29f");
  }, []);

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