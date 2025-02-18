import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/OutdoorMapStyles";
import { buildings, Campus, getBuildingById, Building } from "../api/buildingData";
import { BuildingPopup } from "../components/BuildingPopUp";

const SGWOutdoorMap = () => {
  const { location, hasPermission } = useLocation();
  const mapRef = useRef<MapView | null>(null);
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [highlightedBuilding, setHighlightedBuilding] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // Default region for SGW Campus
  const campusRegion = {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  useEffect(() => {
    if (location) {
      setShowLocating(false);
      // Check if user is inside a building (only consider buildings with defined coordinates)
      for (const building of buildings.filter(
        (b) =>
          b.campus === Campus.SGW &&
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

  // Function to center map on SGW Campus
  const centerMapOnCampus = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(campusRegion, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        initialRegion={campusRegion}
        showsUserLocation={true}
      >
        {/* Marker for SGW Campus */}
        <Marker
          coordinate={{
            latitude: campusRegion.latitude,
            longitude: campusRegion.longitude,
          }}
          title="SGW Campus"
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

        {/* Render polygons for SGW buildings with an onPress event */}
        {buildings
          .filter(
            (building) =>
              building.campus === Campus.SGW &&
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
        <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
          <MaterialIcons name="my-location" size={24} color="white" />
          {showLocating && <Text style={styles.debugText}>Locating...</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.debugText}>SGW</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Modal for Location Permission Denial */}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Permission Denied</Text>
            <Text style={styles.modalText}>
              Location access is required to show your current location on the map.
              Please enable location permissions in your settings.
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

      {/* Building Popup */}
      <BuildingPopup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setSelectedBuilding(null);
        }}
        building={selectedBuilding}
      />
    </View>
  );
};

export default SGWOutdoorMap;
