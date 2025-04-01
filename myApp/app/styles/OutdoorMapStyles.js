// outdoorMapStyles.js
import { StyleSheet, Dimensions } from "react-native";
import {
  FONT_SIZE_1,
  FONT_SIZE_2,
  FONT_SIZE_3,
  FONT_SIZE_4,
  FONT_SIZE_5,
  COLORS,
} from "./constants";

// Set these variables as needed (or import them from a config)
const safeAreaTop = 20;
const safeAreaBottom = 20;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const createOutdoorMapStyles = (theme) => {
  return StyleSheet.create({
    // Container that wraps the whole screen, now accounting for safe areas
    containerForMap: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: safeAreaTop,
      paddingBottom: 0,
    },

    // The actual map container – note that its size remains the full screen dimensions.
    container: {
      flex: 1,
      width: screenWidth,
      height: screenHeight,
      position: "relative",
    },
    map: {
      flex: 1,
      width: "100%",
      height: "100%",
    },

    // Floating buttons container: Moved to bottom-right
    buttonContainer: {
      position: "absolute",
      right: 20,
      bottom: 95, // Position above tab bar
      alignItems: "center",
      zIndex: 10,
    },
    button: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      width: 50,
      height: 50,
    },
    debugText: {
      color: theme.buttonText,
      fontSize: FONT_SIZE_1,
      marginTop: 2,
    },

    // Modal styles adjusted for safe areas
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingTop: safeAreaTop,
      paddingBottom: safeAreaBottom,
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    modalTitle: {
      fontSize: FONT_SIZE_4,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },
    modalText: {
      fontSize: FONT_SIZE_2,
      textAlign: "center",
      marginBottom: 15,
      color: theme.text,
    },
    closeButton: {
      backgroundColor: COLORS.RED_CLOSE_BUTTON,
      padding: 8,
      borderRadius: 20,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButtonText: {
      color: COLORS.WHITE,
      fontWeight: "bold",
      fontSize: FONT_SIZE_3,
    },

    // Switch Button Container now placed above the bottom safe area
    switchButtonContainer: {
      position: "absolute",
      Color: theme.buttonBackground,
      bottom: safeAreaBottom + 15,
      left: 20,
      zIndex: 2,
    },
    switchButton: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 20,
      marginBottom: 10,
    },
    switchButtonText: {
      fontSize: FONT_SIZE_2,
      color: theme.text,
      fontWeight: "bold",
      // Add text shadow for better visibility
      textShadowColor: theme.isDarkMode
        ? "rgba(0, 0, 0, 0.75)"
        : "rgba(255, 255, 255, 0.75)",
      textShadowOffset: { width: 0.5, height: 0.5 },
      textShadowRadius: 1,
    },

    // Shuttle button styled and positioned similar to other buttons
    shuttleButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      padding: 10,
      borderRadius: 20,
      marginBottom: 10,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    shuttleButtonContainer: {
      position: "absolute",
      bottom: safeAreaBottom + 85,
      left: 150,
      zIndex: 2,
    },
    shuttleIcon: {
      width: 15,
      height: 15,
      marginRight: 8,
    },
    titleForMap: {
      fontSize: FONT_SIZE_5,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.text,
    },
    annotationContainer: {
      backgroundColor: theme.isDarkMode
        ? "rgba(40, 40, 40, 0.7)"
        : "rgba(255, 255, 255, 0.7)",
      borderRadius: 10,
      padding: 10,
    },
    annotationText: {
      fontWeight: "bold",
      textAlign: "center",
      color: theme.isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
      backgroundColor: theme.isDarkMode
        ? "rgba(40, 40, 40, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      fontSize: FONT_SIZE_2,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      overflow: "hidden",
      // Add text shadow for better visibility
      textShadowColor: theme.isDarkMode
        ? "rgba(0, 0, 0, 0.75)"
        : "rgba(255, 255, 255, 0.75)",
      textShadowOffset: { width: 0.5, height: 0.5 },
      textShadowRadius: 1,
    },

    // Action button (Filter button) - repositioned to bottom right
    actionButton: {
      position: "absolute",
      bottom: 180, // Position above the POI toggle button
      right: 20,
      backgroundColor: theme.buttonBackground,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderRadius: 20,
      zIndex: 10,
      width: 50,
      height: 50,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    actionButtonText: {
      color: theme.buttonText,
      marginLeft: 5,
      fontWeight: "bold",
    },

    // Loading indicato
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      color: theme.buttonBackground,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.isDarkMode
        ? "rgba(0,0,0,0.7)"
        : "rgba(255,255,255,0.7)",
      zIndex: 20,
    },

    footerContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.cardBackground,
      paddingVertical: 35,
      elevation: 8,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: "row", // Arrange children horizontally
      justifyContent: "space-between", // Space out children
      alignItems: "center", // Center children vertically
    },

    footerText: {
      marginLeft: 30,
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      color: theme.text,
    },
    stepsButton: {
      backgroundColor: theme.isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.DARK_GREY_TITLE,
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    footerButtonText: {
      color: COLORS.WHITE,
      fontSize: FONT_SIZE_2,
      fontWeight: "bold",
    },

    stepsList: {
      maxHeight: 300,
      padding: 10,
    },
    stepItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    stepText: {
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      color: theme.text,
    },
    stepDistance: {
      fontSize: FONT_SIZE_2,
      color: theme.isDarkMode ? COLORS.LIGHT_GREY : "gray",
    },
    cancelButtonContainer: {
      position: "absolute",
      bottom: safeAreaBottom + 85,
      left: "80%",
      zIndex: 2,
    },
  });
};

// Default export for backward compatibility
export default createOutdoorMapStyles({
  background: COLORS.OFF_WHITE,
  cardBackground: COLORS.WHITE,
  buttonBackground: COLORS.CONCORDIA_RED,
  buttonText: COLORS.WHITE,
  text: COLORS.DARK_GREY_TITLE,
  borderColor: COLORS.LIGHT_GREY_INPUT_BOXES,
  shadowColor: COLORS.BLACK_OR_SHADOW,
  isDarkMode: false,
});