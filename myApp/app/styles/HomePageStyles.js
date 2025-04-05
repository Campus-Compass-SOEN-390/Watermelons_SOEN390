import { StyleSheet, Platform } from "react-native";
import { FONT_SIZE_4, COLORS } from "./constants";

// Create a function that returns theme-dependent styles
export const createHomePageStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    logo: {
      width: 150,
      height: 150,
      alignSelf: "center",
      marginBottom: 20,
      marginTop: Platform.OS === "android" ? 0 : 70,
    },
    button: {
      backgroundColor: theme.cardBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 80,
      flex: 1,
      padding: 10,
      borderRadius: 20,
      margin: 10,
      //Shadow for iOS
      shadowColor: theme.shadowColor || COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Shadow for android
      elevation: 5,
    },
    buttonOrange: {
      backgroundColor: theme.buttonBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 80,
      flex: 1,
      padding: 10,
      borderRadius: 20,
      margin: 10,
      //Shadow for iOS
      shadowColor: theme.shadowColor || COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Shadow for android
      elevation: 5,
    },
    googleButton: {
      backgroundColor: theme.cardBackground,
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
      margin: 10,
      height: 60,
      flex: 1,
      //Shadow for iOS
      shadowColor: theme.shadowColor || COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Shadow for android
      elevation: 5,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
      paddingHorizontal: 20,
      alignItems: "center",
    },
    buttonsContainer: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 20,
      borderRadius: 20,
      padding: 15,
      marginVertical: 10,
      width: "90%",
      shadowColor: theme.shadowColor || COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Shadow for android
      elevation: 5,
    },
    infoButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
        
    buttonText: {
      color: theme.text,
      textAlign: "center",
      fontSize: FONT_SIZE_4,
      flex: 1,
    },
    googleButtonText: {
      color: theme.text,
      textAlign: "center",
      fontSize: FONT_SIZE_4,
      marginLeft: 8,
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.buttonText,
    },
    icon: {
      width: 30,
      height: 30,
    },
    themeToggle: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 20,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.buttonBackground,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
      // Shadow
      shadowColor: theme.shadowColor || COLORS.BLACK_OR_SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
  });
};

// Export a default version for backward compatibility
export const homepageStyles = createHomePageStyles({
  background: COLORS.OFF_WHITE,
  cardBackground: COLORS.WHITE,
  buttonBackground: COLORS.CONCORDIA_RED,
  buttonText: COLORS.WHITE,
  text: COLORS.BLACK_OR_SHADOW,
  shadowColor: COLORS.BLACK_OR_SHADOW,
});

export default homepageStyles;