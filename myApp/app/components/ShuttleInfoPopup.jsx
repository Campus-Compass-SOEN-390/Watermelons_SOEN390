import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { formatTime } from "../utils/shuttleUtils.js";
import styles from "../styles/PopUpStyles.js";

export default function ShuttleInfoPopup({ visible, onClose, shuttleDetails }) {
  // Extracted function to render shuttle details
  const renderShuttleDetails = () => {
    if (shuttleDetails?.error) {
      return <Text style={styles.alertText}>{shuttleDetails.error}</Text>;
    } else if (shuttleDetails) {
      return (
        <>
          <View style={styles.row}>
            <MaterialIcons name="schedule" size={18} style={styles.icon} />
            <Text style={styles.text}>
              <Text style={styles.boldLabel}>Wait Time: </Text>
              {formatTime(shuttleDetails.waitTime)}
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="commute" size={18} style={styles.icon} />
            <Text style={styles.text}>
              <Text style={styles.boldLabel}>Travel Time: </Text>
              {formatTime(shuttleDetails.shuttleRideTime)}
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="timer" size={18} style={styles.icon} />
            <Text style={styles.text}>
              <Text style={styles.boldLabel}>Total Time: </Text>
              {formatTime(shuttleDetails.totalTime)}
            </Text>
          </View>
        </>
      );
    } else {
      return <Text style={styles.alertText}>No bus available.</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close Icon */}
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <MaterialIcons name="close" size={22} color="#555" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Shuttle Information</Text>

          {/* Bus Icon */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <MaterialIcons name="directions-bus" size={36} color="#000" />
          </View>

          {/* Render Shuttle Details */}
          {renderShuttleDetails()}
        </View>
      </View>
    </Modal>
  );
}

ShuttleInfoPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shuttleDetails: PropTypes.shape({
    waitTime: PropTypes.number,
    shuttleRideTime: PropTypes.number,
    totalTime: PropTypes.number,
    error: PropTypes.string,
  }),
};
