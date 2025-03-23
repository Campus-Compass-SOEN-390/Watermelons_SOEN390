import { View, StyleSheet } from "react-native";
import React from "react";

export default function LayoutWrapper({ children }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
});
