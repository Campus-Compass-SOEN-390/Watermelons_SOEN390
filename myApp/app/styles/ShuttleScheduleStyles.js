import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

// Create theme-aware styles function
export const createShuttleScheduleStyles = ({ theme, isDarkMode }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10, // Reduced to accommodate the HeaderButtons component
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.WHITE,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.CONCORDIA_RED, // Burgundy - consistent in both modes
      justifyContent: "center",
      alignItems: "center",
    },
    backText: {
      fontSize: 20,
      color: COLORS.WHITE,
      fontWeight: "bold",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
      color: isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
      paddingLeft: 30,
      paddingTop: 40
    },
    warningContainer: {
      paddingTop: 30,
      paddingRight: 15
    },
    warningButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.CONCORDIA_RED,
      justifyContent: "center",
      alignItems: "center",
    },
    warningIcon: {
      fontSize: 20,
      color: COLORS.WHITE,
    },
    switchButton: {
      alignSelf: "center",
      backgroundColor: COLORS.CONCORDIA_RED,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 10,
    },
    switchText: {
      fontSize: 16,
      color: COLORS.WHITE,
      fontWeight: "bold",
    },
    scheduleContainer: {
      marginTop: 10,
    },
    scheduleHeader: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
    },
    table: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      paddingBottom: 5,
      marginBottom: 5,
    },
    tableHeader: {
      fontSize: 18,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      color: isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 5,
    },
    tableText: {
      fontSize: 16,
      textAlign: "center",
      flex: 1,
      color: isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
    },
    highlight: {
      fontWeight: "bold",
      color: isDarkMode ? "#4CAF50" : "green", // Slightly lighter green in dark mode
    },
    verticalDivider: {
      width: 1,
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : COLORS.BLACK_OR_SHADOW,
      height: "100%",
      marginHorizontal: 10,
    },
    verticalDividerDashed: {
      width: 1,
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : COLORS.BLACK_OR_SHADOW,
      height: "100%",
      marginHorizontal: 10,
      borderStyle: "dashed",
    },
    error: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 20,
      color: isDarkMode ? COLORS.RED_CLOSE_BUTTON : "red",
    },
  });
};

// Default styles for backward compatibility
export const shuttleScheduleStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.CONCORDIA_RED, // Burgundy
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 20,
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  warningButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.CONCORDIA_RED,
    justifyContent: "center",
    alignItems: "center",
  },
  warningIcon: {
    fontSize: 20,
    color: COLORS.WHITE
  },
  switchButton: {
    alignSelf: "center",
    backgroundColor: COLORS.CONCORDIA_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  switchText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  scheduleContainer: {
    marginTop: 10,
  },
  scheduleHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 5,
  },
  tableText: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  highlight: {
    fontWeight: "bold",
    color: "green",
  },
  verticalDividerDashed: {
    width: 1,
    backgroundColor: COLORS.BLACK_OR_SHADOW,
    height: "100%",
    marginHorizontal: 10,
    borderStyle: "dashed",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});

export default shuttleScheduleStyles;
