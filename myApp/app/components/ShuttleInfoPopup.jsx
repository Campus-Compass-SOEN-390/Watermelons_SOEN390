import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatTime } from "../utils/shuttleUtils.js";

export default function ShuttleInfoPopup({ visible, onClose, shuttleDetails }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close icon */}
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <MaterialIcons name="close" size={22} color="#555" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Shuttle Information</Text>

          {/* Center Bus Icon */}
          <View style={styles.iconCenter}>
            <MaterialIcons name="directions-bus" size={36} color="#000" />
          </View>

          {/* Shuttle Details */}
          {shuttleDetails?.error ? (
            <Text style={styles.alertText}>{shuttleDetails.error}</Text>
          ) : shuttleDetails ? (
            <>
              <View style={styles.row}>
                <MaterialIcons name="schedule" size={18} style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.boldLabel}>Wait Time:</Text>{" "}
                  {formatTime(shuttleDetails.waitTime)}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="commute" size={18} style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.boldLabel}>Travel Time:</Text>{" "}
                  {formatTime(shuttleDetails.shuttleRideTime)}
                </Text>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="timer" size={18} style={styles.icon} />
                <Text style={styles.text}>
                  <Text style={styles.boldLabel}>Total Time:</Text>{" "}
                  {formatTime(shuttleDetails.totalTime)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.alertText}>No bus available.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

// Inline styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxWidth: 360,
    elevation: 6,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  iconCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  boldLabel: {
    fontWeight: "bold",
  },
  alertText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});