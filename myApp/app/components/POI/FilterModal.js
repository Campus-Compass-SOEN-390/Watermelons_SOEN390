// src/components/FilterModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, Switch } from "react-native";
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>

          {/* Distance Slider */}
          <Text style={{ marginTop: 20 }}>Max Distance: {distance} km</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0.5}
            maximumValue={10}
            step={0.5}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#1E88E5"
            maximumTrackTintColor="#000000"
          />

          {/* Toggle switches */}
          <View style={styles.filterOption}>
            <Text>Cafes</Text>
            <Switch value={showCafes} onValueChange={setShowCafes} />
          </View>
          <View style={styles.filterOption}>
            <Text>Restaurants</Text>
            <Switch
              value={showRestaurants}
              onValueChange={setShowRestaurants}
            />
          </View>
          <View style={styles.filterOption}>
            <Text>Activities</Text>
            <Switch value={showActivities} onValueChange={setShowActivities} />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
