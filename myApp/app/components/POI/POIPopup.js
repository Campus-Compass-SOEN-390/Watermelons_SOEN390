import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { ThemeContext } from "../../context/ThemeContext"; // Update this path if needed

const POIPopup = ({
  poi = null,
  distance = null,
  onClose,
  onGetDirections,
  isDarkMode: propIsDarkMode,
  theme: propTheme,
}) => {
  // Get theme from context
  const themeContext = useContext(ThemeContext);

  if (!poi) return null;

  const isDarkMode =
    propIsDarkMode !== undefined ? propIsDarkMode : themeContext?.isDarkMode;
  const theme = propTheme || themeContext?.theme;

  // Create theme-aware styles
  const themedStyles = createThemedStyles(isDarkMode, theme);

  // Format distance in a readable way
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  return (
    <View
      style={themedStyles.container}
      testID="poi-popup"
      accessible={true}
      accessibilityLabel="Point of interest information"
    >
      {/* Close button */}
      <TouchableOpacity
        style={themedStyles.closeButton}
        onPress={onClose}
        testID="close-button"
        accessible={true}
        accessibilityLabel="Close point of interest information"
        accessibilityRole="button"
      >
        <MaterialIcons
          name="close"
          size={20}
          color={isDarkMode ? theme?.text || "#bbb" : "#666"}
        />
      </TouchableOpacity>

      {/* POI info */}
      <Text style={themedStyles.name}>{poi.name}</Text>
      <Text style={themedStyles.detail}>
        {poi.rating
          ? `★ ${poi.rating} (${poi.user_ratings_total || 0} ratings)`
          : "No ratings"}
      </Text>
      <Text style={themedStyles.detail}>{poi.vicinity || ""}</Text>
      <Text style={themedStyles.detail}>
        {distance ? `Distance: ${formatDistance(distance)}` : ""}
      </Text>

      {/* Get directions button */}
      <TouchableOpacity
        style={themedStyles.directionsButton}
        onPress={onGetDirections}
        testID="directions-button"
        accessible={true}
        accessibilityLabel="Get directions to this location"
        accessibilityRole="button"
      >
        <MaterialIcons name="directions" size={16} color="white" />
        <Text style={themedStyles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define prop types
POIPopup.propTypes = {
  poi: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    user_ratings_total: PropTypes.number,
    vicinity: PropTypes.string,
  }),
  distance: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onGetDirections: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  theme: PropTypes.object,
};

// Create theme-aware styles
const createThemedStyles = (isDarkMode, theme) => {
  const backgroundColor = isDarkMode
    ? theme?.cardBackground || "#2a2a2a"
    : "white";
  const textColor = isDarkMode ? theme?.text || "#fff" : "#000";
  const detailColor = isDarkMode ? theme?.subText || "#aaa" : "#666";
  const buttonColor = theme?.buttonBackground || "#922338";

  return StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      borderRadius: 8,
      padding: 12,
      width: 220,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.5 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: isDarkMode ? "#444" : "transparent",
    },
    closeButton: {
      position: "absolute",
      right: 8,
      top: 8,
      zIndex: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 4,
      paddingRight: 24,
      color: textColor,
    },
    detail: {
      fontSize: 12,
      color: detailColor,
      marginBottom: 2,
    },
    directionsButton: {
      backgroundColor: buttonColor,
      borderRadius: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      marginTop: 8,
    },
    directionsText: {
      color: "white",
      fontWeight: "bold",
      marginLeft: 4,
    },
  });
};

export default POIPopup;
