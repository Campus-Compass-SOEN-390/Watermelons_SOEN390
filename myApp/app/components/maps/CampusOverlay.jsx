import React, { useState, useRef, useEffect, Fragment } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import MapView, { Marker, Polygon, Callout, Polyline } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import { buildings, Campus, getBuildingById } from "../../api/buildingData";
import StartAndDestinationPoints from "../StartAndDestinationPoints";
import { BuildingPopup } from "../BuildingPopUp";
import MapDirections from "../MapDirections";
import Constants from "expo-constants";
import styles from "../../styles/UnifiedMapStyles";
import tabStyles from "../../styles/LayoutStyles";
import { useNavigation } from "@react-navigation/native";
import { useLocationContext } from "../../context/LocationContext";
import useLocation from "../../hooks/useLocation";

// API key for Google Places
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Custom marker components
const CoffeeMarker = () => (
  <View style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="coffee" size={24} color="black" />
  </View>
);

const RestaurantMarker = () => (
  <View style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons
      name="silverware-fork-knife"
      size={24}
      color="orange"
    />
  </View>
);

const ActivityMarker = () => (
  <View style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="run" size={20} color="green" />
  </View>
);

// Custom callout component with a fixed button
const POICallout = ({
  poi,
  location,
  calculateDistance,
  formatDistance,
  onDirectionsPress,
}) => {
  const lat = poi.geometry?.location?.lat;
  const lng = poi.geometry?.location?.lng;

  const handlePress = () => {
    onDirectionsPress(poi);
  };

  return (
    <View
      style={{
        width: 200,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{poi.name}</Text>
      {location && lat && lng && (
        <Text style={{ marginBottom: 10 }}>
          Distance:{" "}
          {formatDistance(
            calculateDistance(location.latitude, location.longitude, lat, lng)
          )}
        </Text>
      )}
      <TouchableOpacity
        style={{ backgroundColor: "#922338", padding: 8, borderRadius: 5 }}
        onPress={handlePress}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Get Directions
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CampusOverlay = ({ mapRef, initialCampus }) => {
  // Navigation & Location Context integration
  const navigation = useNavigation();
  const {
    origin,
    destination,
    travelMode,
    renderMap,
    updateOrigin,
    updateDestination,
    updateTravelMode,
    updateRenderMap,
    updateShowTransportation,
    updateShowShuttleRoute,
    showShuttleRoute,
  } = useLocationContext();

  // Custom location hook (which also provides permission info)
  const { location, hasPermission } = useLocation();
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);

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

  // Local state for campus, zoom level, shuttle route, etc.
  const [activeCampus, setActiveCampus] = useState(initialCampus || "sgw");
  const [currentZoomLevel, setCurrentZoomLevel] = useState({
    latitudeDelta:
      activeCampus === "sgw" ? sgwRegion.latitudeDelta : loyolaRegion.latitudeDelta,
    longitudeDelta:
      activeCampus === "sgw" ? sgwRegion.longitudeDelta : loyolaRegion.longitudeDelta,
  });
  const [shuttleRoute, setShuttleRoute] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  // POI state
  const [showPOIs, setShowPOIs] = useState(false);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Coordinates mapping (now includes shuttle stops)
  const coordinatesMap = {
    "My Position": location?.latitude
      ? { latitude: location.latitude, longitude: location.longitude }
      : undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
    "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849 },
    "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
    "EV Building": { latitude: 45.4957, longitude: -73.5773 },
    "SGW Campus": { latitude: 45.4962, longitude: -73.5780 },
    "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
    "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
  };

  // Effect: Highlight the building if the user's location is within one
  useEffect(() => {
    if (location) {
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
  }, [location]);

  // Effect: Animate map when switching campus
  useEffect(() => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      setCurrentZoomLevel({
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [activeCampus, mapRef]);

  // Effect: Update navigation options based on renderMap flag
  useEffect(() => {
    if (renderMap) {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: tabStyles.tabBarStyle,
      });
    }
  }, [renderMap, navigation]);

  // Effect: Show permission popup if location access is denied
  useEffect(() => {
    if (!hasPermission) {
      setShowPermissionPopup(true);
    } else {
      setShowPermissionPopup(false);
    }
  }, [hasPermission]);

  // Center map on campus
  const centerMapOnCampus = () => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  // Center map on user's current location
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

  // Switch campus (toggle between SGW and Loyola)
  const toggleCampus = () => {
    setActiveCampus((prev) => (prev === "sgw" ? "loyola" : "sgw"));
  };

  // Handle building tap: show popup with building details
  const handleBuildingPress = (building) => {
    const fullBuilding = getBuildingById(building.id);
    if (fullBuilding) {
      setSelectedBuilding(fullBuilding);
      setPopupVisible(true);
    }
  };

  // Calculate distance (in meters) between two geographic points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters.
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Format distance for display
  const formatDistance = (d) => {
    if (d > 1000) {
      return (d / 1000).toFixed(2) + " km";
    }
    return Math.round(d) + " m";
  };

  // Fetch POIs using Google Places
  const fetchPOIs = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=1000&keyword=coffee|restaurant|tourist|bowling|cinema|theater|gold&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const allResults = data.results;

      const coffee = [];
      const resto = [];
      const act = [];
      allResults.forEach((place) => {
        const name = place.name.toLowerCase();
        const types = place.types || [];
        if (types.includes("restaurant")) {
          resto.push(place);
        } else if (types.includes("cafe") || name.includes("coffee")) {
          coffee.push(place);
        } else if (
          name.includes("tourist") ||
          name.includes("bowling") ||
          name.includes("cinema") ||
          name.includes("theater") ||
          name.includes("gold")
        ) {
          act.push(place);
        }
      });

      setCoffeeShops(coffee);
      setRestaurants(resto);
      setActivities(act);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    setLoading(false);
  };

  // Toggle display of POIs and adjust zoom accordingly
  const togglePOIs = async () => {
    const newShowPOIs = !showPOIs;
    setShowPOIs(newShowPOIs);

    if (newShowPOIs) {
      if (coffeeShops.length === 0) {
        await fetchPOIs();
      }
      if (mapRef.current) {
        try {
          const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
          // Zoom out: 2x wider view
          mapRef.current.animateToRegion(
            {
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
              latitudeDelta: currentRegion.latitudeDelta * 2,
              longitudeDelta: currentRegion.longitudeDelta * 2,
            },
            300
          );
        } catch (error) {
          console.error("Error zooming out:", error);
        }
      }
    } else {
      if (mapRef.current) {
        try {
          const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
          mapRef.current.animateToRegion(
            {
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
              latitudeDelta: currentZoomLevel.latitudeDelta,
              longitudeDelta: currentZoomLevel.longitudeDelta,
            },
            300
          );
        } catch (error) {
          console.error("Error zooming in:", error);
        }
      }
    }
  };

  // Get directions to a POI using the location context
  const getDirectionsToPOI = (poi) => {
    const lat = poi.geometry?.location?.lat;
    const lng = poi.geometry?.location?.lng;
    if (lat && lng) {
      console.log("Getting directions to:", poi.name, "at", {
        latitude: lat,
        longitude: lng,
      });
      updateOrigin(coordinatesMap["My Position"], "My Position");
      updateDestination({ latitude: lat, longitude: lng }, poi.name);
      updateRenderMap(true);
    }
  };

  // Shuttle routes for navigation between campuses
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

  // Shuttle button handler: set origin/destination and update route polyline
  const handleShuttleButton = () => {
    const route =
      activeCampus === "sgw" ? campusRoutes.sgwToLoyola : campusRoutes.loyolaToSgw;
    updateOrigin(coordinatesMap["My Position"], "My Position");
    if (activeCampus === "sgw") {
      updateDestination(coordinatesMap["Loyola Campus, Shuttle Stop"], "Loyola Campus, Shuttle Stop");
    } else {
      updateDestination(coordinatesMap["SGW Campus, Shuttle Stop"], "SGW Campus, Shuttle Stop");
    }
    setShuttleRoute(route);
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(route, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  // Callback for the BuildingPopup “Get Directions” button
  const handleBuildingGetDirections = (building) => {
    updateOrigin(coordinatesMap["My Position"], "My Position");
    const buildingFullName = building.name + ", " + building.longName;
    updateDestination(building.entranceCoordinates, buildingFullName);
    updateShowTransportation(true);
  };

  // --- New Footer Button Handlers ---

  const handleGoClick = () => {
    alert("Journey started!");
    // Optionally, you might want to hide the footer after starting the journey.
  };

  const handleStepsClick = () => {
    // This could show a modal or navigate to a steps view.
    alert("Showing steps...");
  };

  const handleAddFavorite = () => {
    // Your favorite-adding logic here.
    alert("Added to favorites!");
    // After adding, revert back to the regular view:
    updateRenderMap(false);
    updateTravelMode("");
  };

  const handleBack = () => {
    // Simply return to the regular map view.
    updateRenderMap(false);
    updateTravelMode("");
  };

  return (
    <>
      {/* Route Planning UI */}
      <StartAndDestinationPoints />

      {/* Map Directions */}
      {origin && destination && renderMap && (
        <MapDirections
          origin={origin}
          destination={destination}
          mapRef={mapRef}
          travelMode={travelMode}
        />
      )}

      {/* Origin & Destination Markers */}
      {origin && coordinatesMap[origin]?.latitude !== undefined && (
        <Marker coordinate={coordinatesMap[origin]} title="Origin" pinColor="green" />
      )}
      {destination &&
        typeof destination === "string" &&
        coordinatesMap[destination]?.latitude !== undefined && (
          <Marker coordinate={coordinatesMap[destination]} title="Destination" pinColor="red" />
        )}
      {destination &&
        typeof destination === "object" &&
        "latitude" in destination && (
          <Marker coordinate={destination} title="Destination" pinColor="red" />
        )}

      {/* Campus Center Marker */}
      <Marker
        coordinate={
          activeCampus === "sgw"
            ? { latitude: sgwRegion.latitude, longitude: sgwRegion.longitude }
            : { latitude: loyolaRegion.latitude, longitude: loyolaRegion.longitude }
        }
        title={activeCampus === "sgw" ? "SGW Campus" : "Loyola Campus"}
        description="Campus Center"
      />

      {/* Building Polygons */}
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
                strokeColor={highlightedBuilding === building.name ? "blue" : "red"}
                strokeWidth={5}
                tappable
                onPress={() => handleBuildingPress(building)}
              />
              <Marker
                coordinate={center}
                opacity={0}
                onPress={() => handleBuildingPress(building)}
              />
            </Fragment>
          );
        })}

      {/* POI Markers */}
      {showPOIs && (
        <>
          {coffeeShops.map((shop) => {
            const lat = shop.geometry?.location?.lat;
            const lng = shop.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={shop.place_id} coordinate={{ latitude: lat, longitude: lng }} title={shop.name}>
                <CoffeeMarker />
                <Callout tooltip>
                  <POICallout
                    poi={shop}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}

          {restaurants.map((restaurant) => {
            const lat = restaurant.geometry?.location?.lat;
            const lng = restaurant.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={restaurant.place_id} coordinate={{ latitude: lat, longitude: lng }} title={restaurant.name}>
                <RestaurantMarker />
                <Callout tooltip>
                  <POICallout
                    poi={restaurant}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}

          {activities.map((act) => {
            const lat = act.geometry?.location?.lat;
            const lng = act.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={act.place_id} coordinate={{ latitude: lat, longitude: lng }} title={act.name}>
                <ActivityMarker />
                <Callout tooltip>
                  <POICallout
                    poi={act}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}
        </>
      )}

      {/* Shuttle Route Polyline */}
      {shuttleRoute.length > 0 && (
        <Polyline coordinates={shuttleRoute} strokeColor="#000" strokeWidth={6} />
      )}

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
          <MaterialIcons name="my-location" size={24} color="white" />
          <Text style={styles.debugText}>Locating...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.debugText}>{activeCampus === "sgw" ? "SGW" : "Loyola"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={togglePOIs}>
          <MaterialIcons name={showPOIs ? "not-interested" : "stars"} size={24} color="white" />
          <Text style={styles.debugText}>{showPOIs ? "Hide POIs" : "Show POIs"}</Text>
        </TouchableOpacity>
      </View>

      {/* Shuttle Button */}
      <View style={styles.shuttleButtonContainer}>
        <TouchableOpacity style={styles.shuttleButton} onPress={handleShuttleButton}>
          <Image
            source={require("../../../assets/images/icon-for-shuttle.png")}
            resizeMode="contain"
            style={styles.shuttleIcon}
          />
          <Text style={styles.switchButtonText}>
            {activeCampus === "sgw" ? "Shuttle To Loyola" : "Shuttle To SGW"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campus Switcher */}
      <View style={styles.switchButtonContainer}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCampus}>
          <Text style={styles.switchButtonText}>Switch Campus</Text>
        </TouchableOpacity>
      </View>

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

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}

      {/* Location Permission Modal */}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Permission Denied</Text>
            <Text style={styles.modalText}>
              Location access is required to show your current location on the map.
              Please enable location permissions in your settings.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPermissionPopup(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CampusOverlay;
