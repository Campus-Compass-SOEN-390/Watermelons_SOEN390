import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker, Polygon} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/OutdoorMapStyles";
import { buildings } from "../utils/mapUtils";
import StartAndDestinationPoints from '../components/StartAndDestinationPoints';
import Constants from 'expo-constants';
import MapDirections from '../components/MapDirections';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Accessing the API key from the Expo configuration

const OutdoorMap = () => {
  // Define the two campus regions.
  const sgwRegion = {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const loyolaRegion = {
    latitude: 45.4581281,
    longitude: -73.6417009,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Track the currently active campus ("sgw" or "loyola").
  const [activeCampus, setActiveCampus] = useState("sgw");
  const mapRef = useRef(null);

  // Get the user's location and permission status.
  const { location, hasPermission } = useLocation();
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [travelMode, setTravelMode] = useState('TRANSIT');

  const coordinatesMap = {
    "My Position": location && location.latitude ? { latitude: location.latitude, longitude: location.longitude } : undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
    "EV Building": { latitude: 45.4957, longitude: -73.5773 },
    "SGW Campus": { latitude: 45.4962, longitude: -73.5780 },
    "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
    "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
};

  // When the active campus changes, animate the map to the appropriate region.
  useEffect(() => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [activeCampus]);

  // Update location-related states and check for building highlighting.
  useEffect(() => {
    if (location) {
      setShowLocating(false);
      let found = false;
      for (const building of buildings) {
        if (isPointInPolygon(location, building.coordinates)) {
          setHighlightedBuilding(building.name);
          found = true;
          break;
        }
      }
      if (!found) {
        setHighlightedBuilding(null);
      }
    }
    if (!hasPermission) {
      setShowPermissionPopup(true);
    }
  }, [location, hasPermission]);

  // Function to center the map on the user's current location.
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

  //Function to center the directions on the map
  const edgePaddingValue = 10;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue
  }
  const centerRoute = () => {
    if (routeVisible && originLocation && destinationLocation){
      mapRef.current.fitToCoordinates([originLocation, destinationLocation], {edgePadding})
    }
  }

  // Toggle the active campus.
  const toggleCampus = () => {
    setActiveCampus((prev) => (prev === "sgw" ? "loyola" : "sgw"));
  };

  return (
    <View style={styles.container}>
      < StartAndDestinationPoints setOriginLocation={setOriginLocation} 
                                  setDestinationLocation={setDestinationLocation}
                                  setTravelMode={setTravelMode}/>
      <MapView
        ref={mapRef}
        style={styles.map}
        // Use the active campus’ region as the initial region.
        initialRegion={activeCampus === "sgw" ? sgwRegion : loyolaRegion}
        showsUserLocation={true}
      >
        { originLocation && destinationLocation && <MapDirections
          origin={originLocation}
          destination={destinationLocation}
          mapRef={mapRef}
          travelMode={travelMode}
        />}
        {/* Add start marker when location is selected */}

        {originLocation && coordinatesMap[originLocation] && coordinatesMap[originLocation].latitude !== undefined &&(
          <Marker 
            coordinate={coordinatesMap[originLocation]}
            title="Origin"
            pinColor="green"
          />
        )}

        {/* Add start marker when location is selected */}

        {destinationLocation && coordinatesMap[destinationLocation] && coordinatesMap[destinationLocation].latitude !== undefined &&(
          <Marker 
            coordinate={coordinatesMap[destinationLocation]}
            title="Destination"
            pinColor="red"
          />
        )}
        {/* Optional campus marker showing the active campus center */}
        <Marker
          coordinate={
            activeCampus === "sgw"
              ? { latitude: sgwRegion.latitude, longitude: sgwRegion.longitude }
              : { latitude: loyolaRegion.latitude, longitude: loyolaRegion.longitude }
          }
          title={activeCampus === "sgw" ? "SGW Campus" : "Loyola Campus"}
          description="Campus Center"
        />

        {/* Marker for the user's location */}
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

        {/* Render all building polygons. If the user is inside one, highlight it. */}
        {buildings.map((building) => (
          <Polygon
            key={building.name}
            coordinates={building.coordinates}
            fillColor={
              highlightedBuilding === building.name
                ? "rgba(0, 0, 255, 0.4)"
                : "rgba(255, 0, 0, 0.4)"
            }
            strokeColor={highlightedBuilding === building.name ? "blue" : "red"}
            strokeWidth={2}
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

        {/* Button to re-center on the active campus */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
            if (mapRef.current) {
              mapRef.current.animateToRegion(region, 1000);
            }
          }}
        >
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.debugText}>
            {activeCampus === "sgw" ? "SGW" : "Loyola"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Switch Campus Button */}
      <View style={styles.switchButtonContainer}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCampus}>
          <Text style={styles.switchButtonText}>Switch Campus</Text>
        </TouchableOpacity>
      </View>
    
      {/* Modal for Location Permission Denial */}
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
    </View>
  );
};

export default OutdoorMap;
