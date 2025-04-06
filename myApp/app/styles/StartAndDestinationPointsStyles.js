import { StyleSheet, Dimensions } from "react-native";
import { FONT_SIZE_2, FONT_SIZE_3, FONT_SIZE_4, COLORS } from "./constants";
const { width, height } = Dimensions.get("window");

export const createStartAndDestinationStyles = (theme, isDarkMode) => {
  return StyleSheet.create({
    tabBarStyle: {
      height: 80,
      backgroundColor: theme.cardBackground,
      borderRadius: 30,
      borderTopWidth: 0,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      position: "absolute",
      bottom: 20,
      left: 10,
      right: 10,
      marginHorizontal: 15,
    },
    container: {
      position: "absolute",
      top: 100,
      left: 20,
      right: 20,
      alignItems: "center",
      zIndex: 3,
    },
    card: {
      backgroundColor: theme.cardBackground,
      padding: 15,
      borderRadius: 28,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      width: "100%",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    label: {
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      color: theme.text,
      width: 50,
      textAlign: "right",
      position: "relative",
      right: 10,
    },
    input: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      borderRadius: 7,
      paddingHorizontal: 10,
      height: 40,
      position: "relative",
    },
    dropdownFrom: {
      position: "absolute",
      top: 93,
      width: "125.8%",
      left: -65,
      backgroundColor: theme.cardBackground,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 28,
      borderBottomLeftRadius: 28,
      elevation: 5,
      maxHeight: 150,
      zIndex: 10,
    },
    dropdownTo: {
      position: "absolute",
      top: 40,
      width: "125.8%",
      left: -65,
      backgroundColor: theme.cardBackground,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 28,
      borderBottomLeftRadius: 28,
      elevation: 5,
      maxHeight: 150,
      zIndex: 11,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    button: {
      backgroundColor: COLORS.LIGHT_GREY_INPUT_BOXES,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 7,
      alignSelf: "flex-start",
      marginTop: 5,
      position: "absolute",
      top: 120,
      left: 10,
      elevation: 40,
      shadowColor: theme.shadowColor,
    },
    buttonText: {
      fontSize: FONT_SIZE_2,
      color: theme.buttonText,
    },
    buttonContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      marginTop: 10,
    },
    footerContainer: {
      position: "absolute",
      bottom: (() => {
        if (Dimensions.get("window").height > 930) {
          return -680;
        } else if (height > 870) {
          return -625;
        } else {
          return -600;
        }
      })(),
      left: -30,
      right: 0,
      height: 350,
      width: width * 1,
      marginHorizontal: "2.5%",
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 18,
      justifyContent: "flex-start",
      elevation: 5,
      zIndex: 999,
    },
    footerButton: {
      flex: 1,
      marginHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    footerButtonText: {
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: "bold",
    },
    goButton: {
      fontSize: 8,
      backgroundColor: "#0FA958",
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    stepsButton: {
      backgroundColor: theme.isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.DARK_GREY_TITLE,
      padding: 10,
      paddingHorizontal: 20,
      width: "100%",
      borderRadius: 10,
    },
    favoriteButton: {
      backgroundColor: theme.isDarkMode ? COLORS.DARK_MODE_LIGHT_GREY : COLORS.DARK_GREY_TITLE,
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    etaText: {
      fontSize: FONT_SIZE_3,
      color: theme.text,
      marginBottom: 5,
      textAlign: "center",
      fontWeight: "bold",
    },
    accessibilityToggle: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginBottom: 4,
    },
    cancelButtonTopRight: {
      position: "absolute",
      top: 10,
      right: 10,
      fontSize: 26,
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
    },
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
      color: theme.text,
      marginBottom: 10,
    },
    modalText: {
      fontSize: FONT_SIZE_2,
      color: theme.text,
      textAlign: "center",
      marginBottom: 15,
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
    transportButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      width: 70,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedButton: {
      backgroundColor: theme.buttonBackground,
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
    modeText: {
      fontSize: FONT_SIZE_4,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },
    routesContainer: {
      flexDirection: "column",
      justifyContent: "space-around",
      marginBottom: 10,
      width: "100%",
    },
    routeCard: {
      backgroundColor: theme.isDarkMode ? COLORS.DARK_MODE_DEEP_GREY : COLORS.OFF_WHITE,
      padding: 12,
      marginVertical: 5,
      borderRadius: 8,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    routeTitle: {
      fontSize: FONT_SIZE_3,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    routeDetails: {
      fontSize: FONT_SIZE_2,
      color: theme.isDarkMode ? COLORS.LIGHT_GREY : COLORS.DARK_MODE_LIGHT_GREY,
      marginBottom: 3,
    },
    myLocationButton: {
      backgroundColor: theme.cardBackground,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignSelf: "flex-start",
      marginTop: 5,
      position: "absolute",
      top: 45,
      left: -15,
      elevation: 40,
      shadowColor: theme.shadowColor,
      zIndex: 11,
      width: width*0.868,
      height: 44,
      borderBottomColor: theme.borderColor,
      borderBottomWidth: 1,
      flexDirection: "row",
    },
    myLocationText: {
      fontSize: FONT_SIZE_3,
      color: theme.text,
      fontWeight: "bold",
    },
    loadingContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    loadingText: {
      marginTop: 10,
      fontSize: FONT_SIZE_2,
      color: theme.isDarkMode ? COLORS.LIGHT_GREY : COLORS.DARK_MODE_LIGHT_GREY,
      textAlign: "center",
    },
    themeToggleButton: {
      position: "absolute",
      top: 110,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
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
    indoorNavigationMessage: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.OFF_WHITE,
      borderRadius: 8,
      padding: 12,
      marginVertical: 10,
      shadowColor: COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      width: "100%",
    },
    indoorNavigationText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      color: COLORS.DARK_GREY_TITLE,
    },
  });
};

// Export default styles for backward compatibility
export default createStartAndDestinationStyles({
  cardBackground: COLORS.WHITE,
  text: COLORS.BLACK_OR_SHADOW,
  buttonBackground: COLORS.CONCORDIA_RED,
  buttonText: COLORS.BLACK_OR_SHADOW,
  inputBackground: COLORS.OFF_WHITE,
  borderColor: COLORS.LIGHT_GREY_INPUT_BOXES,
  shadowColor: COLORS.BLACK_OR_SHADOW,
});