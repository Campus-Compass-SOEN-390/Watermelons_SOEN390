// src/components/Markers.js
import React, { useContext } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext"; // Update this path if needed

// Theme-aware marker components
const CoffeeMarker = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#333" : "white",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? "#555" : "#ccc",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.8 : 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <MaterialCommunityIcons
        name="coffee"
        size={24}
        color={isDarkMode ? "#fff" : "black"}
      />
    </View>
  );
};

const RestaurantMarker = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#333" : "white",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? "#555" : "#ccc",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.8 : 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={24}
        color={isDarkMode ? "#ff9800" : "orange"}
      />
    </View>
  );
};

const ActivityMarker = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? "#333" : "white",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? "#555" : "#ccc",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.8 : 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}
    >
      <MaterialCommunityIcons
        name="run"
        size={20}
        color={isDarkMode ? "#8bc34a" : "green"}
      />
    </View>
  );
};

export { CoffeeMarker, RestaurantMarker, ActivityMarker };
