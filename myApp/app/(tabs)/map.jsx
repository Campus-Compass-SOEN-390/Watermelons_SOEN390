import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import styles from "../styles/IndoorMapStyles";
import outdoorStyles from "../styles/OutdoorMapStyles";
import tabStyles from "../styles/LayoutStyles";
import { styles as poiStyles } from "../styles/poiStyles";
import { buildings, getBuildingById } from "../api/buildingData";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import { useLocationContext } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";
import { BuildingPopup } from "../components/BuildingPopUp";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import MapDirections from "../components/MapDirections";
import ShortestPathMap from "../components/IndoorMap/ShortestPathMap";
import { nodeCoordinates } from "../components/IndoorMap/Coordinates/hCoordinates";
import { graph } from "../components/IndoorMap/Graphs/hGraph";
import MapMarkers from "../components/POI/MapMarkers";
import {
  CoffeeMarker,
  RestaurantMarker,
  ActivityMarker,
} from "../components/POI/Markers";
import POIPopup from "../components/POI/POIPopup";
import { fetchPOIData, updatePOICache, getCachedPOIData } from "../api/poiApi";
import { extractShuttleInfo } from "../api/shuttleLiveData";
import FloorNavigation from "../components/FloorNavigation";

// Set Mapbox access token
const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);

// Helper functions
const convertCoordinates = (coords) =>
  coords.map(({ latitude, longitude }) => [longitude, latitude]);

