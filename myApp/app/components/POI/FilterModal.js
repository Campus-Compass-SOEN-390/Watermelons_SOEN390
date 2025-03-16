// src/components/FilterModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, Switch, SafeAreaView } from "react-native";
import Slider from "@react-native-community/slider";
import PropTypes from 'prop-types';
import { styles } from "../../styles/poiStyles";

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
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.filterModalContainer}>
        <SafeAreaView>
          <View style={styles.filterModalContent}>
            {/* Header with title and close button */}
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter Points of Interest</Text>
              <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
                <Text style={styles.closeModalIcon}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Distance Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distance Filter</Text>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Enable distance filtering</Text>
                <Switch 
                  value={useDistance} 
                  onValueChange={setUseDistance} 
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
                    onValueChange={setDistance}
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
                  value={showCafes} 
                  onValueChange={setShowCafes} 
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showCafes ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Restaurants</Text>
                <Switch 
                  value={showRestaurants} 
                  onValueChange={setShowRestaurants}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showRestaurants ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Activities</Text>
                <Switch 
                  value={showActivities} 
                  onValueChange={setShowActivities}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showActivities ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
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
