import { StyleSheet } from "react-native";

// Create a function that returns theme-dependent styles
export const createSettingsPageStyles = ({ theme, isDarkMode }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 20,
      backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? "#FFFFFF" : "#333",
      textAlign: "center",
    },
    subtitle: {
      color: isDarkMode ? "#BBBBBB" : "#666",
      fontSize: 20,
      marginBottom: 10,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#444444" : "#f8f8f8",
      padding: 12,
      borderRadius: 12,
      marginVertical: 8,
      elevation: 3, // Add shadow effect for elevation
    },
    settingLabel: {
      fontSize: 18,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#333",
      marginLeft: 15,
      flex: 1,
    },
    switch: {
      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      right: 10,
    },
    vibration_image: {
      width: 30,
      height: 30,
      marginRight: 12,
      tintColor: isDarkMode ? "#FFFFFF" : undefined,
    },
  });
};

// Export the original styles for backward compatibility
export const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    color: "#666",
    fontSize: 20,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3, // Add shadow effect for elevation
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    right: 10,
  },
  vibration_image: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
});

export default styles;
