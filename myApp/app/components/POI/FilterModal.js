// src/components/FilterModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, Switch, SafeAreaView } from "react-native";
import Slider from "@react-native-community/slider";
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
              <Text style={styles.filterSectionTitle}>Distance Range</Text>
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
              <Text style={styles.distanceValue}>{distance} kilometers</Text>
            </View>

            {/* Categories Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categories</Text>
              
              <View style={styles.filterOption}>
                <View style={styles.categoryContainer}>
                  <Text style={styles.filterOptionText}>Cafes</Text>
                </View>
                <Switch 
                  value={showCafes} 
                  onValueChange={setShowCafes} 
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showCafes ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <View style={styles.categoryContainer}>
                  <Text style={styles.filterOptionText}>Restaurants</Text>
                </View>
                <Switch 
                  value={showRestaurants} 
                  onValueChange={setShowRestaurants}
                  trackColor={{ false: "#e0e0e0", true: "#d6909a" }}
                  thumbColor={showRestaurants ? "#922338" : "#f4f3f4"}
                  ios_backgroundColor="#e0e0e0"
                />
              </View>
              
              <View style={styles.filterOption}>
                <View style={styles.categoryContainer}>
                  <Text style={styles.filterOptionText}>Activities</Text>
                </View>
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

export default FilterModal;
