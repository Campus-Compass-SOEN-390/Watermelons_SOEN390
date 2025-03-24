import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface BuildingPopupProps {
  visible: boolean;
  onClose: () => void;
  building: any | null;
  onGetDirections(building: any): void;
  setAsStartingPoint(building: any): void;
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({
  visible,
  onClose,
  building,
  onGetDirections,
  setAsStartingPoint,
}) => {
  if (!building) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close Icon */}
          <TouchableOpacity
            testID="close-button"
            onPress={onClose}
            style={styles.closeIcon}
          >
            <MaterialIcons name="close" size={20} color="#555" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Building Information</Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.infoSection}>
              {/* Building Name */}
              <Text style={styles.buildingName}>{building.name}</Text>
              <Text style={styles.subName}>{building.longName}</Text>

              {/* Open Hours */}
              <View style={styles.row}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color="#333"
                  style={styles.icon}
                />
                <Text style={styles.text}>
                  {building.openHours || "Hours not available"}
                </Text>
              </View>

              {/* Accessibility */}
              <View style={styles.row}>
                <MaterialIcons
                  name="accessible"
                  size={16}
                  color="#333"
                  style={styles.icon}
                />
                <Text style={styles.text}>
                  <Text style={styles.boldLabel}>Accessibility: </Text>
                  {building.wheelchairAccessible ? "Yes" : "No"}
                </Text>
              </View>

              {/* Departments */}
              <View style={styles.row}>
                <MaterialIcons
                  name="apartment"
                  size={16}
                  color="#333"
                  style={styles.icon}
                />
                <Text style={styles.text} testID="departments-text">
                  <Text style={styles.boldLabel}>Departments: </Text>
                  {Array.isArray(building.departments) && building.departments.length > 0
                    ? building.departments.join(", ")
                    : "No department info"}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.grayButton]}
              onPress={() => {
                setAsStartingPoint(building);
                onClose();
              }}
            >
              <MaterialIcons name="place" size={18} color="white" />
              <Text style={styles.buttonText}>Use as Starting Point</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.redButton]}
              onPress={() => {
                onGetDirections(building);
                onClose();
              }}
            >
              <MaterialIcons name="directions" size={18} color="white" />
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Inline Styles
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
    width: "90%",
    maxHeight: "80%",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: "65%",
  },
  infoSection: {
    gap: 10,
  },
  buildingName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subName: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  icon: {
    marginRight: 6,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  boldLabel: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  redButton: {
    backgroundColor: "#8b0000",
  },
  grayButton: {
    backgroundColor: "#4a4a4a",
  },
  buttonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default BuildingPopup;