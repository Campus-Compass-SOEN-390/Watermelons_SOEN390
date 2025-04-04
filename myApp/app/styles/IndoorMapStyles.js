import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONT_SIZE_3, FONT_SIZE_4 } from "./constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const createIndoorMapStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      height: screenHeight,
      position: "relative",
      backgroundColor: theme.background,
    },
    floorButtonContainer: {
      backgroundColor: theme.cardBackground,
      position: "absolute",
      right: 20,
      bottom: 340,
      alignItems: "center",
      borderRadius: 20,
      shadowColor: theme.shadowColor,
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    buildingsContainer: {
      backgroundColor: theme.cardBackground,
      position: "absolute",
      left: 20,
      bottom: 340,
      borderRadius: 20,
      shadowColor: theme.shadowColor,
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      zIndex: 11,
      minWidth: 50,
      minHeight: 50,
    },
    expandedBuildingsContainer: {
      width: 170,
      paddingTop: 5,
      paddingRight: 5,
      paddingBottom: 5,
      paddingLeft: 5,
    },
    button: {
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    expandedButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 5,
    },
    expandedButton: {
      width: 70,
      height: 50,
      backgroundColor: theme.isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.OFF_WHITE,
      borderRadius: 10,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    switchCampusButton: {
      position: "absolute",
      backgroundColor: theme.cardBackground,
      borderRadius: 20,
      bottom: 115,
      left: 20,
      padding: 10,
      shadowColor: theme.shadowColor,
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    disabledButton: {
      opacity: 0.5,
    },
    text: {
      fontSize: 13,
      fontWeight: "bold",
      color: theme.text,
    },
    map: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.isDarkMode
        ? "rgba(0,0,0,0.7)"
        : "rgba(255,255,255,0.7)",
      zIndex: 20,
    },
    // Position button styles
    positionButtonsContainer: {
      position: "absolute",
      left: 20,
      bottom: 390, // Position above floor button container
      flexDirection: "column",
      alignItems: "center",
    },
    positionButton: {
      backgroundColor: theme.cardBackground,
      width: 50,
      height: 50,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowColor: theme.shadowColor,
      elevation: 8,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    campusButtonText: {
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
    },
    labelPOIText: {
      textField: ["coalesce", ["get", "name"], "Unnamed"],
      textSize: 14,
      textColor: theme.isDarkMode ? COLORS.WHITE : COLORS.BLACK_OR_SHADOW,
      textHaloColor: theme.isDarkMode ? COLORS.DARK_GREY_TITLE : COLORS.WHITE,
      textHaloWidth: 1,
    },
    lineWall: {
      lineColor: theme.buttonBackground,
      lineWidth: 2,
      lineOpacity: 1.0,
    },
    linePath: {
      lineColor: theme.isDarkMode ? COLORS.LIGHT_GREY_INPUT_BOXES : COLORS.BLACK_OR_SHADOW,
      lineWidth: 2,
      lineOpacity: 0.5,
    },
    roomLayer: {
      lineColor: theme.buttonBackground,
      lineWidth: 2,
      lineOpacity: 1.0,
    },
    fillLayer: {
      fillColor: theme.buttonBackground,
      fillOpacity: 0.2,
    },
    // Modal styles
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
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
      fontSize: FONT_SIZE_4,
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
    annotationContainer: {
      alignItems: "center",
    },
    annotationText: {
      color: theme.text,
      fontWeight: "bold",
      backgroundColor: theme.isDarkMode
        ? "rgba(40, 40, 40, 0.7)"
        : "rgba(255, 255, 255, 0.7)",
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    // Theme toggle button
    themeToggleButton: {
      position: "absolute",
      top: 140,
      right: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.buttonBackground,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
      zIndex: 100,
    },
  });
};

// Default export for backward compatibility
export default createIndoorMapStyles({
  background: COLORS.OFF_WHITE,
  cardBackground: COLORS.WHITE,
  buttonBackground: COLORS.CONCORDIA_RED,
  text: COLORS.BLACK_OR_SHADOW,
  shadowColor: COLORS.BLACK_OR_SHADOW,
  isDarkMode: false,
});