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
import { useIndoorMapContext } from "../context/IndoorMapContext";
import { useNavigation } from "@react-navigation/native";
import { BuildingPopup } from "../components/BuildingPopUp";
import tabStyles from "../styles/LayoutStyles";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import IndoorMap from "../components/IndoorMap/IndoorMap";
import FloorNavigation from "../components/FloorNavigation";
import MapDirections from "../components/MapDirections";
import ShortestPathMap from "../components/IndoorMap/ShortestPathMap";
import { hGraph, hNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/Hall";
import { ccGraph, ccNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/CC";
import { loyolaGraph, loyolaNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/Loyola";
import { mbGraph, mbNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/MB";
import { indoorCoordinatesMap } from "../components/IndoorMap/GraphAndCoordinates/GraphAndCoordinates";
import {
  handleIndoorBuildingSelect,
  handleClearIndoorMap,
  calculateCentroid,
  convertCoordinates,
} from "../utils/IndoorMapUtils";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";
import { extractShuttleInfo } from "../api/shuttleLiveData";
import { useLocalSearchParams } from "expo-router";

// Import POI related components
import MapMarkers from "../components/POI/MapMarkers";
import FilterModal from "../components/POI/FilterModal";
import {
  CoffeeMarker,
  RestaurantMarker,
  ActivityMarker,
} from "../components/POI/Markers";
import POIPopup from "../components/POI/POIPopup"; // Import the new component
import { fetchPOIData, poiDataSubject, getCachedPOIData } from "../api/poiApi";
import { styles as poiStyles } from "../styles/poiStyles";
import ShuttleInfoPopup from "../components/ShuttleInfoPopup";
import { estimateShuttleFromButton } from "../utils/shuttleUtils";

const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);

// Constants for POI functionality
const REGION_CHANGE_THRESHOLD = 0.005;

export default function MapView() {
  const { destinationString } = useLocalSearchParams();

  useEffect(() => {
    if (destinationString) {
      // Update the destination using the existing context
      updateDestination(
        coordinatesMap[destinationString] || destinationString,
        destinationString
      );
      updateShowTransportation(true);
    }
  }, [destinationString]);

  //get Campus type from homePage
  const { type } = useLocalSearchParams();

  //get coordinates and name from POI page
  const { name, lat, lng } = useLocalSearchParams();

  console.log(name, lat, lng);
  // Campus switching
  const [activeCampus, setActiveCampus] = useState(type || "sgw"); // Default to "sgw" if no type is passed
  const mapRef = useRef(null);

  // Disabled on or off
  const [isDisabled, setIsDisabled] = useState(false);

  // Location & permissions
  const { location, hasPermission } = useLocation();
  const [showPermissionPopup, setShowPermissionPopup] = useState(
    !hasPermission
  );

  // Building popup
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [shuttlePopupVisible, setShuttlePopupVisible] = useState(false);
  const [shuttleDetails, setShuttleDetails] = useState(null);

  // The missing piece: track the building user is inside
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  //Statues for displaying shuttle polylines or not
  //const [shuttleRoute, setShuttleRoute] = useState("");

  //Set Shuttle Live loc
  const [shuttleLocations, setShuttleLocations] = useState([]);
  const fetchInterval = 30000;

  // POI related state
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(
    activeCampus === "sgw" ? sgwRegion : loyolaRegion
  );
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(40); 
  const [useDistance, setUseDistance] = useState(true);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [showPOI, setShowPOI] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const isFetchingRef = useRef(false);
  const activeRequestRef = useRef(null);

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
    ...indoorCoordinatesMap,
  };

  // Combine Graphs and Coordinates
  const graph = { ...hGraph, ...mbGraph, ...ccGraph, ...loyolaGraph};
  const nodeCoordinates = { ...hNodeCoordinates, ...mbNodeCoordinates, ...ccNodeCoordinates, ...loyolaNodeCoordinates};


  // Handle clearing indoor mode when "Outdoor" is pressed
  const clearIndoorMap = () => {
    handleClearIndoorMap(
      updateSelectedIndoorBuilding,
      updateIsExpanded,
      mapRef,
      activeCampus,
      updateSelectedFloor
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
    renderMap,
    showShuttleRoute,
    travelMode,
    showTransportation,
  } = useLocationContext();

  //Global constants to manage indoor-maps
  const {
    isExpanded,
    selectedIndoorBuilding,
    selectedFloor,
    updateIsExpanded,
    updateSelectedIndoorBuilding,
    updateSelectedFloor,
  } = useIndoorMapContext();

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

  // This useEffect manages origin, destination, and the footer appearing when dependencies change
  useEffect(() => {
    try {
      console.log("IN MAP:", destinationText, renderMap);
  
      // Ensure "My Position" is dynamically updated from location
      coordinatesMap["My Position"] = location?.latitude
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined;
  
      const newOrigin = coordinatesMap[originText] || origin;
      const newDestination = coordinatesMap[destinationText] || destination;
  
      if (JSON.stringify(newOrigin) !== JSON.stringify(origin)) {
        updateOrigin(newOrigin, originText);
      }
  
      if (JSON.stringify(newDestination) !== JSON.stringify(destination)) {
        updateDestination(newDestination, destinationText);
      }
  
      // Manage shuttle route visibility
      updateShowShuttleRoute(
        originText === "My Location" &&
          (destinationText === "Loyola Campus, Shuttle Stop" ||
            destinationText === "SGW Campus, Shuttle Stop") &&
          renderMap
      );
  
      // Manage navigation bar visibility
      navigation.setOptions({
        tabBarStyle: renderMap ? { display: "none" } : tabStyles.tabBarStyle,
      });
    } catch (error) {
      console.log("Crashed in useEffect:", error);
    }
  }, [
    location?.latitude,
    location?.longitude,
    originText,
    destinationText,
    activeCampus,
    travelMode,
    popupVisible,
    showShuttleRoute,
    showTransportation,
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

    try {
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
    } catch (error) {
      console.error("Error loading cached POI data:", error);
    }
  }, [showPOI]);

  // Show update button when region has shifted
  useEffect(() => {
    if (!lastFetchedRegion || !region || !showPOI) return;
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(
      latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD
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

  // Initialize region when component mounts
  useEffect(() => {
    const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
    setRegion(currentRegion);
  }, []);

  /**
   * Subscribe to POI data changes through Observer pattern
   * This makes the map component an observer of POIDataSubject
   */
  useEffect(() => {
    if (!showPOI) return;
    
    // Observer function that will be called when data changes
    const updatePOIData = (data, isLoading) => {
      setCoffeeShops(data.coffeeShops);
      setRestaurants(data.restaurants);
      setActivities(data.activities);
      setLastFetchedRegion(data.lastRegion);
      setLoading(isLoading);
      
      // Show update button if region has changed significantly 
      setShowUpdateButton(poiDataSubject.hasRegionChanged(region));
    };
    
    // Subscribe to data changes
    const unsubscribe = poiDataSubject.subscribe(updatePOIData);
    
    // Initial fetch ONLY when POI display is first enabled
    if (showPOI && 
        coffeeShops.length === 0 && 
        restaurants.length === 0 && 
        activities.length === 0 && 
        !isFetchingRef.current) {
      console.log("Initial data fetch triggered by POI being enabled");
      handleFetchPlaces();
    }
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [showPOI]); // Removed region from dependencies to prevent auto-fetches on map drag

  // Show update button when region has shifted
  useEffect(() => {
    if (!lastFetchedRegion || !region || !showPOI) return;
    
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    
    // Only update the button visibility when the region changes significantly
    if (latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD) {
      setShowUpdateButton(true);
    } else {
      setShowUpdateButton(false);
    }
  }, [region, lastFetchedRegion, showPOI]);

  const handleFetchPlaces = async (currentRegion = region) => {
    // If no region provided, try to use current camera position
    if (!currentRegion && mapRef.current) {
      try {
        const camera = await mapRef.current.getCamera();
        if (camera?.centerCoordinate) {
          currentRegion = {
            latitude: camera.centerCoordinate[1],
            longitude: camera.centerCoordinate[0],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          console.log(
            "Using camera position as region fallback:",
            currentRegion
          );
        }
      } catch (error) {
        console.error("Error getting camera position:", error);
      }
    }

    if (!currentRegion) {
      console.error(
        "Cannot fetch POIs: No region provided and couldn't get camera position"
      );
      return;
    }

    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }

    console.log("Starting POI fetch for region:", currentRegion);
    isFetchingRef.current = true;

    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      // Using the Observer pattern through the fetchPOIData
      // This will update the subject which notifies all observers
      await fetchPOIData(currentRegion, controller.signal);
      setShowUpdateButton(false);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted - this is normal during unmount or when starting a new request");
      } else {
        console.error("Error fetching places:", error);
      }
    } finally {
      isFetchingRef.current = false;
      activeRequestRef.current = null;
    }
  };

  // Add a tracking flag to prevent duplicate region change events
  const isRegionChangingRef = useRef(false);

  // Fix the handleRegionChange function to properly handle the Mapbox event object
  const handleRegionChange = useCallback((feature) => {
    if (isRegionChangingRef.current || !feature?.properties) return;

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
      
      // Don't automatically fetch - just check if button should be shown
      if (showPOI && lastFetchedRegion) {
        const latDiff = Math.abs(newRegion.latitude - lastFetchedRegion.latitude);
        const lngDiff = Math.abs(newRegion.longitude - lastFetchedRegion.longitude);
        
        if (latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD) {
          setShowUpdateButton(true);
        }
      }

      console.log("Map region updated:", newRegion);
    } catch (error) {
      console.error("Error in handleRegionChange:", error);
    }
  }, [showPOI, lastFetchedRegion]);

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

  const handleBuildingSetStartingPoint = (building) => {
    if (!building?.entranceCoordinates) {
      console.error("Invalid building data:", building);
      return;
    }
    const buildingFullName = `${building.name}, ${building.longName}`;
    updateOrigin(building.entranceCoordinates, buildingFullName);
  };

  const handleShuttleButton = async () => {
    console.log("Shuttle button click");

    // Update origin & destination as before
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

    try {
      const currentStop = activeCampus === "sgw" ? "SGW" : "LOY";
      const shuttleResult = await estimateShuttleFromButton(currentStop);

      // If the utility returned an object with "error", store it directly.
      if (shuttleResult?.error) {
        setShuttleDetails({ error: shuttleResult.error });
      } else if (!shuttleResult) {
        // If it's null or undefined for some reason
        setShuttleDetails({ error: "No bus available." });
      } else {
        // If valid times
        setShuttleDetails(shuttleResult);
      }
    } catch (error) {
      // If something truly unexpected happens
      console.warn("Error estimating shuttle time:", error);
      setShuttleDetails({ error: error.message });
    }

    // Show the popup
    setShuttlePopupVisible(true);
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
    // First get the new value we're about to set
    const willShowPOI = !showPOI;

    // Update the state
    setShowPOI(willShowPOI);

    // If we're turning POIs ON, fetch the data
    if (willShowPOI) {
      console.log("POI toggle: Showing POIs, fetching data if needed");

      if (
        coffeeShops.length > 0 ||
        restaurants.length > 0 ||
        activities.length > 0
      ) {
        console.log("POI toggle: Using cached POI data");
        return;
      }

      // Try to use region, if not available, handleFetchPlaces will try to use camera position
      handleFetchPlaces();
    } else {
      console.log("POI toggle: Hiding POIs");
    }
  };

  //fetch shuttle live data
  useEffect(() => {
    const fetchShuttleData = async () => {
      try {
        const shuttleData = await extractShuttleInfo(); // Replace with actual API function
        console.log("Shuttle Data:", shuttleData);
        setShuttleLocations(shuttleData); // Assume this returns an array of {latitude, longitude}
      } catch (error) {
        console.warn("Error fetching schedule:", error.message);
      }
    };

    fetchShuttleData();
    const interval = setInterval(fetchShuttleData, fetchInterval);

    return () => clearInterval(interval);
  }, []);

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
  const handlePOIGetDirections = (poi) => {
    if (!poi?.geometry?.location) return;
    updateOrigin(coordinatesMap["My Position"], "My Location");
    updateDestination(
      {
        latitude: poi.geometry.location.lat,
        longitude: poi.geometry.location.lng,
      },
      poi.name
    );
    updateShowTransportation(true);
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
            centerCoordinate={(() => {
              if (selectedIndoorBuilding) {
                return calculateCentroid(
                  convertCoordinates(selectedIndoorBuilding.coordinates)
                );
              } else {
                return activeCampus === "sgw"
                  ? [-73.5792229, 45.4951962]
                  : [-73.6417009, 45.4581281];
              }
            })()}
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
          {indoorCoordinatesMap[originText] &&
          indoorCoordinatesMap[destinationText] && renderMap ? (
            <ShortestPathMap
              graph={graph}
              nodeCoordinates={nodeCoordinates}
              startNode={originText}
              endNode={destinationText}
              currentFloor={selectedFloor}
            />
          ) : (
            origin &&
            destination &&
            renderMap && (
              <MapDirections
                origin={origin}
                destination={destination}
                mapRef={mapRef}
                travelMode={travelMode}
              />
            )
          )}

          {/* Render building polygons */}
          {buildings
            .filter((b) => b.coordinates && b.coordinates.length > 0)
            .map((building) => {
              const convertedCoords = convertCoordinates(building.coordinates);
              const centroid = calculateCentroid(convertedCoords);
              const fillColor =
                highlightedBuilding === building.name
                  ? "#f8b837"
                  : "#922338";
              const strokeColor =
                highlightedBuilding === building.name ? "#f8b837" : "#922338";

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
                      style={{ fillColor, fillOpacity: 0.5 }}
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
            selectedFloor={String(selectedFloor)}
          />

          {/* Shuttle bus live location */}
          {showShuttleRoute &&
            shuttleLocations.map((shuttle) => (
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
                <Mapbox.SymbolLayer
                  id={`icon-${shuttle.id}`}
                  style={{
                    iconImage: require("../../assets/images/icon-for-shuttle.png"),
                    iconSize: 0.15,
                    iconAllowOverlap: true,
                  }}
                />
              </Mapbox.ShapeSource>
            ))}

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
      {selectedIndoorBuilding && (
        <FloorNavigation
          selectedBuilding={selectedIndoorBuilding}
          selectedFloor={selectedFloor}
          onChangeFloor={updateSelectedFloor}
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
            <Text style={styles.text}>{selectedIndoorBuilding.name === "VL" || selectedIndoorBuilding.name === "VE" ? "VL&VE" : selectedIndoorBuilding.name}</Text>
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
                    activeCampus.toLowerCase() && building.hasIndoor === true &&
                    building.name.toLowerCase() !== "ve"
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
                      updateSelectedFloor,
                      mapRef
                    )
                  }
                >
                  <Text style={styles.text}>{building.name === "VL" ? "VL&VE" : building.name}</Text>
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
          <ActivityIndicator size="large" color="#922338" />
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
        useDistance={useDistance}
        setUseDistance={setUseDistance}
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
        setAsStartingPoint={handleBuildingSetStartingPoint}
      />
      <ShuttleInfoPopup
        visible={shuttlePopupVisible}
        onClose={() => setShuttlePopupVisible(false)}
        shuttleDetails={shuttleDetails}
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
                console.log(
                  `Get directions for address: ${
                    selectedPOI.vicinity || "unknown"
                  }`
                );
                handlePOIGetDirections(selectedPOI);
                setSelectedPOI(null);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
