import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { shuttlePopupStyles } from "../styles/shuttlePopupStyles";
import PropTypes from "prop-types"; // Import PropTypes for validation

export default function ShuttleInfoPopup({ visible, onClose, shuttleDetails }) {
  console.log("ShuttleInfoPopup received visible:", visible);

  // Extract nested ternary into a function
  const renderShuttleContent = () => {
    if (shuttleDetails?.error) {
      return (
        <Text style={shuttlePopupStyles.alertText}>{shuttleDetails.error}</Text>
      );
    } else if (shuttleDetails) {
      return (
        <>
          <Text style={shuttlePopupStyles.text}>
            ⏳ Wait Time: {shuttleDetails.waitTime} min
          </Text>
          <Text style={shuttlePopupStyles.text}>
            🚌 Travel Time: {shuttleDetails.shuttleRideTime} min
          </Text>
          <Text style={shuttlePopupStyles.text}>
            ⏱ Total Time: {shuttleDetails.totalTime} min
          </Text>
        </>
      );
    } else {
      return (
        <Text style={shuttlePopupStyles.alertText}>No bus available.</Text>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // Ensures the background is partially see-through
      onRequestClose={onClose} // Handles Android back button
    >
      <View style={shuttlePopupStyles.overlay}>
        <View style={shuttlePopupStyles.popup}>
          <Text style={shuttlePopupStyles.title}>Shuttle Information</Text>

          {renderShuttleContent()}

          {/* Close Button */}
          <TouchableOpacity
            style={shuttlePopupStyles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color="white" />
            <Text style={shuttlePopupStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Add PropTypes validation to address SonarQube warnings
ShuttleInfoPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shuttleDetails: PropTypes.shape({
    error: PropTypes.string,
    waitTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shuttleRideTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

// Set default props to avoid null/undefined issues
ShuttleInfoPopup.defaultProps = {
  shuttleDetails: null,
};
