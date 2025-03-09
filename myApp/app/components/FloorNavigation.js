import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles/IndoorMapStyles";

const FloorNavigation = ({ selectedBuilding, selectedFloor, onChangeFloor }) => {
  if (!selectedBuilding?.floors || selectedBuilding.floors.length === 0) return null;

  const floors = selectedBuilding.floors;
  const currentIndex = floors.indexOf(selectedFloor || floors[0]);

  const handleChangeFloor = (direction) => {
    if (direction === "up" && currentIndex < floors.length - 1) {
      onChangeFloor(floors[currentIndex + 1]);
    } else if (direction === "down" && currentIndex > 0) {
      onChangeFloor(floors[currentIndex - 1]);
    }
  };

  return (
    <View style={styles.floorButtonContainer}>
      <TouchableOpacity
        style={[styles.button, currentIndex === floors.length - 1 && styles.disabledButton]}
        onPress={() => handleChangeFloor("up")}
        disabled={currentIndex === floors.length - 1}
        testID="floor-up"
      >
        <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.text}>{selectedFloor || floors[0]}</Text>

      <TouchableOpacity
        style={[styles.button, currentIndex === 0 && styles.disabledButton]}
        onPress={() => handleChangeFloor("down")}
        disabled={currentIndex === 0}
        testID="floor-down"
      >
        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};
FloorNavigation.propTypes = {
  selectedBuilding: PropTypes.shape({
    floors: PropTypes.array
  }),
  selectedFloor: PropTypes.string,
  onChangeFloor: PropTypes.func.isRequired
};

export default FloorNavigation;
