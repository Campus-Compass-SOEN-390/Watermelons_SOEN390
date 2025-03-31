import { StyleSheet } from "react-native";

// Create a function that returns styles based on theme
const createPopupStyles = ({ isDarkMode, theme }) => {
  // Theme properties with defaults
  const backgroundColor = isDarkMode
    ? theme?.cardBackground || "#1e1e1e"
    : "#fff";
  const textColor = isDarkMode ? theme?.text || "#fff" : "#333";
  const titleColor = isDarkMode ? theme?.text || "#fff" : "#000";
  const subTextColor = isDarkMode ? theme?.subText || "#aaa" : "#444";
  const iconColor = isDarkMode ? theme?.text || "#fff" : "#333";
  const closeIconColor = isDarkMode ? theme?.text || "#ddd" : "#555";
  const shadowColor = isDarkMode ? "#000" : "#000";
  const redButtonColor = isDarkMode
    ? theme?.buttonBackground || "#aa0000"
    : "#8b0000";
  const grayButtonColor = isDarkMode
    ? theme?.buttonBackground2 || "#606060"
    : "#4a4a4a";
  const alertColor = isDarkMode ? "#ff6b6b" : "red";

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)", // slightly darker for better contrast in dark mode
      justifyContent: "center",
      alignItems: "center",
    },
    popup: {
      backgroundColor: backgroundColor,
      borderRadius: 20,
      padding: 24,
      width: "95%",
      maxHeight: "85%",
      maxWidth: 400,
      position: "relative",
      elevation: 5,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 4,
    },
    closeIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 4,
      zIndex: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
      color: titleColor,
    },
    scrollView: {
      maxHeight: 300,
      width: "100%",
    },
    infoSection: {
      gap: 10,
      width: "100%",
    },
    buildingName: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 4,
      color: titleColor,
    },
    subName: {
      fontSize: 14,
      color: subTextColor,
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      flexWrap: "wrap",
    },
    icon: {
      marginRight: 8,
      marginTop: 2,
      color: iconColor,
      flexShrink: 0,
    },
    text: {
      flex: 1,
      flexShrink: 1,
      flexGrow: 1,
      fontSize: 14,
      color: textColor,
      textAlign: "left",
    },

    boldLabel: {
      fontWeight: "bold",
      color: textColor,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 20,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 30,
      minWidth: 155,
      flexWrap: "wrap",
    },
    redButton: {
      backgroundColor: redButtonColor,
    },
    grayButton: {
      backgroundColor: grayButtonColor,
    },
    buttonText: {
      color: "white",
      marginLeft: 6,
      fontWeight: "600",
      fontSize: 15,
    },
    alertText: {
      color: alertColor,
      textAlign: "center",
      marginTop: 10,
    },
    iconCenter: {
      alignItems: "center",
      marginBottom: 16,
    },
  });
};

export default createPopupStyles;
