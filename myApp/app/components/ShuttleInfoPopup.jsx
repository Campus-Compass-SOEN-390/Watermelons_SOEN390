import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { shuttlePopupStyles as styles } from "../styles/shuttlePopupStyles"; // ✅ Corrected Import

const ShuttleInfoPopup = ({ visible, onClose, shuttleTime, nextShuttle }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose} // Close when clicking outside (Android back button)
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>🚍 Shuttle Information</Text>

          {nextShuttle !== "No buses available" ? (
            <>
              <Text style={styles.text}>⏳ Next Shuttle: {nextShuttle}</Text>
              <Text style={styles.text}>🚌 Estimated Travel Time: {shuttleTime} min</Text>
            </>
          ) : (
            <Text style={styles.alertText}>❌ No shuttle available at this time.</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ShuttleInfoPopup;
