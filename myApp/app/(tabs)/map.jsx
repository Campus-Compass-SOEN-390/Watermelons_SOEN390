import { Text, TouchableOpacity, View, Modal, Image } from "react-native";
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
import { useIndoorMapContext } from "../context/IndoorMapContext";
import { useNavigation } from "@react-navigation/native";
import { BuildingPopup } from "../components/BuildingPopUp";
import tabStyles from "../styles/LayoutStyles";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import IndoorMap from "../components/IndoorMap/IndoorMap";
import FloorNavigation from "../components/FloorNavigation";
import MapDirections from "../components/MapDirections";
import ShortestPathMap from "../components/IndoorMap/ShortestPathMap";
import h8Coordinates from "../components/IndoorMap/Coordinates/h8coordinates";
import h8Graph from "../components/IndoorMap/Graphs/h8Graph";
import {
  handleIndoorBuildingSelect,
  handleClearIndoorMap,
  calculateCentroid,
  convertCoordinates,
} from "../utils/indoor-map";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";
import { extractShuttleInfo } from "../api/shuttleLiveData";

const MAPBOX_API =
  "sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw";
// const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);
console.log("MAPBOX API KEY:", MAPBOX_API);
console.log("GOOGLE API KEY:", Constants.expoConfig?.extra?.apiKey);

