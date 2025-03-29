// app/myApp/components/ThemeToggle.js
import React, { useContext } from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default ThemeToggle;
