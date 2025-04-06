import { View, StyleSheet } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { COLORS } from "../styles/constants";

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
    backgroundColor: COLORS.OFF_WHITE,
    paddingTop: 30,
    paddingHorizontal: 16,
  },
});

LayoutWrapper.propTypes = {
  children: PropTypes.node,
};