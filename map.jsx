import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
// Import POI related components
import MapMarkers from "../components/POI/MapMarkers";
import FilterModal from "../components/POI/FilterModal";
import {
  CoffeeMarker,
  RestaurantMarker,
  ActivityMarker,
} from "../components/POI/Markers";
import POIPopup from "../components/POI/POIPopup"; // Import the new component
import { fetchPOIData, updatePOICache, getCachedPOIData } from "../api/poiApi";
import { styles as poiStyles } from "../styles/poiStyles";

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

// Constants for POI functionality
const REGION_CHANGE_THRESHOLD = 0.005;

export default function IndoorMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Campus switching
  const [activeCampus, setActiveCampus] = useState("sgw");
  const mapRef = useRef(null);

  // Location & permissions
  const { location, hasPermission } = useLocation();
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] =
    useState(!hasPermission);

  // Building popup
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // The missing piece: track the building user is inside
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  //Statues for displaying shuttle polylines or not
  const [shuttleRoute, setShuttleRoute] = useState("");

  // Indoor map status
  const [showIndoorMap, setShowIndoorMap] = useState(false);
  const [selectedIndoorBuilding, setSelectedIndoorBuilding] = useState(null);

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

  // Add state for selected POI
  const [selectedPOI, setSelectedPOI] = useState(null);

  const isFetchingRef = useRef(false);
  const activeRequestRef = useRef(null);

  const handleIndoorBuildingSelect = (building) => {
    const buildingCenter = calculateCentroid(
      convertCoordinates(building.coordinates),
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
      setShowIndoorMap(true);
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
    setShowIndoorMap(false);
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

  // Fetch GeoJSON
  useEffect(() => {
    fetch(
      `https://api.mapbox.com/datasets/v1/7anine/cm7qjtnoy2d3o1qmmngcrv0jl/features?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched GeoJSON Data:", JSON.stringify(data, null, 2));
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

  // Animate map to correct campus
  useEffect(() => {
    try {
      if (mapRef.current) {
        const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
        if (!region) {
          setRegion(currentRegion);
        }
        mapRef.current.setCamera({
          centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
          zoomLevel: 15,
          animationMode: "flyTo",
          animationDuration: 1000,
        });
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
          (b) => b.coordinates && b.coordinates.length > 0,
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

  // POI distance calculation function
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Load cached POI data on mount if available
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
        console.log("Cache is stale, fetching new POI data");
        handleFetchPlaces();
      } else {
        console.log("Using cached POI data");
      }
    }
  }, [showPOI]);

  // Show update button when region has shifted
  useEffect(() => {
    if (!lastFetchedRegion || !region || !showPOI) return;
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(
      latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD,
    );
  }, [region, lastFetchedRegion, showPOI]);

  // Initial fetch if no data is loaded
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
      console.log("Initial data fetch triggered");
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

  // Cleanup active requests on unmount
  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

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
        controller.signal,
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
        console.error("Error fetching places:", error);
        setPoiError("Failed to load points of interest. Please try again.");
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      activeRequestRef.current = null;
    }
  };

  // Add a tracking flag to prevent duplicate region change events
  const isRegionChangingRef = useRef(false);

  // Fix the handleRegionChange function to properly handle the Mapbox event object
  const handleRegionChange = useCallback((feature) => {
    if (isRegionChangingRef.current || !feature || !feature.properties) return;

    try {
      // Get the center coordinates from the visibleBounds property
      const { visibleBounds } = feature.properties;
      if (!visibleBounds || visibleBounds.length < 2) {
        console.log("No valid bounds in region change event");
        return;
      }

      // Calculate center from the visible bounds [sw, ne]
      const centerLng = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
      const centerLat = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;

      if (isNaN(centerLat) || isNaN(centerLng)) {
        console.log("Invalid center coordinates calculated from region change");
        return;
      }

      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      // Update region state with current map center
      setRegion(newRegion);

      console.log("Map region updated:", newRegion);
    } catch (error) {
      console.error("Error in handleRegionChange:", error);
    }
  }, []);

  // navbar
  const navigation = useNavigation();

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

  const lineFeature = {
    type: "Feature",
    properties: {}, // Optional properties, like metadata about the feature
    geometry: {
      type: "LineString",
      coordinates: [
        [45.49706, -73.57849],
        [45.49604, -73.5793],
        /*{ latitude: 45.49579, longitude: -73.57934 },
        { latitude: 45.49357, longitude: -73.5817 },
        { latitude: 45.48973, longitude: -73.577 },
        { latitude: 45.46161, longitude: -73.62401 },
        { latitude: 45.46374, longitude: -73.62888 },*/
      ],
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
    const route =
      activeCampus === "sgw"
        ? campusRoutes.sgwToLoyola
        : campusRoutes.loyolaToSgw;
    updateOrigin(coordinatesMap["My Position"], "My Location");
    if (activeCampus === "sgw") {
      updateDestination(
        coordinatesMap["Loyola Campus, Shuttle Stop"],
        "Loyola Campus, Shuttle Stop",
      );
    } else {
      updateDestination(
        coordinatesMap["SGW Campus, Shuttle Stop"],
        "SGW Campus, Shuttle Stop",
      );
    }
    setShuttleRoute(route);
  };

  // Center on campus
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

  // Center on user
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
          zoomLevel: 15, // Adjust zoom level as needed
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

  // Further filter points based on distance and selected filters
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
            ? calculateDistance(
              location.latitude,
              location.longitude,
              aLat,
              aLng,
            )
            : Infinity;
        const bDistance =
          bLat && bLng
            ? calculateDistance(
              location.latitude,
              location.longitude,
              bLat,
              bLng,
            )
            : Infinity;
        return aDistance - bDistance;
      },
    );

    return sortedPoints.filter((point) => {
      const lat = point.geometry?.location?.lat;
      const lng = point.geometry?.location?.lng;
      if (!lat || !lng) return false;
      const d = calculateDistance(
        location.latitude,
        location.longitude,
        lat,
        lng,
      );
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

  // Determine the current center based on active campus
  const currentCenter =
    activeCampus === "sgw"
      ? [-73.5792229, 45.4951962]
      : [-73.6417009, 45.4581281];

  // Handle POI marker press
  const handlePOIPress = (poi) => {
    setSelectedPOI(selectedPOI?.place_id === poi.place_id ? null : poi);
  };

  // Calculate distance to the selected POI
  const getDistanceToPOI = (poi) => {
    if (!location || !poi?.geometry?.location) return null;

    const lat1 = location.latitude;
    const lon1 = location.longitude;
    const lat2 = poi.geometry.location.lat;
    const lon2 = poi.geometry.location.lng;

    return calculateDistance(lat1, lon1, lat2, lon2);
  };

  // Handle "Get Directions" button press
  const handleGetDirections = (poi) => {
    if (!poi?.geometry?.location) return;

    // For now, just close the popup
    // Later we can add actual directions functionality
    setSelectedPOI(null);
    console.log("Get directions to:", poi.name);
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
            zoomLevel={selectedIndoorBuilding ? 18 : 15} // Adjust zoom based on selection
            centerCoordinate={
              selectedIndoorBuilding
                ? calculateCentroid(
                  convertCoordinates(selectedIndoorBuilding.coordinates),
                )
                : activeCampus === "sgw"
                  ? [-73.5792229, 45.4951962]
                  : [-73.6417009, 45.4581281]
            }
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* Add the ShapeSource to provide geoJSON data */}
          {showShuttleRoute && (
            <Mapbox.ShapeSource id="line1" shape={lineFeature}>
              {/* LineLayer to style the line */}
              <Mapbox.LineLayer
                id="linelayer1"
                style={{
                  lineColor: "blue", // Color of the line
                  lineWidth: 5, // Width of the line
                  lineCap: "round", // Shape of the line ends
                  lineJoin: "round", // Shape of the line segment joins
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
          {!showIndoorMap &&
            buildings
              .filter((b) => b.coordinates && b.coordinates.length > 0)
              .map((building) => {
                const convertedCoords = convertCoordinates(
                  building.coordinates,
                );
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
                        <Text style={styles.annotationText}>
                          {building.name}
                        </Text>
                      </View>
                    </Mapbox.PointAnnotation>
                  </Fragment>
                );
              })}

          {/* Render dataset (vector data) */}
          {showIndoorMap && geoJsonData?.type === "FeatureCollection" && (
            <Mapbox.ShapeSource id="indoor-geojson" shape={geoJsonData}>
              {/* Render Walls & Rooms (Polygons) */}
              <Mapbox.FillLayer
                id="rooms-fill"
                style={{
                  fillColor: "red",
                  fillOpacity: 0.2,
                }}
                filter={["==", ["geometry-type"], "Polygon"]}
              />

              <Mapbox.LineLayer
                id="rooms-stroke"
                style={{
                  lineColor: "red",
                  lineWidth: 2,
                }}
                filter={["==", ["geometry-type"], "Polygon"]}
              />

              {/* Render Walls (Lines) */}
              <Mapbox.LineLayer
                id="walls-stroke"
                style={{
                  lineColor: "red",
                  lineWidth: 2,
                }}
                filter={["==", ["get", "type"], "Walls"]}
              />

              {/* Render Paths (Lines) */}
              <Mapbox.LineLayer
                id="paths"
                style={{
                  lineColor: "black",
                  lineWidth: 2,
                }}
                filter={["==", ["get", "type"], "Paths"]}
              />

              {/* Render Labels (Points) */}
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
        </Mapbox.MapView>
      </View>

      {/* Position Buttons */}
      <View style={styles.positionButtonsContainer}>
        {/* User Location Button */}
        <TouchableOpacity
          style={styles.positionButton}
          onPress={centerMapOnUser}
          testID="locate-me-button"
        >
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>

        {/* Campus Location Button */}
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
                  activeCampus.toLowerCase() && building.hasIndoor === true,
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

      {/* POI Filter Button - only visible when POI is enabled */}
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

      {/* POI Update Button - only visible when POI is enabled and region changed */}
      {showUpdateButton && showPOI && (
        <TouchableOpacity
          style={poiStyles.updateButtonContainer}
          onPress={() => handleFetchPlaces(region)}
        >
          <Text style={poiStyles.updateButtonText}>Update POIs</Text>
        </TouchableOpacity>
      )}

      {/* POI Filter Modal */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        distance={distance}
        setDistance={setDistance}
        showCafes={showCafes}
        setShowCafes={setShowCafes}
        showRestaurants={showRestaurants}
        setShowRestaurants={setShowRestaurants}
        showActivities={showActivities}
        setShowActivities={setShowActivities}
      />

      {/* Floating Buttons */}
      <View style={outdoorStyles.buttonContainer}>
        <TouchableOpacity style={outdoorStyles.button} onPress={togglePOI}>
          <MaterialIcons
            name={showPOI ? "local-dining" : "restaurant"}
            size={24}
            color="white"
          />
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

      {/* Floating POI popup container */}
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
                console.log(`Get directions for address: ${selectedPOI.vicinity || "unknown"}`);
                setSelectedPOI(null);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

