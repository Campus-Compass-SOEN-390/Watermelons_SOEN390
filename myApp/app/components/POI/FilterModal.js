// src/components/FilterModal.js
import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import PropTypes from "prop-types";
import { styles as defaultStyles } from "../../styles/poiStyles";
import { ThemeContext } from "../../context/ThemeContext";

// Create theme-aware styles for the FilterModal
const getThemedStyles = (isDarkMode, theme, styles) => {
  // If we have theme and isDarkMode props, create dynamic styles
  if (theme && isDarkMode !== undefined) {
    const backgroundColor = isDarkMode
      ? theme.cardBackground || "#1e1e1e"
      : "#fff";
    const textColor = isDarkMode ? theme.text || "#fff" : "#333";
    const buttonColor = theme.buttonBackground || "#922338";

    return {
      ...styles,
      filterModalContainer: {
        ...styles.filterModalContainer,
        backgroundColor: "rgba(0,0,0,0.6)", // Slightly darker overlay in dark mode
      },
      filterModalContent: {
        ...styles.filterModalContent,
        backgroundColor: backgroundColor,
        shadowColor: "#000",
        shadowOpacity: isDarkMode ? 0.4 : 0.2,
      },
      filterModalTitle: {
        ...styles.filterModalTitle,
        color: textColor,
      },
      filterSectionTitle: {
        ...styles.filterSectionTitle,
        color: textColor,
      },
      filterOptionText: {
        ...styles.filterOptionText,
        color: textColor,
      },
      distanceRangeLabel: {
        ...styles.distanceRangeLabel,
        color: textColor,
      },
      closeModalIcon: {
        ...styles.closeModalIcon,
        color: textColor,
      },
      applyButton: {
        ...styles.applyButton,
        backgroundColor: buttonColor,
      },
    };
  }

  // If no theme info provided, return default styles
  return styles;
};

const FilterModal = ({
  isVisible,
  onClose,
  distance,
  setDistance,
  showCafes,
  setShowCafes,
  showRestaurants,
  setShowRestaurants,
  showActivities,
  setShowActivities,
  useDistance,
  setUseDistance,
  isDarkMode,
  theme,
}) => {
  // If theme/isDarkMode weren't passed as props, get from context
  const themeContext = useContext(ThemeContext);
  const effectiveIsDarkMode =
    isDarkMode !== undefined ? isDarkMode : themeContext?.isDarkMode;
  const effectiveTheme = theme || themeContext?.theme;

  // Get appropriate styles based on theme
  const themedStyles = getThemedStyles(
    effectiveIsDarkMode,
    effectiveTheme,
    defaultStyles
  );

  // Theme-aware switch colors
  const trackColor = {
    false: effectiveIsDarkMode ? "#555" : "#e0e0e0",
    true: effectiveIsDarkMode ? "#7a3741" : "#d6909a",
  };
  const thumbColor = (value) => {
    if (effectiveIsDarkMode) {
      return value ? "#922338" : "#999";
    }
    return value ? "#922338" : "#f4f3f4";
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={themedStyles.filterModalContainer}>
        <SafeAreaView>
          <View style={themedStyles.filterModalContent}>
            {/* Header with title and close button */}
            <View style={themedStyles.filterModalHeader}>
              <Text style={themedStyles.filterModalTitle}>
                Filter Points of Interest
              </Text>
              <TouchableOpacity
                style={themedStyles.closeModalButton}
                onPress={onClose}
              >
                <Text style={themedStyles.closeModalIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Distance Section */}
            <View style={themedStyles.filterSection}>
              <Text style={themedStyles.filterSectionTitle}>
                Distance Filter
              </Text>

              <View style={themedStyles.filterOption}>
                <Text style={themedStyles.filterOptionText}>
                  Enable distance filtering
                </Text>
                <Switch
                  testID="distanceSwitch"
                  value={useDistance}
                  onValueChange={setUseDistance}
                  trackColor={trackColor}
                  thumbColor={thumbColor(useDistance)}
                  ios_backgroundColor={effectiveIsDarkMode ? "#555" : "#e0e0e0"}
                />
              </View>

              {useDistance && (
                <View style={themedStyles.distanceSliderContainer}>
                  <Text style={themedStyles.distanceRangeLabel}>
                    Maximum distance: {distance} kilometers
                  </Text>
                  <Slider
                    style={themedStyles.customSlider}
                    minimumValue={0.5}
                    maximumValue={10}
                    step={0.5}
                    value={distance}
                    onValueChange={setDistance}
                    minimumTrackTintColor="#922338"
                    maximumTrackTintColor={
                      effectiveIsDarkMode ? "#555" : "#e0e0e0"
                    }
                    thumbTintColor="#922338"
                  />
                </View>
              )}
            </View>

            {/* Categories Section */}
            <View style={themedStyles.filterSection}>
              <Text style={themedStyles.filterSectionTitle}>Categories</Text>

              <View style={themedStyles.filterOption}>
                <Text style={themedStyles.filterOptionText}>Cafes</Text>
                <Switch
                  testID="cafeSwitch"
                  value={showCafes}
                  onValueChange={setShowCafes}
                  trackColor={trackColor}
                  thumbColor={thumbColor(showCafes)}
                  ios_backgroundColor={effectiveIsDarkMode ? "#555" : "#e0e0e0"}
                />
              </View>

              <View style={themedStyles.filterOption}>
                <Text style={themedStyles.filterOptionText}>Restaurants</Text>
                <Switch
                  testID="restaurantSwitch"
                  value={showRestaurants}
                  onValueChange={setShowRestaurants}
                  trackColor={trackColor}
                  thumbColor={thumbColor(showRestaurants)}
                  ios_backgroundColor={effectiveIsDarkMode ? "#555" : "#e0e0e0"}
                />
              </View>

              <View style={themedStyles.filterOption}>
                <Text style={themedStyles.filterOptionText}>Activities</Text>
                <Switch
                  testID="activitySwitch"
                  value={showActivities}
                  onValueChange={setShowActivities}
                  trackColor={trackColor}
                  thumbColor={thumbColor(showActivities)}
                  ios_backgroundColor={effectiveIsDarkMode ? "#555" : "#e0e0e0"}
                />
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={themedStyles.applyButton}
              onPress={onClose}
            >
              <Text style={themedStyles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

FilterModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  distance: PropTypes.number.isRequired,
  setDistance: PropTypes.func.isRequired,
  showCafes: PropTypes.bool.isRequired,
  setShowCafes: PropTypes.func.isRequired,
  showRestaurants: PropTypes.bool.isRequired,
  setShowRestaurants: PropTypes.func.isRequired,
  showActivities: PropTypes.bool.isRequired,
  setShowActivities: PropTypes.func.isRequired,
  useDistance: PropTypes.bool.isRequired,
  setUseDistance: PropTypes.func.isRequired,
  // Add new theme props
  isDarkMode: PropTypes.bool,
  theme: PropTypes.object,
};

export default FilterModal;
