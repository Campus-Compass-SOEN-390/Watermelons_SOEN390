import { StyleSheet } from "react-native";
import {
  FONT_SIZE_1,
  FONT_SIZE_2,
  FONT_SIZE_3,
  FONT_SIZE_4,
} from "./constants";

// Create theme-aware styles
const createPOIListStyles = ({ isDarkMode, theme }) => {
  // Theme properties with defaults
  const primaryColor = theme?.buttonBackground || "#922338"; // App's primary color
  const backgroundColor = isDarkMode ? theme?.background || "#121212" : "#fff";
  const cardBackground = isDarkMode
    ? theme?.cardBackground || "#242424"
    : "#fff";
  const textColor = isDarkMode ? theme?.text || "#fff" : "#333";
  const subTextColor = isDarkMode ? theme?.subText || "#aaa" : "#666";
  const placeholderColor = isDarkMode ? "#444" : "#e0e0e0";
  const placeholderTextColor = isDarkMode ? "#aaa" : "#888";
  const shadowColor = "#000";

  // Category badge colors
  const cafeBadgeColor = isDarkMode ? "#601a1a" : "#FFCDD2"; // Darker/Lighter red
  const restaurantBadgeColor = isDarkMode ? "#1a4d1a" : "#C8E6C9"; // Darker/Lighter green
  const activityBadgeColor = isDarkMode ? "#0d3a62" : "#BBDEFB"; // Darker/Lighter blue
  const ratingBadgeColor = isDarkMode ? "#4d3800" : "#FFF8E1"; // Darker/Lighter yellow

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    headerContainer: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: backgroundColor,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: primaryColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    retryButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: primaryColor,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    filterButtonText: {
      color: "white",
      marginLeft: 5,
      fontWeight: "600",
    },
    buttonText: {
      color: "white",
      marginLeft: 5,
      fontWeight: "600",
    },
    listContainer: {
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 120, // Extra space for tab bar
      backgroundColor: backgroundColor,
    },
    poiItem: {
      backgroundColor: cardBackground,
      borderRadius: 28,
      marginVertical: 8,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 5,
      elevation: 5,
      overflow: "hidden",
    },
    poiContent: {
      padding: 15,
    },
    poiImage: {
      height: 180,
      width: "100%",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
    },
    noImagePlaceholder: {
      height: 120,
      width: "100%",
      backgroundColor: placeholderColor,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    noImageText: {
      color: placeholderTextColor,
      fontSize: FONT_SIZE_3,
      marginTop: 8,
    },
    poiHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    poiName: {
      fontSize: FONT_SIZE_4,
      fontWeight: "bold",
      flex: 1,
      color: textColor,
    },
    poiDistance: {
      fontSize: FONT_SIZE_2,
      color: subTextColor,
      marginLeft: 10,
      fontWeight: "500",
    },
    poiAddress: {
      fontSize: FONT_SIZE_2,
      color: subTextColor,
      marginTop: 5,
      marginBottom: 10,
    },
    categoryContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    categoryBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
    },
    cafeBadge: {
      backgroundColor: cafeBadgeColor,
    },
    restaurantBadge: {
      backgroundColor: restaurantBadgeColor,
    },
    activityBadge: {
      backgroundColor: activityBadgeColor,
    },
    categoryText: {
      fontSize: FONT_SIZE_1,
      fontWeight: "600",
      color: isDarkMode ? "#fff" : "#333",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 80,
      backgroundColor: backgroundColor,
    },
    loadingText: {
      marginTop: 10,
      color: subTextColor,
      fontSize: FONT_SIZE_3,
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: backgroundColor,
    },
    noResultsText: {
      fontSize: FONT_SIZE_3,
      color: subTextColor,
      textAlign: "center",
      lineHeight: 22,
    },
    errorText: {
      fontSize: FONT_SIZE_3,
      color: isDarkMode ? "#ff6b6b" : "#922338",
      textAlign: "center",
      padding: 20,
      lineHeight: 22,
    },
    // Rating badge
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: ratingBadgeColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingText: {
      fontSize: FONT_SIZE_1,
      fontWeight: "bold",
      marginLeft: 3,
      color: isDarkMode ? "#ffc107" : "#FF8F00",
    },
    // Get Directions Button
    directionsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      marginTop: 15,
      elevation: 3,
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 1.5,
    },
    directionsButtonText: {
      color: "white",
      fontWeight: "600",
      marginLeft: 8,
      fontSize: FONT_SIZE_2,
    },
    // Footer component styles (from newer version)
    footerContainer: {
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: backgroundColor,
    },
    footerText: {
      fontSize: FONT_SIZE_2,
      color: subTextColor,
    },
    // Scroll to top button styles (from newer version)
    scrollTopButton: {
      position: 'absolute',
      bottom: 90, // Position above tab bar
      right: 20,
      backgroundColor: primaryColor,
      borderRadius: 30,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.4 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 100,
    },
    scrollTopButtonTouchable: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Placeholder for loading state
    placeholderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: backgroundColor,
    },
    placeholderText: {
      fontSize: FONT_SIZE_3,
      color: subTextColor,
      marginTop: 12,
    },
  });
};

// Export the default styles using the theme-aware creator function
export const styles = createPOIListStyles({ isDarkMode: false, theme: null });

// Export the theme-aware styles creator function
export { createPOIListStyles };
