import { Text, View } from "react-native";
import React from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";

export default function Settings() {

  return (
    <LayoutWrapper>
      <View style={{ gap: 12 }}>
        <HeaderButtons />
        <Text style={{ fontSize: 16 }}>This is the Settings page</Text>
      </View>
    </LayoutWrapper>

  );
}

