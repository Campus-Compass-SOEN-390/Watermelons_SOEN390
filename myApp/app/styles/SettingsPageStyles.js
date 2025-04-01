import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE_4, FONT_SIZE_5 } from "./constants";

// Create a function that returns theme-dependent styles
export const createSettingsPageStyles = ({ theme, isDarkMode }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      gap: 20,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.WHITE,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
      textAlign: "center",
    },
    subtitle: {
      color: isDarkMode ? COLORS.LIGHT_GREY : COLORS.DARK_MODE_LIGHT_GREY,
      fontSize: FONT_SIZE_5,
      marginBottom: 10,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDarkMode ? COLORS.DARK_MODE_GREY : COLORS.OFF_WHITE,
      padding: 12,
      borderRadius: 12,
      marginVertical: 8,
      elevation: 3, // Add shadow effect for elevation
    },
    settingLabel: {
      fontSize: FONT_SIZE_4,
      fontWeight: "500",
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
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
      tintColor: isDarkMode ? COLORS.WHITE : undefined,
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
    color: COLORS.DARK_GREY_TITLE,
  },
  subtitle: {
    color: COLORS.DARK_MODE_LIGHT_GREY,
    fontSize: FONT_SIZE_5,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.OFF_WHITE,
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3, // Add shadow effect for elevation
  },
  settingLabel: {
    fontSize: FONT_SIZE_4,
    fontWeight: "500",
    color: COLORS.DARK_GREY_TITLE,
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