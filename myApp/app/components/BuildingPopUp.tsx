
import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import { buildingPopupStyles as styles } from "../styles/BuildingPopupStyles"  

export interface BuildingPopupProps {
  visible: boolean;
  onClose: () => void;
  building: any | null; // Replace "any" with your Building type if available
  onGetDirections(building: any): void
  useAsStartingPoint(building: any): void
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ visible, onClose, building, onGetDirections, useAsStartingPoint }) => {
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
            <TouchableOpacity style={[styles.button, styles.directionButton]} 
            onPress={() => {
            onGetDirections(building);
            onClose();
            }
            }>
              <MaterialIcons name="directions" size={20} color="white" />
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.startPointButton]} 
            onPress={() => {
            useAsStartingPoint(building);
            onClose();
            }
            }>
              <MaterialIcons name="place" size={20} color="white" />
              <Text style={styles.buttonText}>Use As Starting Point</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.buttonContainer}>
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

export default BuildingPopup;