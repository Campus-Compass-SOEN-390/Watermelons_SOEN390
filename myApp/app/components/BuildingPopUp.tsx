import React, { useContext } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import createPopupStyles from "../styles/PopUpStyles";
import { ThemeContext } from "../context/ThemeContext";

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
  // Use the theme context
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Create theme-aware styles
  const popupStyles = createPopupStyles({ theme, isDarkMode });

  if (!building) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={popupStyles.overlay}>
        <View style={popupStyles.popup}>
          {/* Close Icon */}
          <TouchableOpacity
            testID="close-button"
            onPress={onClose}
            style={popupStyles.closeIcon}
          >
            <MaterialIcons
              name="close"
              size={20}
              color={isDarkMode ? theme.text : "#555"}
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={popupStyles.title}>Building Information</Text>

          <ScrollView style={popupStyles.scrollView}>
            <View style={popupStyles.infoSection}>
              {/* Building Name */}
              <Text style={popupStyles.buildingName}>{building.name}</Text>
              <Text style={popupStyles.subName}>{building.longName}</Text>

              {/* Open Hours */}
              <View style={popupStyles.row}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  style={popupStyles.icon}
                />
                <Text style={popupStyles.text}>
                  {building.openHours || "Hours not available"}
                </Text>
              </View>

              {/* Accessibility */}
              <View style={popupStyles.row}>
                <MaterialIcons
                  name="accessible"
                  size={16}
                  style={popupStyles.icon}
                />
                <Text style={popupStyles.text}>
                  <Text style={popupStyles.boldLabel}>Accessibility: </Text>
                  {building.wheelchairAccessible ? "Yes" : "No"}
                </Text>
              </View>

              {/* Departments (fixed layout) */}
              <View style={popupStyles.row}>
                <MaterialIcons
                  name="apartment"
                  size={16}
                  style={popupStyles.icon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={popupStyles.text} testID="departments-text">
                    <Text style={popupStyles.boldLabel}>Departments: </Text>
                    {Array.isArray(building.departments) &&
                    building.departments.length > 0
                      ? building.departments.join(", ")
                      : "No department info"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={popupStyles.buttonRow}>
            <TouchableOpacity
              style={[popupStyles.button, popupStyles.grayButton]}
              onPress={() => {
                setAsStartingPoint(building);
                onClose();
              }}
            >
              <MaterialIcons name="place" size={18} color="white" />
              <Text style={popupStyles.buttonText}>Use as Starting Point</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[popupStyles.button, popupStyles.redButton]}
              onPress={() => {
                onGetDirections(building);
                onClose();
              }}
            >
              <MaterialIcons name="directions" size={18} color="white" />
              <Text style={popupStyles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuildingPopup;
