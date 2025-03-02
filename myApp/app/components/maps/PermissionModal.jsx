import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from "../../styles/UnifiedMapStyles";

const PermissionModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Location Permission Denied</Text>
          <Text style={styles.modalText}>
            Location access is required to show your current location on the map.
            Please enable location permissions in your settings.
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PermissionModal;