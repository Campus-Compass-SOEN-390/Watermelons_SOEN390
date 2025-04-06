import { StyleSheet } from "react-native";
import {
  FONT_SIZE_1,
  FONT_SIZE_2,
  FONT_SIZE_3,
  FONT_SIZE_5,
  COLORS
} from "./constants";

// Create theme-aware styles
const createGoogleScheduleStyles = ({ isDarkMode, theme }) => {
  // Theme properties with defaults
  const primaryColor = theme?.buttonBackground || "#800020";
  const backgroundColor = isDarkMode
    ? theme?.background || COLORS.LESS_THAN_BLACK
    : COLORS.OFF_WHITE;
  const cardBackground = isDarkMode
    ? theme?.cardBackground || COLORS.DARK_MODE_DEEP_GREY
    : COLORS.OFF_WHITE;
  const textColor = isDarkMode ? theme?.text || COLORS.WHITE : COLORS.BLACK_OR_SHADOW;
  const subTextColor = isDarkMode ? theme?.subText || COLORS.LIGHT_GREY : COLORS.DARK_MODE_LIGHT_GREY;
  const highlightColor = isDarkMode ? COLORS.RED_CLOSE_BUTTON : COLORS.CONCORDIA_RED;
  const grayTextColor = isDarkMode ? COLORS.LIGHT_GREY : "gray";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : backgroundColor,
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    outerContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.WHITE,
    },
    daysRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    dayText: {
      fontSize: FONT_SIZE_2,
      fontWeight: "bold",
      color: isDarkMode ? COLORS.LIGHT_GREY : grayTextColor,
    },
    highlightedDay: {
      color: highlightColor,
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
    scheduleTitle: {
      fontSize: FONT_SIZE_5,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? COLORS.WHITE : textColor,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: cardBackground,
      borderRadius: 16,
      padding: 16,
      marginVertical: 6,
      alignItems: "center",
      // Enhanced shadows for dark mode
      shadowColor: isDarkMode ? COLORS.BLACK_OR_SHADOW: 'transaprent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.5 : 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    cardTextContainer: {
      flex: 1,
    },
    courseText: {
      fontWeight: "bold",
      fontSize: FONT_SIZE_3,
      marginBottom: 4,
      color: textColor,
    },
    courseLocation: {
      color: subTextColor,
      fontSize: FONT_SIZE_2,
    },
    courseTime: {
      color: subTextColor,
      fontSize: FONT_SIZE_2,
    },
    iconContainer: {
      backgroundColor: primaryColor,
      padding: 10,
      borderRadius: 12,
      marginLeft: 8,
    },
    todayButtonContainer: {
      position: "absolute",
      bottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    todayNavButton: {
      backgroundColor: primaryColor,
      padding: 10,
      borderRadius: 20,
    },
    todayLabelWrapper: {
      backgroundColor: primaryColor,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 25,
      marginHorizontal: 8,
      width: 150,
    },
    todayText: {
      color: "white",
      fontWeight: "bold",
      fontSize: FONT_SIZE_3,
      textAlign: "center",
    },
    nextClassContainer: {
      marginVertical: 12,
      padding: 16,
      backgroundColor: COLORS.DARK_MODE_DEEP_GREY, // Always dark for this container
      borderRadius: 12,
      alignItems: "center",
      // Enhanced shadows for dark mode
      shadowColor: COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.5 : 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    nextClassInfoText: {
      fontSize: FONT_SIZE_2,
      color: COLORS.WHITE, // Always white text in dark container
      textAlign: "center",
      marginBottom: 12,
      fontWeight: "500",
    },
    nextClassDirections: {
      backgroundColor: primaryColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginTop: 8,
    },
    nextClassDetailsText: {
      color: COLORS.WHITE,
      fontSize: FONT_SIZE_1,
      marginTop: 6,
      textAlign: "center",
      paddingHorizontal: 10,
    },
    nextClassButtonText: {
      color: COLORS.WHITE,
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
    },
    noClassText: {
      fontSize: FONT_SIZE_3,
      color: COLORS.LIGHT_GREY_INPUT_BOXES, // Light gray for dark container
      textAlign: "center",
      padding: 20,
      fontStyle: "italic",
    },
  });
};

// Default styles for backward compatibility
const styles = createGoogleScheduleStyles({ isDarkMode: false, theme: null });

export default styles;
export { createGoogleScheduleStyles };
