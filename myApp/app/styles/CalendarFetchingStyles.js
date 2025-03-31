import { StyleSheet } from "react-native";
import {
  FONT_SIZE_1,
  FONT_SIZE_2,
  FONT_SIZE_3,
  FONT_SIZE_4,
  FONT_SIZE_5,
} from "./constants";

// Create a function that generates styles based on theme and mode
export const createCalendarFetchingStyles = ({ theme, isDarkMode }) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? "#333333" : "#f5f5f5",
      justifyContent: "center",
      flex: 1,
      paddingTop: 5,
    },
    redContainer: {
      backgroundColor: isDarkMode ? "#333333" : "#922338",
      margin: 10,
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch",
      minHeight: 100,
    },
    whiteContainer: {
      backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      width: "90%",
      height: "90%",
      padding: 20,
      borderRadius: 8,
      elevation: 4,
      shadowColor: isDarkMode ? "#444" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: isDarkMode ? "#FFFFFF" : "#333333",
    },
    input: {
      height: 50,
      borderColor: isDarkMode ? "#555555" : "#ddd",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 10,
      fontSize: FONT_SIZE_3,
      backgroundColor: isDarkMode ? "rgba(51, 51, 51, 0.8)" : "#f9f9f9",
      color: isDarkMode ? "#FFFFFF" : "#333333",
    },
    connectButton: {
      backgroundColor: isDarkMode ? "#922338" : "#922338",
      padding: 15,
      borderRadius: 25,
      alignSelf: "center",
      minWidth: 100,
      paddingHorizontal: 20,
      position: "absolute",
      bottom: 55,
    },
    buttonText: {
      color: "white",
      fontSize: FONT_SIZE_4,
      fontWeight: "bold",
    },

    // --- Success Screen Styles ---
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: isDarkMode ? "#1A1A1A" : "#f5f5f5",
    },
    successTitle: {
      fontSize: FONT_SIZE_5,
      fontWeight: "bold",
      textAlign: "center",
      color: isDarkMode ? "#FFFFFF" : "#333",
      marginHorizontal: 20,
    },
    successSubtitle: {
      marginTop: 10,
      fontSize: FONT_SIZE_3,
      textAlign: "center",
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#666",
    },

    // --- Event Item Styles ---
    eventItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: isDarkMode ? "#333333" : "#f9f9f9",
      borderRadius: 6,
    },
    eventTitle: {
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      marginBottom: 4,
      color: isDarkMode ? "#FFFFFF" : "#333",
    },
    eventDate: {
      fontSize: FONT_SIZE_2,
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#666",
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
      color: isDarkMode ? "#FFFFFF" : "#333333",
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
      color: isDarkMode ? "#FFFFFF" : "black",
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
      borderColor: isDarkMode ? "#555555" : "#ccc",
      alignSelf: "center",
      position: "absolute",
      bottom: 10,
    },
    clearHistoryText: {
      fontSize: FONT_SIZE_1,
      color: isDarkMode ? "#FFFFFF" : "#444",
      fontWeight: "500",
    },
    placeholderTextColor: {
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#666",
    },
    calendarHistoryContainer: {
      height: 100,
      borderWidth: 1,
      borderColor: isDarkMode ? "#555555" : "#ccc",
      borderRadius: 8,
      padding: 5,
      backgroundColor: isDarkMode ? "rgba(51, 51, 51, 0.5)" : "transparent",
    },
    noHistoryText: {
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#888",
      fontStyle: "italic",
    },
    iconColor: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "#888",

    // Header buttons styles
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? "#333333" : "#922338",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#555555" : "rgba(0, 0, 0, 0.1)",
    },
    headerButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode
        ? "rgba(80, 80, 80, 0.5)"
        : "rgba(255, 255, 255, 0.2)",
    },
    headerButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  });
};

// Keep the original styles for backward compatibility
export const calendarFetchingStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    flex: 1,
  },
  redContainer: {
    backgroundColor: "#922338",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: 100,
  },
  whiteContainer: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: "90%",
    padding: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: FONT_SIZE_3,
    backgroundColor: "#f9f9f9",
  },
  connectButton: {
    backgroundColor: "#922338",
    padding: 15,
    borderRadius: 25,
    alignSelf: "center",
    minWidth: 100,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 55,
  },
  buttonText: {
    color: "white",
    fontSize: FONT_SIZE_4,
    fontWeight: "bold",
  },

  // --- Success Screen Styles ---
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  successTitle: {
    fontSize: FONT_SIZE_5,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginHorizontal: 20,
  },
  successSubtitle: {
    marginTop: 10,
    fontSize: FONT_SIZE_3,
    textAlign: "center",
    color: "#666",
  },

  // --- Event Item Styles ---
  eventItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
  },
  eventTitle: {
    fontSize: FONT_SIZE_3,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  eventDate: {
    fontSize: FONT_SIZE_2,
    color: "#666",
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
    color: "black",
  },

  // --- Clear History Button ---
  clearHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  clearHistoryText: {
    fontSize: FONT_SIZE_1,
    color: "#444",
    fontWeight: "500",
  },
});

export default calendarFetchingStyles;