const calculateCentroid = (coordinates) => {
  let x = 0,
    y = 0;
  const n = coordinates.length;
  coordinates.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  return [x / n, y / n]; // [longitude, latitude]
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Campus regions and shuttle routes
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

export default function Map() {
  // Campus switching & map reference
  const [activeCampus, setActiveCampus] = useState("sgw");
  const mapRef = useRef(null);

  // Location and permissions
  const { location, hasPermission } = useLocation();
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);

  // Building popup & highlighted building
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  // Shuttle route and live locations
  const [shuttleRoute, setShuttleRoute] = useState(null);
  const [shuttleLocations, setShuttleLocations] = useState([]);
  const fetchInterval = 30000;

  // Indoor map state and floor selection
  const [showIndoorMap, setShowIndoorMap] = useState(false);
  const [selectedIndoorBuilding, setSelectedIndoorBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // POI related state
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(null);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [poiError, setPoiError] = useState(null);
  const [showPOI, setShowPOI] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const isFetchingRef = useRef(false);
  const activeRequestRef = useRef(null);

  // Global context (for origin, destination, directions, etc.)
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
    showShuttleRoute: showShuttleRouteCtx,
    travelMode,
  } = useLocationContext();

  const navigation = useNavigation();

  // Fetch GeoJSON for indoor map (vector tileset)
  const [geoJsonData, setGeoJsonData] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.mapbox.com/datasets/v1/7anine/cm7qjtnoy2d3o1qmmngcrv0jl/features?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features) {
          setGeoJsonData({
            type: "FeatureCollection",
            features: data.features,
          });
        } else {
          console.error("Invalid GeoJSON format:", data);
        }
      })
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  // Animate map to the correct campus whenever activeCampus changes
  useEffect(() => {
    if (mapRef.current) {
      const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.setCamera({
        centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
        zoomLevel: showIndoorMap ? 18 : 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  }, [activeCampus, showIndoorMap]);

  // Check location permission and highlight building if inside one
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

  // Update origin, destination and adjust footer based on changes
  useEffect(() => {
    updateOrigin(origin, originText);
    updateDestination(destination, destinationText);
    if (
      originText === "My Location" &&
      (destinationText === "Loyola Campus, Shuttle Stop" ||
        destinationText === "SGW Campus, Shuttle Stop")
    ) {
      updateShowShuttleRoute(true);
    } else {
      updateShowShuttleRoute(false);
    }
    if (renderMap === true) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: tabStyles.tabBarStyle });
    }
  }, [
    origin,
    destination,
    activeCampus,
    travelMode,
    popupVisible,
    showShuttleRouteCtx,
  ]);

  // Reset renderMap and travelMode when origin or destination change
  useEffect(() => {
    updateRenderMap(false);
    updateTravelMode("");
  }, [origin, destination]);

  // Fetch shuttle live data every 30 seconds
  useEffect(() => {
    const fetchShuttleData = async () => {
      try {
        const shuttleData = await extractShuttleInfo();
        setShuttleLocations(shuttleData);
      } catch (error) {
        console.error("Error fetching shuttle data:", error);
      }
    };
    fetchShuttleData();
    const interval = setInterval(fetchShuttleData, fetchInterval);
    return () => clearInterval(interval);
  }, []);

  // POI: Load cached data if available
  useEffect(() => {
    if (!showPOI) return;
    const cachedData = getCachedPOIData();
    if (
      cachedData.coffeeShops.length > 0 ||
      cachedData.restaurants.length > 0 ||
      cachedData.activities.length > 0
    ) {
      setCoffeeShops(cachedData.coffeeShops);
      setRestaurants(cachedData.restaurants);
      setActivities(cachedData.activities);
      if (cachedData.lastRegion) {
        setLastFetchedRegion(cachedData.lastRegion);
      }
      const now = Date.now();
      if (
        now - cachedData.lastFetchTime > 10 * 60 * 1000 &&
        location &&
        region
      ) {
        handleFetchPlaces();
      } else {
        console.log("Using cached POI data");
      }
    }
  }, [showPOI]);

  // POI: Show update button when region has shifted
  useEffect(() => {
    if (!lastFetchedRegion || !region || !showPOI) return;
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(latDiff > 0.005 || lngDiff > 0.005);
  }, [region, lastFetchedRegion, showPOI]);

  // POI: Initial data fetch if needed
  useEffect(() => {
    if (!showPOI) return;
    const shouldFetch =
      location &&
      region &&
      !isFetchingRef.current &&
      coffeeShops.length === 0 &&
      restaurants.length === 0 &&
      activities.length === 0;
    if (shouldFetch) {
      console.log("Initial POI data fetch triggered");
      handleFetchPlaces();
    }
  }, [
    location,
    coffeeShops.length,
    restaurants.length,
    activities.length,
    showPOI,
    region,
  ]);

  // Cleanup active POI request on unmount
  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  // POI: Fetch places from API
  const handleFetchPlaces = async (currentRegion = region) => {
    if (!currentRegion || isFetchingRef.current) {
      console.log("Fetch already in progress or no region provided, skipping");
      return;
    }
    setPoiError(null);
    setLoading(true);
    isFetchingRef.current = true;
    const controller = new AbortController();
    activeRequestRef.current = controller;
    try {
      const { coffee, resto, act } = await fetchPOIData(
        currentRegion,
        controller.signal
      );
      setCoffeeShops(coffee);
      setRestaurants(resto);
      setActivities(act);
      updatePOICache(coffee, resto, act, currentRegion);
      setLastFetchedRegion(currentRegion);
      setShowUpdateButton(false);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching POIs:", error);
        setPoiError("Failed to load points of interest. Please try again.");
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      activeRequestRef.current = null;
    }
  };

  // POI: Update region when map view changes
  const handleRegionChange = useCallback((feature) => {
    if (!feature || !feature.properties) return;
    try {
      const { visibleBounds } = feature.properties;
      if (!visibleBounds || visibleBounds.length < 2) return;
      const centerLng = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
      const centerLat = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;
      if (isNaN(centerLat) || isNaN(centerLng)) return;
      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      console.log("Map region updated:", newRegion);
    } catch (error) {
      console.error("Error in handleRegionChange:", error);
    }
  }, []);

  // Coordinates map for fixed locations
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

  // Building tap – open popup with details
  const handleBuildingPress = (building) => {
    const fullBuilding = getBuildingById(building.id);
    if (fullBuilding) {
      setSelectedBuilding(fullBuilding);
      setPopupVisible(true);
    } else {
      console.error("Building data is incomplete!", building);
    }
  };

  // Building "Get Directions" – set destination in context
  const handleBuildingGetDirections = (building) => {
    updateOrigin(coordinatesMap["My Position"], "My Location");
    const buildingFullName = building.name + ", " + building.longName;
    updateDestination(building.entranceCoordinates, buildingFullName);
    updateShowTransportation(true);
  };

  // Shuttle button – set route and update destination accordingly
  const handleShuttleButton = () => {
    const route =
      activeCampus === "sgw" ? campusRoutes.sgwToLoyola : campusRoutes.loyolaToSgw;
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
  };

  // Center map on campus
  const centerMapOnCampus = () => {
    if (mapRef.current) {
      const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.setCamera({
        centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  };

  // Center map on user
  const centerMapOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 17,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
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
          zoomLevel: 15,
          animationMode: "flyTo",
          animationDuration: 1000,
        });
      }
      return newCampus;
    });
  };

  // Toggle POI display
  const togglePOI = () => {
    setShowPOI((prev) => !prev);
    if (!showPOI && region) {
      handleFetchPlaces();
    }
  };

  // Indoor building selection – set indoor mode and move camera
  const handleIndoorBuildingSelect = (building) => {
    const buildingCenter = calculateCentroid(
      convertCoordinates(building.coordinates)
    );
    if (selectedIndoorBuilding?.id === building.id) {
      // If reselecting the same building, recenter the camera
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    } else {
      setShowIndoorMap(true);
      setSelectedIndoorBuilding(building);
      setIsExpanded(false);
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  };

  // Clear indoor mode – go back to outdoor view
  const handleClearIndoorMap = () => {
    setShowIndoorMap(false);
    setSelectedIndoorBuilding(null);
    setIsExpanded(false);
    const campusCenter =
      activeCampus === "sgw"
        ? [-73.5792229, 45.4951962]
        : [-73.6417009, 45.4581281];
    mapRef.current?.setCamera({
      centerCoordinate: campusCenter,
      zoomLevel: 15,
      animationMode: "flyTo",
      animationDuration: 1000,
    });
  };

  // POI: Calculate distance between two coordinates (in meters)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000;
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

  // POI: Filter and sort points based on distance and selected filters
  const filteredPoints = useMemo(() => {
    if (!location || !showPOI) return [];
    const sortedPoints = [...coffeeShops, ...restaurants, ...activities].sort(
      (a, b) => {
        const aLat = a.geometry?.location?.lat;
        const aLng = a.geometry?.location?.lng;
        const bLat = b.geometry?.location?.lat;
        const bLng = b.geometry?.location?.lng;
        const aDistance =
          aLat && aLng
            ? calculateDistance(location.latitude, location.longitude, aLat, aLng)
            : Infinity;
        const bDistance =
          bLat && bLng
            ? calculateDistance(location.latitude, location.longitude, bLat, bLng)
            : Infinity;
        return aDistance - bDistance;
      }
    );
    return sortedPoints.filter((point) => {
      const lat = point.geometry?.location?.lat;
      const lng = point.geometry?.location?.lng;
      if (!lat || !lng) return false;
      const d = calculateDistance(location.latitude, location.longitude, lat, lng);
      if (d > distance * 1000) return false;
      const types = point.types || [];
      const name = point.name.toLowerCase();
      const isCafe =
        showCafes &&
        (types.includes("cafe") ||
          name.includes("coffee") ||
          types.includes("bakery"));
      const isRestaurant =
        showRestaurants &&
        (types.includes("restaurant") ||
          types.includes("meal_takeaway") ||
          types.includes("meal_delivery"));
      const isActivity =
        showActivities &&
        (types.includes("tourist_attraction") ||
          types.includes("movie_theater") ||
          types.includes("amusement_park") ||
          types.includes("museum") ||
          name.includes("tourist") ||
          name.includes("bowling") ||
          name.includes("cinema") ||
          name.includes("theater") ||
          name.includes("museum") ||
          name.includes("attraction"));
      return isCafe || isRestaurant || isActivity;
    });
  }, [
    coffeeShops,
    restaurants,
    activities,
    location,
    distance,
    showCafes,
    showRestaurants,
    showActivities,
    showPOI,
  ]);

  // POI: Handle marker press
  const handlePOIPress = (poi) => {
    setSelectedPOI(selectedPOI?.place_id === poi.place_id ? null : poi);
  };

  // POI: Get distance from user to the POI
  const getDistanceToPOI = (poi) => {
    if (!location || !poi?.geometry?.location) return null;
    const lat1 = location.latitude;
    const lon1 = location.longitude;
    const lat2 = poi.geometry.location.lat;
    const lon2 = poi.geometry.location.lng;
    return calculateDistance(lat1, lon1, lat2, lon2);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StartAndDestinationPoints />
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Light}
          onRegionDidChange={(feature) => handleRegionChange(feature)}
        >
          <Mapbox.Camera
            ref={mapRef}
            zoomLevel={selectedIndoorBuilding ? 18 : 15}
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

          {/* Shuttle Route Polyline */}
          {showShuttleRouteCtx && shuttleRoute && (
            <Mapbox.ShapeSource
              id="shuttle-route"
              shape={{
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: shuttleRoute.map((coord) => [
                    coord.longitude,
                    coord.latitude,
                  ]),
                },
              }}
            >
              <Mapbox.LineLayer
                id="shuttle-line"
                style={{
                  lineColor: "blue",
                  lineWidth: 5,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {/* Render Directions Route */}
          {origin && destination && renderMap && (
            <MapDirections
              origin={origin}
              destination={destination}
              mapRef={mapRef}
              travelMode={travelMode}
            />
          )}

          {/* Outdoor Mode: Render building polygons if not in indoor mode */}
          {!showIndoorMap &&
            buildings
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
                      />
                      <Mapbox.LineLayer
                        id={`stroke-${building.id}`}
                        style={{ lineColor: strokeColor, lineWidth: 3 }}
                      />
                    </Mapbox.ShapeSource>
                    <Mapbox.PointAnnotation
                      id={`label-${building.id}`}
                      coordinate={centroid}
                      anchor={{ x: 0.5, y: 0.5 }}
                      onSelected={() => handleBuildingPress(building)}
                    >
                      <View style={styles.annotationContainer}>
                        <Text style={styles.annotationText}>{building.name}</Text>
                      </View>
                    </Mapbox.PointAnnotation>
                  </Fragment>
                );
              })}

          {/* Indoor Mode: Render GeoJSON-based indoor map */}
          {showIndoorMap &&
            geoJsonData?.type === "FeatureCollection" && (
              <Mapbox.ShapeSource id="indoor-geojson" shape={geoJsonData}>
                <Mapbox.FillLayer
                  id="rooms-fill"
                  style={{ fillColor: "red", fillOpacity: 0.2 }}
                  filter={["==", ["geometry-type"], "Polygon"]}
                />
                <Mapbox.LineLayer
                  id="rooms-stroke"
                  style={{ lineColor: "red", lineWidth: 2 }}
                  filter={["==", ["geometry-type"], "Polygon"]}
                />
                <Mapbox.LineLayer
                  id="walls-stroke"
                  style={{ lineColor: "red", lineWidth: 2 }}
                  filter={["==", ["get", "type"], "Walls"]}
                />
                <Mapbox.LineLayer
                  id="paths"
                  style={{ lineColor: "black", lineWidth: 2 }}
                  filter={["==", ["get", "type"], "Paths"]}
                />
                <Mapbox.SymbolLayer
                  id="labels"
                  style={{
                    textField: ["get", "name"],
                    textSize: 14,
                    textColor: "black",
                  }}
                  filter={["==", ["geometry-type"], "Point"]}
                />
              </Mapbox.ShapeSource>
            )}

          {/* POI Markers */}
          {showPOI && (
            <>
              {showCafes && coffeeShops.length > 0 && (
                <MapMarkers
                  data={coffeeShops}
                  MarkerComponent={CoffeeMarker}
                  onMarkerPress={handlePOIPress}
                />
              )}
              {showRestaurants && restaurants.length > 0 && (
                <MapMarkers
                  data={restaurants}
                  MarkerComponent={RestaurantMarker}
                  onMarkerPress={handlePOIPress}
                />
              )}
              {showActivities && activities.length > 0 && (
                <MapMarkers
                  data={activities}
                  MarkerComponent={ActivityMarker}
                  onMarkerPress={handlePOIPress}
                />
              )}
            </>
          )}

          {/* Shortest Path Map (for indoor navigation) */}
          <ShortestPathMap
            graph={graph}
            nodeCoordinates={nodeCoordinates}
            startNode={originText}
            endNode={destinationText}
            currentFloor={selectedFloor}
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
          onPress={() => setIsExpanded(!isExpanded)}
          testID="buildings-button"
        >
          {selectedIndoorBuilding ? (
            <Text style={styles.text}>{selectedIndoorBuilding.name}</Text>
          ) : (
            <MaterialIcons name="location-city" size={24} color="black" />
          )}
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedButtonsContainer}>
            {/* "None" button to disable indoor mode */}
            <TouchableOpacity
              style={styles.expandedButton}
              onPress={handleClearIndoorMap}
            >
              <Text style={styles.text}>Outdoor</Text>
            </TouchableOpacity>
            {/* List filtered buildings */}
            {buildings
              .filter(
                (building) =>
                  building.campus.toLowerCase() === activeCampus.toLowerCase() &&
                  building.hasIndoor === true
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
            {activeCampus === "sgw"
              ? "Shuttle To Loyola"
              : "Shuttle To SGW"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Position Buttons */}
      <View style={styles.positionButtonsContainer}>
        <TouchableOpacity
          style={styles.positionButton}
          onPress={centerMapOnUser}
          testID="locate-me-button"
        >
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.positionButton}
          onPress={centerMapOnCampus}
          testID="locate-campus-button"
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text style={styles.campusButtonText}>
            {activeCampus === "sgw" ? "SGW" : "LOY"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floor Navigation (Alternate UI) */}
      <View style={styles.floorButtonContainer}>
        <TouchableOpacity style={styles.button} testID="floor-up">
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.text}>1</Text>
        <TouchableOpacity style={styles.button} testID="floor-down">
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* POI Filter Button */}
      {showPOI && (
        <TouchableOpacity
          style={outdoorStyles.actionButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* POI Loading Indicator */}
      {loading && (
        <View style={outdoorStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}

      {/* POI Update Button */}
      {showUpdateButton && showPOI && (
        <TouchableOpacity
          style={poiStyles.updateButtonContainer}
          onPress={() => handleFetchPlaces(region)}
        >
          <Text style={poiStyles.updateButtonText}>Update POIs</Text>
        </TouchableOpacity>
      )}

      {/* Floating Button for POI Toggle */}
      <View style={outdoorStyles.buttonContainer}>
        <TouchableOpacity style={outdoorStyles.button} onPress={togglePOI}>
          <MaterialIcons
            name={showPOI ? "local-dining" : "restaurant"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Location Permission Modal */}
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

      {/* POI Popup */}
      {selectedPOI && (
        <View
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 999,
          }}
          pointerEvents="box-none"
        >
          <View pointerEvents="auto">
            <POIPopup
              poi={selectedPOI}
              distance={getDistanceToPOI(selectedPOI)}
              onClose={() => setSelectedPOI(null)}
              onGetDirections={() => {
                console.log(
                  `Get directions for: ${selectedPOI.vicinity || "unknown"}`
                );
                setSelectedPOI(null);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
