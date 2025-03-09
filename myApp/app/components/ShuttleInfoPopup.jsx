import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { shuttlePopupStyles } from "../styles/shuttlePopupStyles";

export default function ShuttleInfoPopup({ visible, onClose, shuttleDetails }) {
  console.log("ShuttleInfoPopup received visible:", visible);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}  // Ensures the background is partially see-through
      onRequestClose={onClose} // Handles Android back button
    >
      <View style={shuttlePopupStyles.overlay}>
        <View style={shuttlePopupStyles.popup}>
          <Text style={shuttlePopupStyles.title}>Shuttle Information</Text>

          {/* If there's an error property, display that */}
          {shuttleDetails?.error ? (
            <Text style={shuttlePopupStyles.alertText}>
              {shuttleDetails.error}
            </Text>
          ) : shuttleDetails ? (
            /* If we have valid shuttle details (waitTime, travelTime, etc.) */
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
          ) : (
            /* Fallback if shuttleDetails is null or undefined */
            <Text style={shuttlePopupStyles.alertText}>No bus available.</Text>
          )}

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
