// src/components/FilterModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, Switch, SafeAreaView } from "react-native";
import Slider from "@react-native-community/slider";
import PropTypes from 'prop-types';
import { styles } from "../../styles/poiStyles";
import { useButtonInteraction } from '../../hooks/useButtonInteraction';

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
}) => {
  const { handleButtonPress } = useButtonInteraction();

  const handleClose = () => {
    handleButtonPress(null, 'Closing filter modal');
    onClose();
  };

  const handleApplyFilters = () => {
    handleButtonPress(null, 'Applying POI filters');
    onClose();
  };

  const handleDistanceChange = (value) => {
    handleButtonPress(null, `Setting distance to ${value} kilometers`);
    setDistance(value);
  };

  const handleCategoryToggle = (category, value, setter) => {
    handleButtonPress(null, `${value ? 'Showing' : 'Hiding'} ${category}`);
    setter(value);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.filterModalContainer}>
        <SafeAreaView>
          <View style={styles.filterModalContent}>
            {/* Header with title and close button */}
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter Points of Interest</Text>
              <TouchableOpacity 
                style={styles.closeModalButton} 
                onPress={handleClose}
                accessibilityLabel="Close filter modal"
              >
                <Text style={styles.closeModalIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Distance Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distance Filter</Text>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Enable distance filtering</Text>
                <Switch 
                  testID="distanceSwitch"
                  value={useDistance} 
                  onValueChange={(value) => handleCategoryToggle('distance filter', value, setUseDistance)}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={useDistance ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              {useDistance && (
                <View style={styles.distanceSliderContainer}>
                  <Text style={styles.distanceRangeLabel}>Maximum distance: {distance} kilometers</Text>
                  <Slider
                    style={styles.customSlider}
                    minimumValue={0.5}
                    maximumValue={10}
                    step={0.5}
                    value={distance}
                    onValueChange={handleDistanceChange}
                    minimumTrackTintColor="#922338"
                    maximumTrackTintColor="#e0e0e0"
                    thumbTintColor="#922338"
                  />
                </View>
              )}
            </View>

            {/* Categories Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categories</Text>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Cafes</Text>
                <Switch 
                  testID="cafeSwitch"
                  value={showCafes} 
                  onValueChange={(value) => handleCategoryToggle('cafes', value, setShowCafes)}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showCafes ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Restaurants</Text>
                <Switch testID="restaurantSwitch"
                  value={showRestaurants} 
                  onValueChange={(value) => handleCategoryToggle('restaurants', value, setShowRestaurants)}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showRestaurants ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Activities</Text>
                <Switch testID="activitySwitch"
                  value={showActivities} 
                  onValueChange={(value) => handleCategoryToggle('activities', value, setShowActivities)}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showActivities ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={handleApplyFilters}
              accessibilityLabel="Apply filters"
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
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
};

export default FilterModal;
