
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons

export interface BuildingPopupProps {
  visible: boolean;
  onClose: () => void;
  building: any | null; // Replace "any" with your Building type if available
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ visible, onClose, building }) => {
  if (!building) return null; // Don't render if no building is selected

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose} // Handles Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Building Information</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.buildingContainer}>
              <Text style={styles.subTitle}>📍 {building.name}</Text>
              <Text style={styles.text}>🏛 {building.longName}</Text>
              <Text style={styles.text}>
                🕒 {building.openHours || "Hours not available"}
              </Text>
              <Text style={styles.text}>
                ♿ Accessibility: {building.wheelchairAccessible ? "✅ Yes" : "❌ No"}
              </Text>
              <Text style={styles.text}>
                🏢 Departments:{" "}
                {building.departments.length > 0 ? building.departments.join(", ") : "No department info"}
              </Text>
            </View>
          </ScrollView>
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => alert("Feature coming soon!")}>
              <MaterialIcons name="directions" size={20} color="white" />
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <MaterialIcons name="close" size={20} color="white" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: 250, // Allow scrolling if content overflows
  },
  buildingContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default BuildingPopup;