export default function Map() {
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

  //Set Shuttle Live loc
  const [shuttleLocations, setShuttleLocations] = useState([]);

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

  // Track selected floor
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Handles indoor building selection
  const selectIndoorBuilding = (building) => {
    handleIndoorBuildingSelect(
      building,
      selectedIndoorBuilding,
      updateIsExpanded,
      updateSelectedIndoorBuilding,
      setSelectedFloor,
      mapRef
    );
  };

  // Handle clearing indoor mode when "Outdoor" is pressed
  const clearIndoorMap = () => {
    handleClearIndoorMap(
      updateSelectedIndoorBuilding,
      updateIsExpanded,
      mapRef,
      activeCampus,
      setSelectedFloor
    );
  };

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

  //Global constants to manage indoor-maps
  const {
    isExpanded,
    selectedIndoorBuilding,
    updateIsExpanded,
    updateSelectedIndoorBuilding,
  } = useIndoorMapContext();

  // Animate map to correct campus
  useEffect(() => {
    try {
      if (mapRef.current) {
        const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch {
      console.log("Crashed at 1");
    }
  }, [activeCampus]);

  // Check location & highlight building
  useEffect(() => {
    try {
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
    } catch {
      console.log("Crashed at 2");
    }
  }, [location, hasPermission]);

  //This useEffect manages orgin, destination and the footer appearing when any of the dependcies change
  useEffect(() => {
    try {
      updateOrigin(origin, originText);
      updateDestination(destination, destinationText);
      //these two things above are not what is crashing the app
      if (
        originText == "My Location" &&
        (destinationText == "Loyola Campus, Shuttle Stop" ||
          destinationText == "SGW Campus, Shuttle Stop") &&
        renderMap == true
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
    } catch {
      console.log("Crashed 3");
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
    try {
      updateRenderMap(false);
      updateTravelMode("");
    } catch {
      console.log("Crashed 4");
    }
  }, [origin, destination]);

  //navbar
  const navigation = useNavigation();

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
    setActiveCampus((prev) => {
      const newCampus = prev === "sgw" ? "loy" : "sgw";

      if (mapRef.current) {
        const newCenter =
          newCampus === "sgw"
            ? [-73.5792229, 45.4951962]
            : [-73.6417009, 45.4581281];

        mapRef.current.setCamera({
          centerCoordinate: newCenter,
          zoomLevel: 15, // Adjust zoom level as needed
          animationMode: "flyTo",
          animationDuration: 1000,
        });
      }

      return newCampus;
    });
  };

  //fetch shuttle live data
  useEffect(() => {
    const fetchShuttleData = async () => {
      try {
        const shuttleData = await extractShuttleInfo(); // Replace with actual API function
        console.log("Shuttle Data:", shuttleData);
        setShuttleLocations(shuttleData); // Assume this returns an array of {latitude, longitude}
      } catch (error) {
        console.error("Error fetching shuttle data:", error);
      }
    };

    fetchShuttleData();
    //const interval = setInterval(fetchShuttleData, fetchInterval);
  }, []);

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
            ref={mapRef}
            zoomLevel={selectedIndoorBuilding ? 18 : 15} // Adjust zoom based on selection
            centerCoordinate={
              selectedIndoorBuilding
                ? calculateCentroid(
                    convertCoordinates(selectedIndoorBuilding.coordinates)
                  )
                : activeCampus === "sgw"
                ? [-73.5792229, 45.4951962]
                : [-73.6417009, 45.4581281]
            }
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* Conditionally render line displaying shuttle bus travel */}
          {showShuttleRoute && (
            <Mapbox.ShapeSource id="line1" shape={SGWtoLoyola}>
              {/* LineLayer to style the line */}
              <Mapbox.LineLayer
                id="linelayer1"
                style={{
                  lineColor: "#922338",
                  lineWidth: 5,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </Mapbox.ShapeSource>
          )}
          {/* Render Direction Route */}
          {origin && destination && renderMap && (
            <MapDirections
              origin={origin}
              destination={destination}
              mapRef={mapRef}
              travelMode={travelMode}
            />
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
                        coordinates: [convertedCoords],
                      },
                    }}
                    onPress={() => handleBuildingPress(building)}
                  >
                    <Mapbox.FillLayer
                      id={`fill-${building.id}`}
                      style={{ fillColor }}
                      maxZoomLevel={18}
                    />
                    <Mapbox.LineLayer
                      id={`stroke-${building.id}`}
                      style={{
                        lineColor: strokeColor,
                        lineWidth: 3,
                      }}
                      maxZoomLevel={18}
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

          {/* Indoor Map Using Vector Tileset */}
          <IndoorMap
            selectedBuilding={selectedIndoorBuilding} 
            selectedFloor={selectedFloor} 
           />

          {shuttleLocations.map((shuttle) => {
            console.log("Shuttle data:", shuttle.latitude, shuttle.longitude); // Log each shuttle's data to the console

            return (
              <Mapbox.ShapeSource
                key={shuttle.id}
                id={`shuttle-${shuttle.id}`}
                shape={{
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [shuttle.longitude, shuttle.latitude],
                  },
                }}
              >
                <Mapbox.CircleLayer
                  id={`circle-${shuttle.id}`}
                  style={{
                    circleRadius: 6,
                    circleColor: "#ff0000", // Red dot
                    circleOpacity: 0.8,
                    circleStrokeWidth: 1,
                    circleStrokeColor: "#fff",
                  }}
                />
              </Mapbox.ShapeSource>
            );
          })}

          <ShortestPathMap
            graph={h8Graph}
            nodeCoordinates={h8Coordinates}
            startNode={originText}
            endNode={destinationText}
          />
        </Mapbox.MapView>
      </View>

      {/* Floor Navigation Buttons */}
      {selectedIndoorBuilding && (
        <FloorNavigation
          selectedBuilding={selectedIndoorBuilding}
          selectedFloor={selectedFloor}
          onChangeFloor={setSelectedFloor}
        />
      )}

      {/* Buildings Navigation Button */}
      <View
        style={[
          styles.buildingsContainer,
          isExpanded && styles.expandedBuildingsContainer,
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateIsExpanded(!isExpanded)}
          testID="buildings-button"
        >
          {selectedIndoorBuilding ? (
            <Text style={styles.text}>
              {selectedIndoorBuilding.name}
            </Text>
          ) : (
            <MaterialIcons name="location-city" size={24} color="black" />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedButtonsContainer}>
            {/* "None" button to disable the indoor map */}
            <TouchableOpacity
              style={styles.expandedButton}
              onPress={clearIndoorMap}
            >
              <Text style={styles.text}>Outdoor</Text>
            </TouchableOpacity>

            {/* Filtered buildings */}
            {buildings
              .filter(
                (building) =>
                  building.campus.toLowerCase() ===
                    activeCampus.toLowerCase() && building.hasIndoor === true
              )
              .map((building) => (
                <TouchableOpacity
                  key={building.id}
                  style={styles.expandedButton}
                  onPress={() =>
                    handleIndoorBuildingSelect(
                      building,
                      selectedIndoorBuilding,
                      updateIsExpanded,
                      updateSelectedIndoorBuilding,
                      setSelectedFloor,
                      mapRef
                    )
                  }
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
          onPress={toggleCampus}
          style={isExpanded ? styles.disabledButton : null}
        >
          <Text style={styles.text}>Switch Campus</Text>
        </TouchableOpacity>
      </View>

      {/* Switch Campus (Shuttle) Button */}
      <View style={outdoorStyles.shuttleButtonContainer}>
        <TouchableOpacity
          style={outdoorStyles.shuttleButton}
          onPress={handleShuttleButton}
        >
          <Image
            source={require("../../assets/images/icon-for-shuttle.png")}
            resizeMode="contain"
            style={outdoorStyles.shuttleIcon}
          />
          <Text style={outdoorStyles.switchButtonText}>
            {activeCampus === "sgw" ? "Shuttle To Loyola" : "Shuttle To SGW"}
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
            {activeCampus === "sgw" ? "SGW" : "LOY"}
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
