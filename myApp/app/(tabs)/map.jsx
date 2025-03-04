import { Text, TouchableOpacity, View, Modal } from "react-native";
import React, { useState, useRef, Fragment, useEffect } from "react";
import styles from "../styles/IndoorMapStyles";
import outdoorStyles from "../styles/OutdoorMapStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import { buildings, getBuildingById } from "../api/buildingData";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import { useLocationContext } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";
import { BuildingPopup } from "../components/BuildingPopUp";
import tabStyles from "../styles/LayoutStyles";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import MapDirections from "../components/MapDirections";

const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);
console.log("MAPBOX API KEY:", MAPBOX_API);

// Converts building.coordinates [{latitude, longitude}, ...] to [[lng, lat], ...]
const convertCoordinates = (coords) =>
  coords.map(({ latitude, longitude }) => [longitude, latitude]);

// Function to calculate the centroid of a polygon
const calculateCentroid = (coordinates) => {
  let x = 0,
    y = 0,
    n = coordinates.length;

  coordinates.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });

  return [x / n, y / n]; // Returns [longitude, latitude]
};

export default function IndoorMap() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Campus switching
  const [activeCampus, setActiveCampus] = useState("sgw");
  const mapRef = useRef(null);

  // Location & permissions
  const { location, hasPermission } = useLocation();
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(
    !hasPermission
  );

  // Building popup
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // The missing piece: track the building user is inside
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  //Statues for displaying shuttle polylines or not
  const [shuttleRoute, setShuttleRoute] = useState("");

  //Global constants to manage components used on outdoor maps page
  const {
    updateOrigin,
    updateDestination,
    updateShowTransportation,
    updateRenderMap,
    updateTravelMode,
    updateShowShuttleRoute,
    origin,
    destination,
    originText,
    destinationText,
    showTransportation,
    renderMap,
    showShuttleRoute,
    travelMode,
  } = useLocationContext();

  // Animate map to correct campus
  useEffect(() => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [activeCampus]);

  // Check location & highlight building
  useEffect(() => {
    if (location) {
      setShowLocating(false);
      let found = false;
      for (const building of buildings.filter(
        (b) => b.coordinates && b.coordinates.length > 0
      )) {
        if (isPointInPolygon(location, building.coordinates)) {
          setHighlightedBuilding(building.name);
          found = true;
          break;
        }
      }
      if (!found) setHighlightedBuilding(null);
    }
    if (!hasPermission) {
      setShowPermissionPopup(true);
    }
  }, [location, hasPermission]);

  //This useEffect manages orgin, destination and the footer appearing when any of the dependcies change
  useEffect(() => {
    console.log("Went thru here");
    updateOrigin(origin, originText);
    updateDestination(destination, destinationText);
    if (
      originText == "My Location" &&
      (destinationText == "Loyola Campus, Shuttle Stop" ||
        destinationText == "SGW Campus, Shuttle Stop")
    ) {
      updateShowShuttleRoute(true);
    } else {
      updateShowShuttleRoute(false);
    }
    if (renderMap == true) {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
      });
    }
    if (renderMap == false) {
      navigation.setOptions({
        tabBarStyle: tabStyles.tabBarStyle,
      });
    }
  }, [
    origin,
    destination,
    activeCampus,
    travelMode,
    popupVisible,
    showShuttleRoute,
  ]);

  //This useEffect ensures the map is no longer rendered and the travel mode is set back to nothing when origin or location changes
  useEffect(() => {
    updateRenderMap(false);
    updateTravelMode("");
  }, [origin, destination]);

  //navbar
  const navigation = useNavigation();

  //Campus regions
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

  // Coordinates of routes for the navigation shuttle
  const campusRoutes = {
    sgwToLoyola: [
      { latitude: 45.49706, longitude: -73.57849 },
      { latitude: 45.49604, longitude: -73.5793 },
      { latitude: 45.49579, longitude: -73.57934 },
      { latitude: 45.49357, longitude: -73.5817 },
      { latitude: 45.48973, longitude: -73.577 },
      { latitude: 45.46161, longitude: -73.62401 },
      { latitude: 45.46374, longitude: -73.62888 },
    ],
    loyolaToSgw: [
      { latitude: 45.49706, longitude: -73.57849 },
      { latitude: 45.49604, longitude: -73.5793 },
      { latitude: 45.49579, longitude: -73.57934 },
      { latitude: 45.49357, longitude: -73.5817 },
      { latitude: 45.48973, longitude: -73.577 },
      { latitude: 45.46161, longitude: -73.62401 },
      { latitude: 45.46374, longitude: -73.62888 },
    ],
  };

  const coordinatesMap = {
    "My Position": location?.latitude
      ? { latitude: location.latitude, longitude: location.longitude }
      : undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
    "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849 },
    "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
    "EV Building": { latitude: 45.4957, longitude: -73.5773 },
    "SGW Campus": { latitude: 45.4962, longitude: -73.578 },
    "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
    "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
  };

  // Handle building tap
  const handleBuildingPress = (building) => {
    console.log("Polygon pressed for building:", building.name);
    const fullBuilding = getBuildingById(building.id);
    if (fullBuilding) {
      console.log("Setting popup for building:", fullBuilding.name);
      setSelectedBuilding(fullBuilding);
      setPopupVisible(true);
    } else {
      console.error("Building data is incomplete!", building);
    }
  };

  const handleBuildingGetDirections = (building) => {
    updateOrigin(coordinatesMap["My Position"], "My Location");
    const buildingFullName = building.name + ", " + building.longName;
    console.log(buildingFullName);
    updateDestination(building.entranceCoordinates, buildingFullName);
    updateShowTransportation(true);
  };

  const handleShuttleButton = () => {
    console.log("Shuttle button click");
    const route =
      activeCampus === "sgw"
        ? campusRoutes.sgwToLoyola
        : campusRoutes.loyolaToSgw;
    updateOrigin(coordinatesMap["My Position"], "My Location");
    if (activeCampus === "sgw") {
      updateDestination(
        coordinatesMap["Loyola Campus, Shuttle Stop"],
        "Loyola Campus, Shuttle Stop"
      );
    } else {
      updateDestination(
        coordinatesMap["SGW Campus, Shuttle Stop"],
        "SGW Campus, Shuttle Stop"
      );
    }
    setShuttleRoute(route);
    mapRef.current.fitToCoordinates(route, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  };

  // Center on campus
  const centerMapOnCampus = () => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  // Center on campus
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

  // Switch campus
  const toggleCampus = () => {
    setActiveCampus((prev) => (prev === "sgw" ? "loyola" : "sgw"));
  };

  // Determine the current center based on active campus
  const currentCenter =
    activeCampus === "sgw"
      ? [-73.5792229, 45.4951962]
      : [-73.6417009, 45.4581281];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StartAndDestinationPoints />
        <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Light}>
          <Mapbox.Camera
            zoomLevel={15}
            centerCoordinate={currentCenter}
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* Render Direction Route */}
          {origin && destination && (
            <MapDirections origin={origin} destination={destination} mapRef={mapRef} travelMode="driving" />
          )}

          {/* Render building polygons */}
          {buildings
            .filter((b) => b.coordinates && b.coordinates.length > 0)
            .map((building) => {
              const convertedCoords = convertCoordinates(building.coordinates);
              const centroid = calculateCentroid(convertedCoords);
              const fillColor =
                highlightedBuilding === building.name
                  ? "rgba(0, 0, 255, 0.4)"
                  : "rgba(255, 0, 0, 0.4)";
              const strokeColor =
                highlightedBuilding === building.name ? "blue" : "red";

              return (
                <Fragment key={building.id}>
                  {/* Building Polygon */}
                  <Mapbox.ShapeSource
                    id={`building-${building.id}`}
                    shape={{
                      type: "Feature",
                      geometry: {
                        type: "Polygon",
                        coordinates: [convertedCoords], // Corrected format for Mapbox
                      },
                    }}
                    onPress={() => handleBuildingPress(building)}
                  >
                    <Mapbox.FillLayer
                      id={`fill-${building.id}`}
                      style={{ fillColor }}
                    />
                    <Mapbox.LineLayer
                      id={`stroke-${building.id}`}
                      style={{
                        lineColor: strokeColor,
                        lineWidth: 3,
                      }}
                    />
                  </Mapbox.ShapeSource>

                  {/* Invisible Tappable Marker at Centroid */}
                  <Mapbox.PointAnnotation
                    id={`label-${building.id}`}
                    coordinate={centroid}
                    anchor={{ x: 0.5, y: 0.5 }} // Center the text
                    onSelected={() => handleBuildingPress(building)}
                  >
                    <View style={styles.annotationContainer}>
                      <Text style={styles.annotationText}>{building.name}</Text>
                    </View>
                  </Mapbox.PointAnnotation>
                </Fragment>
              );
            })}
        </Mapbox.MapView>
      </View>

      {/* Floor Navigation Buttons */}
      <View style={styles.floorButtonContainer}>
        <TouchableOpacity style={styles.button} testID="floor-up">
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.text}>1</Text>
        <TouchableOpacity style={styles.button} testID="floor-down">
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Buildings Navigation Button */}
      <View
        style={[
          styles.buildingsContainer,
          isExpanded && styles.expandedBuildingsContainer,
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsExpanded(!isExpanded)}
          testID="buildings-button"
        >
          <MaterialIcons name="location-city" size={24} color="black" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedButtonsContainer}>
            {buildings.map((building) => (
              <TouchableOpacity
                key={building.id}
                style={styles.expandedButton}
                onPress={() => handleBuildingPress(building)}
              >
                <Text style={styles.text}>{building.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Switch Campus Button */}
      <View style={styles.switchCampusButton}>
        <TouchableOpacity
          disabled={isExpanded}
          style={isExpanded ? styles.disabledButton : null}
        >
          <Text style={styles.text} onPress={toggleCampus}>
            Switch Campus
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Buttons */}
      <View style={outdoorStyles.buttonContainer}>
        <TouchableOpacity
          style={outdoorStyles.button}
          onPress={centerMapOnUser}
        >
          <MaterialIcons name="my-location" size={24} color="white" />
          {showLocating && (
            <Text style={outdoorStyles.debugText}>Locating...</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={outdoorStyles.button}
          onPress={centerMapOnCampus}
        >
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={outdoorStyles.debugText}>
            {activeCampus === "sgw" ? "SGW" : "Loyola"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Permission Denial */}
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

      {/* Building Popup */}
      <BuildingPopup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setSelectedBuilding(null);
        }}
        building={selectedBuilding}
        onGetDirections={handleBuildingGetDirections}
      />
    </View>
  );
}
