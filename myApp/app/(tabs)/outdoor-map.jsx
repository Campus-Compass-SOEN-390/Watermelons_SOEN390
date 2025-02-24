import React, { useState, useRef, useEffect, Fragment } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker, Polygon} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/OutdoorMapStyles";
import { buildings, Campus, getBuildingById } from "../api/buildingData";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import { BuildingPopup } from "../components/BuildingPopUp";
import MapDirections from "../components/MapDirections";

const OutdoorMap = () => {
  // Campus regions
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

  // Start & destination markers
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [travelMode, setTravelMode] = useState('TRANSIT');
  const [renderMap, setRenderMap] = useState(false);

  // Building popup
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // The missing piece: track the building user is inside
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  //Show footer for Go and Steps
  const [showFooter, setShowFooter] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Mapping for StartAndDestinationPoints
  const coordinatesMap = {
    "My Position": location?.latitude
      ? { latitude: location.latitude, longitude: location.longitude }
      : undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
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

  useEffect(() => {
    if (originLocation && destinationLocation) {
      setShowFooter(true);
    }
  }, [originLocation, destinationLocation]);
  // Handle GO button logic 
  const handleGoClick = () => {
    setShowModePopup(true);
  };
  const hanndleStepsClick = () => {
    // Show Steps animate map to destination
    setShowSteps(true);
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

  return (
    <View style={styles.container}>
      <StartAndDestinationPoints
        setOriginLocation={setOriginLocation}
        setDestinationLocation={setDestinationLocation}
        setTravelMode={setTravelMode}
        renderMap={renderMap}
        setRenderMap={setRenderMap}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={activeCampus === "sgw" ? sgwRegion : loyolaRegion}
        showsUserLocation={true}
      >
        { originLocation && destinationLocation && renderMap && <MapDirections
          origin={originLocation}
          destination={destinationLocation}
          mapRef={mapRef}
          travelMode={travelMode}
        />}
        {/* Start Marker */}
        {originLocation &&
          coordinatesMap[originLocation]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[originLocation]}
              title="Origin"
              pinColor="green"
            />
          )}

        {/* Destination Marker */}
        {destinationLocation &&
          coordinatesMap[destinationLocation]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[destinationLocation]}
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
      {/* Footer */
          showFooter && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.footerButton} onPress={handleGoClick}>
                <Text style={styles.footerButtonText}>GO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton} onPress={hanndleStepsClick}>
                <Text style={styles.footerButtonText}>Steps</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Steps Modal */
          showSteps && (
            <Modal visible={showSteps} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Directions</Text>
                  <Text style={styles.modalText}>1. Start from {originLocation?.latitude}, {originLocation?.longitude}</Text>
                  <Text style={styles.modalText}>2. Head towards {destinationLocation?.latitude}, {destinationLocation?.longitude}</Text>
                    {/* More steps would be added here depending on the route logic */}
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseSteps}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}


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

export default OutdoorMap;
