import React, {
  useState,
  useRef,
  useEffect,
  Fragment,
  useMemo,
  useCallback,
} from "react";
import { View, TouchableOpacity, Text, Modal, ActivityIndicator, ScrollView, Switch } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/UnifiedMapStyles"; // Make sure this file exists
import { buildings, Campus, getBuildingById } from "../api/buildingData";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import { BuildingPopup } from "../components/BuildingPopUp";
import MapDirections from "../components/MapDirections";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import MapContainer from "../components/maps/MapContainer";
import CampusOverlay from "../components/maps/CampusOverlay";
import POIOverlay from "../components/maps/POIOverlay";
import PermissionModal from "../components/maps/PermissionModal";

// API key for Google Places
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const InterestPointsScreen = () => {
  // Get route params
  const { mode = "poi", campus = "sgw" } = useLocalSearchParams();

  // Shared state
  const mapRef = useRef(null);
  const { location, hasPermission } = useLocation();
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [showLocating, setShowLocating] = useState(true);
  const [region, setRegion] = useState({
    latitude: campus === "sgw" ? 45.4951962 : 45.4581281,
    longitude: campus === "sgw" ? -73.5792229 : -73.6417009,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // Update location status when available
  useEffect(() => {
    if (location) {
      setShowLocating(false);
    }

    if (!hasPermission) {
      setShowPermissionPopup(true);
    }
  }, [location, hasPermission]);

  return (
    <View style={styles.container}>
      {/* Map Container with appropriate overlay based on mode */}
      <MapContainer
        mapRef={mapRef}
        region={region}
        setRegion={setRegion}
        showLocating={showLocating}
      >
        {/* Conditionally render the appropriate overlay */}
        {mode === "campus" ? (
          <CampusOverlay mapRef={mapRef} initialCampus={campus} location={location} />
        ) : (
          <POIOverlay mapRef={mapRef} location={location} region={region} setRegion={setRegion} />
        )}
      </MapContainer>

      {/* Permission Modal */}
      <PermissionModal
        visible={showPermissionPopup}
        onClose={() => setShowPermissionPopup(false)}
      />
    </View>
  );
};

export default InterestPointsScreen;
