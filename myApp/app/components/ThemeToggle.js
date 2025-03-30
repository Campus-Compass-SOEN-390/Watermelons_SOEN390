import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = ({ style }) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    toggleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.navButtonBackground,
      justifyContent: "center",
      alignItems: "center",
      // Shadow for iOS
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      // Shadow for Android
      elevation: 5,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.toggleButton, style]}
      onPress={toggleTheme}
      accessibilityLabel={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      testID="themeToggleButton"
    >
      <Ionicons
        name={isDarkMode ? "sunny" : "moon"}
        size={22}
        color={theme.iconColor}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
