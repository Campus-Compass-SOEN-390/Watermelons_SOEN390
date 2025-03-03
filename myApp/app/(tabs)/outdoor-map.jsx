import React, { useState, useRef, useEffect, Fragment } from "react";
import { View, TouchableOpacity, Text, Modal, Image } from "react-native";
import MapView, { Marker, Polygon, Polyline} from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/OutdoorMapStyles";
import { buildings, Campus, getBuildingById } from "../api/buildingData";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import { BuildingPopup } from "../components/BuildingPopUp";
import MapDirections from "../components/MapDirections";
import { useLocationContext } from '../context/LocationContext';
import { useNavigation } from "@react-navigation/native";
import tabStyles from "../styles/LayoutStyles";

const OutdoorMap = () => {

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

  // Campus switching
  const [activeCampus, setActiveCampus] = useState("sgw");
  const mapRef = useRef(null);

  // Location & permissions
  const { location, hasPermission } = useLocation();
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);

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
    travelMode } = useLocationContext();

  const coordinatesMap = {
    "My Position": location?.latitude
      ? { latitude: location.latitude, longitude: location.longitude }
      : undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
    "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849},
    "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
    "EV Building": { latitude: 45.4957, longitude: -73.5773 },
    "SGW Campus": { latitude: 45.4962, longitude: -73.5780 },
    "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
    "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
  };

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
      updateOrigin(origin, originText);
      updateDestination(destination, destinationText);
      if(originText == "My Location" && (destinationText == "Loyola Campus, Shuttle Stop" || destinationText == "SGW Campus, Shuttle Stop")){
        updateShowShuttleRoute(true);
      }
      else{
        updateShowShuttleRoute(false);
      }
      if (renderMap == true){
        navigation.setOptions({
          tabBarStyle: { display: "none" },
        });
      }
      if (renderMap == false){
        navigation.setOptions({
          tabBarStyle: tabStyles.tabBarStyle,
        });
      }
    }, [origin, destination, activeCampus, travelMode, popupVisible, showShuttleRoute])

  //This useEffect ensures the map is no longer rendered and the travel mode is set back to nothing when origin or location changes
  useEffect(() => {
    updateRenderMap(false);
    updateTravelMode("");
  }, [origin, destination])

  // Handle GO button logic 
  const handleGoClick = () => {
    alert("Journey started!");
  };
  const hanndleStepsClick = () => {
    // Show Steps animate map to destination
    setShowSteps(true);
  };
  const handleAddFavorite = () => {
    // Add favorite logic
  };
  //Close Steps Modal
  const handleCloseSteps = () => {
    setShowSteps(false);
  };

  // Center on user
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

  // Center on campus
  const centerMapOnCampus = () => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  // Coordinates of routes for the navigation shuttle
  const campusRoutes = {
    sgwToLoyola: [
      { latitude: 45.49706, longitude: -73.57849},
      { latitude: 45.49604, longitude: -73.5793},
      { latitude: 45.49579, longitude:-73.57934},
      { latitude: 45.49357, longitude: -73.5817 },
      { latitude: 45.48973, longitude: -73.577 },
      { latitude: 45.46161, longitude: -73.62401 },
      { latitude: 45.46374, longitude: -73.62888 },
    ],
    loyolaToSgw: [
      { latitude: 45.49706, longitude: -73.57849},
      { latitude: 45.49604, longitude: -73.5793},
      { latitude: 45.49579, longitude:-73.57934},
      { latitude: 45.49357, longitude: -73.5817 },
      { latitude: 45.48973, longitude: -73.577 },
      { latitude: 45.46161, longitude: -73.62401 },
      { latitude: 45.46374, longitude: -73.62888 },
    ]
  };

  // Switch campus
  const toggleCampus = () => {
    setActiveCampus((prev) => (prev === "sgw" ? "loyola" : "sgw"));
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
    const buildingFullName = building.name + ", " + building.longName
    console.log(buildingFullName);
    updateDestination(building.entranceCoordinates, buildingFullName);
    updateShowTransportation(true);
  }

  const handleShuttleButton  = () => {
    console.log("Shuttle button click");
    const route = activeCampus === "sgw" ? campusRoutes.sgwToLoyola : campusRoutes.loyolaToSgw;
    updateOrigin(coordinatesMap["My Position"], "My Location")
    if (activeCampus === "sgw"){
      updateDestination(coordinatesMap["Loyola Campus, Shuttle Stop"], "Loyola Campus, Shuttle Stop");
    }
    else {
      updateDestination(coordinatesMap["SGW Campus, Shuttle Stop"], "SGW Campus, Shuttle Stop");
    }
    setShuttleRoute(route);
    mapRef.current.fitToCoordinates(route, {
    edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    animated: true,
  });
  }

  return (
    <View style={styles.container}>
      <StartAndDestinationPoints/>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={activeCampus === "sgw" ? sgwRegion : loyolaRegion}
        showsUserLocation={true}
      >
        { origin && destination && renderMap && <MapDirections
          origin={origin}
          destination={destination}
          mapRef={mapRef}
          travelMode={travelMode}
        />}
        {/* Start Marker */}
        {origin &&
          coordinatesMap[origin]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[origin]}
              title="Origin"
              pinColor="green"
            />
          )}

        {/* Destination Marker */}
        {destination &&
          coordinatesMap[destination]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[destination]}
              title="Destination"
              pinColor="red"
            />
          )}

        {/* Campus center marker */}
        <Marker
          coordinate={
            activeCampus === "sgw"
              ? { latitude: sgwRegion.latitude, longitude: sgwRegion.longitude }
              : { latitude: loyolaRegion.latitude, longitude: loyolaRegion.longitude }
          }
          title={activeCampus === "sgw" ? "SGW Campus" : "Loyola Campus"}
          description="Campus Center"
        />

        {/* User location marker */}
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

        {/* Render building polygons for active campus */}
        {buildings
          .filter(
            (b) =>
              b.campus === (activeCampus === "sgw" ? Campus.SGW : Campus.LOY) &&
              b.coordinates &&
              b.coordinates.length > 0
          )
          .map((building) => {
            const center = building.coordinates[0];
            return (
              <Fragment key={building.id}>
                <Polygon
                  coordinates={building.coordinates}
                  fillColor={
                    highlightedBuilding === building.name
                      ? "rgba(0, 0, 255, 0.4)"
                      : "rgba(255, 0, 0, 0.4)"
                  }
                  strokeColor={
                    highlightedBuilding === building.name ? "blue" : "red"
                  }
                  strokeWidth={5}
                  tappable
                  onPress={() => handleBuildingPress(building)}
                />
                {/* Invisible Marker fallback */}
                <Marker
                  coordinate={center}
                  opacity={0}
                  onPress={() => handleBuildingPress(building)}
                />
              </Fragment>
            );
          })}
        { showShuttleRoute &&(
        <Polyline
          coordinates={shuttleRoute}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={['#7F0000']}
          strokeWidth={6}
        />
      )}
      </MapView>

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
          <MaterialIcons name="my-location" size={24} color="white" />
          {showLocating && <Text style={styles.debugText}>Locating...</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
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

      {/* Switch Campus (Shuttle) Button */}
      <View style={styles.shuttleButtonContainer}>
        <TouchableOpacity 
          style={styles.shuttleButton}
          onPress={handleShuttleButton} 
        >
          <Image
            source={require('../../assets/images/icon-for-shuttle.png')}
            resizeMode="contain"
            style={styles.shuttleIcon}
          />
          <Text style={styles.switchButtonText}>
            {activeCampus === "sgw" ? "Shuttle To Loyola" : "Shuttle To SGW"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Permission Denial */}
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
        onGetDirections={handleBuildingGetDirections}
      />
    </View>
  );
};

export default OutdoorMap;
