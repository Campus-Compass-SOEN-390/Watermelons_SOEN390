import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from 'prop-types';

const POIPopup = ({ poi = null, distance = null, onClose, onGetDirections }) => {
  if (!poi) return null;

  // Format distance in a readable way
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  return (
    <View style={styles.container} testID="poi-popup" accessible={true} accessibilityLabel="Point of interest information">
      {/* Close button */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        testID="close-button"
        accessible={true}
        accessibilityLabel="Close point of interest information"
        accessibilityRole="button"
      >
        <MaterialIcons name="close" size={20} color="#666" />
      </TouchableOpacity>

      {/* POI info */}
      <Text style={styles.name}>{poi.name}</Text>
      <Text style={styles.detail}>
        {poi.rating ? `★ ${poi.rating} (${poi.user_ratings_total || 0} ratings)` : 'No ratings'}
      </Text>
      <Text style={styles.detail}>{poi.vicinity || ''}</Text>
      <Text style={styles.detail}>
        {distance ? `Distance: ${formatDistance(distance)}` : ''}
      </Text>

      {/* Get directions button */}
      <TouchableOpacity 
        style={styles.directionsButton} 
        onPress={onGetDirections}
        testID="directions-button"
        accessible={true}
        accessibilityLabel="Get directions to this location"
        accessibilityRole="button"
      >
        <MaterialIcons name="directions" size={16} color="white" />
        <Text style={styles.directionsText}>Get Directions</Text>
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  },
  detail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  directionsButton: {
    backgroundColor: "#922338",
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

export default POIPopup;
