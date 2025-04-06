// app/myApp/context/ThemeContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../constants/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme_preference");
      if (savedTheme !== null) {
        const themePreference = JSON.parse(savedTheme);
        setIsDarkMode(themePreference === "dark");
        setTheme(themePreference === "dark" ? darkTheme : lightTheme);
      } else {
        // Use device theme if no preference is saved
        setIsDarkMode(deviceTheme === "dark");
        setTheme(deviceTheme === "dark" ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.log("Error loading theme preference:", error);
    }
  };

  // Toggle theme function
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? darkTheme : lightTheme);

    try {
      await AsyncStorage.setItem(
        "theme_preference",
        JSON.stringify(newMode ? "dark" : "light")
      );
    } catch (error) {
      console.log("Error saving theme preference:", error);
    }
  };

  const contextValue = useMemo(() => ({ theme, isDarkMode, toggleTheme }), [theme, isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
