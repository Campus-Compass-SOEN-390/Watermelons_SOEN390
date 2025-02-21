import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons"; // For button icons
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/OutdoorMapStyles";
import { buildings, Campus } from "../api/buildingData";
import BuildingPopup from "./BuildingPopUp";
import { getAllBuildings, getBuildingById } from "../api/buildingData";
import { Building } from "../api/buildingData";

const LoyolaOutdoorMap = () => {
  const { location, errorMsg, hasPermission } = useLocation();
  const mapRef = useRef<MapView | null>(null);
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [highlightedBuilding, setHighlightedBuilding] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // Default region for Loyola Campus
  const loyolaRegion = {
    latitude: 45.4581281,
    longitude: -73.6417009,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Effect to update the locating state
  useEffect(() => {
    if (location) {
      setShowLocating(false);

      // Check if user is inside a building (only consider buildings with valid coordinates)
      for (const building of buildings.filter(
        (b) =>
          b.campus === Campus.LOY &&
          b.coordinates &&
          b.coordinates.length > 0
      )) {
        if (isPointInPolygon(location, building.coordinates!)) {
          setHighlightedBuilding(building.name);
          return;
        }
      }
      setHighlightedBuilding(null);
    }
    if (!hasPermission) {
      setShowPermissionPopup(true);
    }
  }, [location, hasPermission]);

  // Function to center map on user's location
  const centerMapOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  // Function to center map on Loyola Campus
  const centerMapOnLoyola = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(loyolaRegion, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        initialRegion={loyolaRegion}
        showsUserLocation={true}
      >
        {/* Marker for Loyola Campus */}
        <Marker
          coordinate={{
            latitude: 45.4581281,
            longitude: -73.6417009,
          }}
          title="Loyola Campus"
          description="Outdoor Map Location"
        />

        {/* Marker for User Location */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You Are Here"
            pinColor="blue"
          />
        )}

        {/* Render polygons for LOY buildings (only those with defined coordinates) */}
        {buildings
          .filter(
            (building) =>
              building.campus === Campus.LOY &&
              building.coordinates &&
              building.coordinates.length > 0
          )
          .map((building) => (
            <Polygon
              key={building.name}
              coordinates={building.coordinates!}
              fillColor={
                highlightedBuilding === building.name
                  ? "rgba(0, 0, 255, 0.4)"
                  : "rgba(255, 0, 0, 0.4)"
              }
              strokeColor={
                highlightedBuilding === building.name ? "blue" : "red"
              }
              strokeWidth={2}
              tappable
              onPress={() => {
                console.log("Clicked Building:", building);
                const fullBuilding = getBuildingById(building.id);
                if (fullBuilding) {
                  setSelectedBuilding(fullBuilding);
                  setPopupVisible(true);
                } else {
                  console.error("Building data is incomplete!", building);
                }
              }}
            />
          ))}
      </MapView>

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        {/* Button to center on user location */}
        <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
          <MaterialIcons name="my-location" size={24} color="white" />
          {showLocating && <Text style={styles.debugText}>Locating...</Text>}
        </TouchableOpacity>

        {/* Button to center on Loyola Campus */}
        <TouchableOpacity style={styles.button} onPress={centerMapOnLoyola}>
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.debugText}>Loyola</Text>
        </TouchableOpacity>
      </View>

      {/* Building Popup */}
      <BuildingPopup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setSelectedBuilding(null); // Clear selected building when closing
        }}
        building={selectedBuilding}
      />

      {/* Popup Modal for Location Permission Denial */}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Permission Denied</Text>
            <Text style={styles.modalText}>
              Location access is required to show your current location on the
              map. Please enable location permissions in your settings.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPermissionPopup(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoyolaOutdoorMap;

