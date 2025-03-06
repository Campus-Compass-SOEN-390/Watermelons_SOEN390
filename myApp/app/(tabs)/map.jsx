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
import { useNavigation } from "@react-navigation/native";
import { BuildingPopup } from "../components/BuildingPopUp";
import tabStyles from "../styles/LayoutStyles";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import MapDirections from "../components/MapDirections";

const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);
console.log("MAPBOX API KEY:", MAPBOX_API);
console.log("GOOGLE API KEY:", Constants.expoConfig?.extra?.apiKey);

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

export default function Map() {
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

  // Indoor map status
  const [selectedIndoorBuilding, setSelectedIndoorBuilding] = useState(null);

  const handleIndoorBuildingSelect = (building) => {
    const buildingCenter = calculateCentroid(
      convertCoordinates(building.coordinates)
    );

    if (selectedIndoorBuilding?.id === building.id) {
      // If the same building is reselected, recenter the camera
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18, // Ensure zoom level is high enough for indoor map
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    } else {
      // Select new building and activate indoor map
      setSelectedIndoorBuilding(building);
      setIsExpanded(false);

      // Move camera to the selected building
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  };

  // Handle clearing indoor mode
  const handleClearIndoorMap = () => {
    setSelectedIndoorBuilding(null);
    setIsExpanded(false);

    // Reset camera to the default campus view
    mapRef.current?.setCamera({
      centerCoordinate:
        activeCampus === "sgw"
          ? [-73.5792229, 45.4951962]
          : [-73.6417009, 45.4581281],
      zoomLevel: 15,
      animationMode: "flyTo",
      animationDuration: 1000,
    });
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
      if (
        originText == "My Location" &&
        (destinationText == "Loyola Campus, Shuttle Stop" ||
          destinationText == "SGW Campus, Shuttle Stop")
          && renderMap == true
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

  //Coordinates for shuttle from SGW to Loyola. Need to be updated with proper coordinates. Also, need to add ones for loyola to SGW.
  //Note that here for mapbox it is longitude first, and the latitude. So, the reverse of google maps
  const SGWtoLoyola = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.57849, 45.49706],
        [-73.5793, 45.49604], 
        [-73.57934, 45.49579],
        [-73.5817, 45.49357],
        [-73.577, 45.48973],
        [-73.62401, 45.46161],
        [-73.62888, 45.46374],
        [-73.63882, 45.45789],
      ]
    },
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
          <Mapbox.VectorSource
            id="indoor-map"
            url="mapbox://7anine.cm7qjtnoy2d3o1qmmngcrv0jl-6thbv"
          >
            <Mapbox.FillLayer
              id="room-fill-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18}
              style={{
                fillColor: "red",
                fillOpacity: 0.2,
              }}
              filter={["==", ["geometry-type"], "Polygon"]}
            />

            <Mapbox.LineLayer
              id="room-line-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18}
              style={{
                lineColor: "red",
                lineWidth: 2,
                lineOpacity: 1.0,
              }}
              filter={["==", ["geometry-type"], "Polygon"]}
            />

            <Mapbox.LineLayer
              id="path-line-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18}
              style={{
                lineColor: "black",
                lineWidth: 2,
                lineOpacity: 1.0,
              }}
              filter={["==", ["get", "type"], "Paths"]}
            />

            <Mapbox.LineLayer
              id="wall-line-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18}
              style={{
                lineColor: "red",
                lineWidth: 2,
                lineOpacity: 1.0,
              }}
              filter={["==", ["get", "type"], "Walls"]}
            />

            <Mapbox.SymbolLayer
              id="points-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18} 
              style={{
                iconImage: "marker", 
                iconSize: 1.0,
                iconAllowOverlap: true, 
              }}
              filter={["==", ["geometry-type"], "Point"]} 
            />

            <Mapbox.SymbolLayer
              id="text-layer"
              sourceID="indoor-map"
              sourceLayerID="h8"
              minZoomLevel={18} 
              style={{
                textField: ["get", "name"], 
                textSize: 14,
                textColor: "black",
                textHaloColor: "white",
                textHaloWidth: 1,
                textAllowOverlap: true, 
              }}
              filter={["==", ["geometry-type"], "Point"]} 
            />
          </Mapbox.VectorSource>
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
            {/* "None" button to disable the indoor map */}
            <TouchableOpacity
              style={styles.expandedButton}
              onPress={handleClearIndoorMap}
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
                  onPress={() => handleIndoorBuildingSelect(building)}
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