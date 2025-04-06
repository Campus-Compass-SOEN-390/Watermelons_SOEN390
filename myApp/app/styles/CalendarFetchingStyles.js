import { StyleSheet } from "react-native";
import {
  FONT_SIZE_1,
  FONT_SIZE_2,
  FONT_SIZE_3,
  FONT_SIZE_4,
  FONT_SIZE_5,
  COLORS
} from "./constants";

// Create a function that generates styles based on theme and mode
export const createCalendarFetchingStyles = ({ theme, isDarkMode }) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.OFF_WHITE,
      justifyContent: "center",
      flex: 1,
      paddingTop: 5,
    },
    redContainer: {
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.CONCORDIA_RED,
      margin: 10,
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch",
      minHeight: 100,
    },
    whiteContainer: {
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.WHITE,
      width: "90%",
      height: "90%",
      padding: 20,
      borderRadius: 8,
      elevation: 4,
      shadowColor: isDarkMode ? COLORS.DARK_MODE_GREY : COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
    },
    input: {
      height: 50,
      borderColor: isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.LIGHT_GREY_INPUT_BOXES,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 10,
      fontSize: FONT_SIZE_3,
      backgroundColor: isDarkMode ? "rgba(51, 51, 51, 0.8)" : COLORS.CONCORDIA_RED,
      color: isDarkMode ? COLORS.WHITE : collectRoutesUsingEdgeRuntime.DARK_GREY_TITLE,
    },
    connectButton: {
      backgroundColor: COLORS.CONCORDIA_RED,
      padding: 15,
      borderRadius: 25,
      alignSelf: "center",
      minWidth: 100,
      paddingHorizontal: 20,
      position: "absolute",
      bottom: 55,
    },
    buttonText: {
      color: COLORS.WHITE,
      fontSize: FONT_SIZE_4,
      fontWeight: "bold",
    },

    // --- Success Screen Styles ---
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: isDarkMode ? COLORS.DARK_MODE_DEEP_GREY : COLORS.OFF_WHITE,
    },
    successTitle: {
      fontSize: FONT_SIZE_5,
      fontWeight: "bold",
      textAlign: "center",
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
      marginHorizontal: 20,
    },
    successSubtitle: {
      marginTop: 10,
      fontSize: FONT_SIZE_3,
      textAlign: "center",
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : COLORS.DARK_MODE_LIGHT_GREY,
    },

    // --- Event Item Styles ---
    eventItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.OFF_WHITE,
      borderRadius: 6,
    },
    eventTitle: {
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      marginBottom: 4,
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
    },
    eventDate: {
      fontSize: FONT_SIZE_2,
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : COLORS.DARK_MODE_LIGHT_GREY,
    },
    logo: {
      width: 150,
      height: 150,
      marginVertical: 20,
    },

    // --- Calendar History Track ---
    subtitle: {
      fontSize: FONT_SIZE_2,
      fontWeight: "bold",
      marginBottom: 10,
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_GREY_TITLE,
    },
    historyItem: {
      backgroundColor: isDarkMode
        ? "rgba(70, 70, 70, 0.5)"
        : "rgba(0, 0, 0, 0.19)",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      paddingVertical: 5,
    },
    historyText: {
      fontSize: 10,
      color: isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
    },

    // --- Clear History Button ---
    clearHistoryButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      padding: 10,
      borderRadius: 25,
      backgroundColor: isDarkMode ? "rgba(70, 70, 70, 0.5)" : "#f4f4f4",
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.LIGHT_GREY_INPUT_BOXES,
      alignSelf: "center",
      position: "absolute",
      bottom: 10,
    },
    clearHistoryText: {
      fontSize: FONT_SIZE_1,
      color: isDarkMode ? COLORS.WHITE : COLORS.DARK_MODE_GREY,
      fontWeight: "500",
    },
    placeholderTextColor: {
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : COLORS.DARK_MODE_LIGHT_GREY,
    },
    calendarHistoryContainer: {
      height: 100,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.LIGHT_GREY_INPUT_BOXES,
      borderRadius: 8,
      padding: 5,
      backgroundColor: isDarkMode ? "rgba(51, 51, 51, 0.5)" : "transparent",
    },
    noHistoryText: {
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : COLORS.LIGHT_GREY,
      fontStyle: "italic",
    },
    iconColor: isDarkMode ? "rgba(255, 255, 255, 0.7)" : COLORS.LIGHT_GREY,

    // Header buttons styles
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.CONCORDIA_RED,
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : "rgba(0, 0, 0, 0.1)",
    },
    headerButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode
        ? "rgba(80, 80, 80, 0.5)"
        : "rgba(255, 255, 255, 0.2)",
    },
    headerButtonText: {
      color: COLORS.WHITE,
      fontWeight: "bold",
    },
  });
};

// Keep the original styles for backward compatibility
export const calendarFetchingStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.OFF_WHITE,
    justifyContent: "center",
    flex: 1,
  },
  redContainer: {
    backgroundColor: COLORS.CONCORDIA_RED,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: 100,
  },
  whiteContainer: {
    backgroundColor: COLORS.CONCORDIA_RED,
    width: "90%",
    height: "90%",
    padding: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: COLORS.BLACK_OR_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.DARK_GREY_TITLE,
  },
  input: {
    height: 50,
    borderColor: COLORS.LIGHT_GREY_INPUT_BOXES,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: FONT_SIZE_3,
    backgroundColor: COLORS.OFF_WHITE,
  },
  connectButton: {
    backgroundColor: COLORS.CONCORDIA_RED,
    padding: 15,
    borderRadius: 25,
    alignSelf: "center",
    minWidth: 100,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 55,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE_4,
    fontWeight: "bold",
  },

  // --- Success Screen Styles ---
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.OFF_WHITE,
  },
  successTitle: {
    fontSize: FONT_SIZE_5,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.DARK_GREY_TITLE,
    marginHorizontal: 20,
  },
  successSubtitle: {
    marginTop: 10,
    fontSize: FONT_SIZE_3,
    textAlign: "center",
    color: COLORS.DARK_MODE_LIGHT_GREY,
  },

  // --- Event Item Styles ---
  eventItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.OFF_WHITE,
    borderRadius: 6,
  },
  eventTitle: {
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.DARK_GREY_TITLE,
  },
  eventDate: {
    fontSize: FONT_SIZE_2,
    color: COLORS.DARK_MODE_LIGHT_GREY,
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },

  // --- Calendar History Track ---
  subtitle: {
    fontSize: FONT_SIZE_2,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: "rgba(0, 0, 0, 0.19)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    paddingVertical: 5,
  },
  historyText: {
    fontSize: 10,
    color: COLORS.BLACK_OR_SHADOW,
  },

  // --- Clear History Button ---
  clearHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.OFF_WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY_INPUT_BOXES,
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  clearHistoryText: {
    fontSize: FONT_SIZE_1,
    color: COLORS.DARK_MODE_GREY,
    fontWeight: "500",
  },
});

export default calendarFetchingStyles;