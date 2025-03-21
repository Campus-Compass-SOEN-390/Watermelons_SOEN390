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
import indoorMapStyles from "../styles/IndoorMapStyles.js";
import outdoorMapStyles from "../styles/OutdoorMapStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
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
import { styles as poiStylesImport } from "../styles/poiStyles";
import ShuttleInfoPopup from "../components/ShuttleInfoPopup";
import { useLocalSearchParams } from "expo-router";

// Import Controllers
import POIController from '../controllers/POIController';
import IndoorController from '../controllers/IndoorController';
import OutdoorController from '../controllers/OutdoorController';

// Import POI related components
import MapMarkers from "../components/POI/MapMarkers";
import FilterModal from "../components/POI/FilterModal";
import {
  CoffeeMarker,
  RestaurantMarker,
  ActivityMarker,
} from "../components/POI/Markers";
import POIPopup from "../components/POI/POIPopup";
import { sgwRegion, loyolaRegion } from "../constants/outdoorMap";

const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);

// Constants
const REGION_CHANGE_THRESHOLD = 0.005;

function MapView() {
  // Get Campus type from homePage
  const { type } = useLocalSearchParams();

  // Get coordinates and name from POI page
  const { name, lat, lng } = useLocalSearchParams();

  // Campus switching
  const [activeCampus, setActiveCampus] = useState(type || "sgw");
  const mapRef = useRef(null);

  // Disabled on or off
  const [isDisabled, setIsDisabled] = useState(false);

  // Location & permissions
  const { location, hasPermission } = useLocation();
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);

  // Building popup
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [shuttlePopupVisible, setShuttlePopupVisible] = useState(false);
  const [shuttleDetails, setShuttleDetails] = useState(null);

  // The building user is inside
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  // Shuttle Live locations
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
  const isRegionChangingRef = useRef(false);

  // Indoor map context
  const {
    isExpanded,
    selectedIndoorBuilding,
    selectedFloor,
    updateIsExpanded,
    updateSelectedIndoorBuilding,
    updateSelectedFloor,
  } = useIndoorMapContext();

  // Location context for navigation
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

  // Get the combined coordinates map
  const [coordinatesMap, setCoordinatesMap] = useState({
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
    ...IndoorController.getIndoorCoordinatesMap()
  });

  // Navigation
  const navigation = useNavigation();

  // Handle clearing indoor mode when "Outdoor" is pressed
  const clearIndoorMap = () => {
    IndoorController.handleClearIndoorMap(
      updateSelectedIndoorBuilding,
      updateIsExpanded,
      mapRef,
      activeCampus,
      updateSelectedFloor
    );
  };

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
    } catch (error) {
      console.log("Error animating map to campus:", error);
    }
  }, [activeCampus]);

  // Check location & highlight building
  useEffect(() => {
    try {
      if (location) {
        const buildingName = OutdoorController.checkUserInBuilding(location);
        setHighlightedBuilding(buildingName);
      }
      if (!hasPermission) {
        setShowPermissionPopup(true);
      }
    } catch (error) {
      console.log("Error checking user location:", error);
    }
  }, [location, hasPermission]);

  // Manage origin, destination, and the footer when dependencies change
  useEffect(() => {
    try {
      // Update coordinates map with current position
      const updatedMap = {
        ...coordinatesMap,
        "My Position": location?.latitude
          ? { latitude: location.latitude, longitude: location.longitude }
          : undefined
      };
      setCoordinatesMap(updatedMap);
  
      const newOrigin = updatedMap[originText] || origin;
      const newDestination = updatedMap[destinationText] || destination;
  
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
      console.log("Error in useEffect:", error);
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

  // Load cached POI data on mount if available
  useEffect(() => {
    if (!showPOI) return;

    try {
      if (POIController.loadCachedPOIs()) {
        setCoffeeShops(POIController.getCoffeeShops());
        setRestaurants(POIController.getRestaurants());
        setActivities(POIController.getActivities());
        setLastFetchedRegion(POIController.getLastFetchedRegion());
        
        const now = Date.now();
        if (
          now - (POIController.getLastFetchedRegion()?.timestamp || 0) > 10 * 60 * 1000 &&
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
    
    setShowUpdateButton(POIController.shouldShowUpdateButton(region));
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
      POIController.abortActiveRequest();
    };
  }, []);

  // Initialize region when component mounts
  useEffect(() => {
    const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
    setRegion(currentRegion);
  }, []);

  // Subscribe to POI data changes
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
      setShowUpdateButton(POIController.shouldShowUpdateButton(region));
    };
    
    // Subscribe to data changes
    const unsubscribe = POIController.subscribe(updatePOIData);
    
    // Initial fetch when POI display is first enabled
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
  }, [showPOI]);

  // Fetch shuttle locations periodically
  useEffect(() => {
    const fetchShuttleData = async () => {
      try {
        const shuttleData = await OutdoorController.fetchShuttleLocations();
        setShuttleLocations(shuttleData);
      } catch (error) {
        console.warn("Error fetching schedule:", error.message);
      }
    };

    fetchShuttleData();
    const interval = setInterval(fetchShuttleData, fetchInterval);

    return () => clearInterval(interval);
  }, []);

  // Reset render map when origin or destination changes
  useEffect(() => {
    try {
      updateRenderMap(false);
      updateTravelMode("");
    } catch (error) {
      console.log("Error resetting render map:", error);
    }
  }, [origin, destination]);

  // Event Handlers and Controller Functions
  
  // Handle fetching places
  const handleFetchPlaces = async (currentRegion = region) => {
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
        }
      } catch (error) {
        console.error("Error getting camera position:", error);
      }
    }

    if (!currentRegion) {
      console.error("Cannot fetch POIs: No region provided");
      return;
    }

    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);

    try {
      await POIController.fetchPOIs(currentRegion);
      setShowUpdateButton(false);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // Handle region change
  const handleRegionChange = useCallback((feature) => {
    if (isRegionChangingRef.current || !feature?.properties) return;

    try {
      // Get the center coordinates from the visibleBounds property
      const { visibleBounds } = feature.properties;
      if (!visibleBounds || visibleBounds.length < 2) return;

      // Calculate center from the visible bounds [sw, ne]
      const centerLng = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
      const centerLat = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;

      if (isNaN(centerLat) || isNaN(centerLng)) return;

      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      // Update region state with current map center
      setRegion(newRegion);
      
      // Check if update button should be shown
      if (showPOI && lastFetchedRegion) {
        setShowUpdateButton(POIController.shouldShowUpdateButton(newRegion));
      }
    } catch (error) {
      console.error("Error in handleRegionChange:", error);
    }
  }, [showPOI, lastFetchedRegion]);

  // Handle building press
  const handleBuildingPress = (building) => {
    const fullBuilding = OutdoorController.handleBuildingPress(building);
    if (fullBuilding) {
      setSelectedBuilding(fullBuilding);
      setPopupVisible(true);
    } else {
      console.error("Building data is incomplete!", building);
    }
  };

  // Handle getting directions to a building
  const handleBuildingGetDirections = (building) => {
    OutdoorController.handleBuildingGetDirections(
      building, 
      updateOrigin, 
      updateDestination, 
      coordinatesMap["My Position"],
      updateShowTransportation
    );
  };

  // Handle setting a building as starting point
  const handleBuildingSetStartingPoint = (building) => {
    OutdoorController.handleBuildingSetStartingPoint(building, updateOrigin);
  };

  // Handle shuttle button
  const handleShuttleButton = async () => {
    const details = await OutdoorController.handleShuttleButton(
      updateOrigin, 
      updateDestination, 
      coordinatesMap["My Position"]
    );
    
    setShuttleDetails(details);
    setShuttlePopupVisible(true);
  };

  // Center map on campus
  const centerMapOnCampus = () => {
    OutdoorController.centerMapOnCampus(mapRef);
  };

  // Center map on user
  const centerMapOnUser = () => {
    OutdoorController.centerMapOnUser(mapRef, location);
  };

  // Switch campus
  const toggleCampus = () => {
    const newCampus = OutdoorController.toggleCampus(mapRef);
    setActiveCampus(newCampus);
  };

  // Toggle POI display
  const togglePOI = () => {
    const willShowPOI = !showPOI;
    setShowPOI(willShowPOI);

    if (willShowPOI) {
      if (
        coffeeShops.length > 0 ||
        restaurants.length > 0 ||
        activities.length > 0
      ) {
        console.log("Using cached POI data");
        return;
      }
      handleFetchPlaces();
    }
  };

  // Handle POI marker press
  const handlePOIPress = (poi) => {
    setSelectedPOI(POIController.handlePOIPress(selectedPOI, poi));
  };

  // Get distance to the selected POI
  const getDistanceToPOI = (poi) => {
    return POIController.getDistanceToPOI(poi, location);
  };

  // Handle "Get Directions" button press for POI
  const handlePOIGetDirections = (poi) => {
    POIController.handlePOIGetDirections(
      poi, 
      updateOrigin, 
      updateDestination, 
      coordinatesMap["My Position"],
      updateShowTransportation
    );
  };

  // Get the graph and node coordinates from controller
  const graph = IndoorController.getGraph();
  const nodeCoordinates = IndoorController.getNodeCoordinates();

  // Render the component
  return (
    <View style={{ flex: 1 }}>
      <View style={indoorMapStyles.container}>
        <StartAndDestinationPoints />
        <Mapbox.MapView
          style={indoorMapStyles.map}
          styleURL={Mapbox.StyleURL.Light}
          onRegionDidChange={(feature) => handleRegionChange(feature)}
        >
          <Mapbox.Camera
            ref={mapRef}
            zoomLevel={selectedIndoorBuilding ? 18 : 15}
            centerCoordinate={(() => {
              if (selectedIndoorBuilding) {
                return IndoorController.calculateCentroid(
                  IndoorController.convertCoordinates(selectedIndoorBuilding.coordinates)
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

          {/* Shuttle bus route */}
          {showShuttleRoute && (
            <Mapbox.ShapeSource id="line1" shape={OutdoorController.getShuttleRoute()}>
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

          {/* Render Direction Route for indoor navigation */}
          {IndoorController.getIndoorCoordinatesMap()[originText] &&
          IndoorController.getIndoorCoordinatesMap()[destinationText] && renderMap ? (
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
          {OutdoorController.getAllBuildings()
            .filter((b) => b.coordinates && b.coordinates.length > 0)
            .map((building) => {
              const convertedCoords = OutdoorController.convertCoordinates(building.coordinates);
              const centroid = OutdoorController.calculateCentroid(convertedCoords);
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
                    anchor={{ x: 0.5, y: 0.5 }}
                    onSelected={() => handleBuildingPress(building)}
                  >
                    <View style={indoorMapStyles.annotationContainer}>
                      <Text style={indoorMapStyles.annotationText}>{building.name}</Text>
                    </View>
                  </Mapbox.PointAnnotation>
                </Fragment>
              );
            })}

          {/* Indoor Map Component */}
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
      <View style={indoorMapStyles.positionButtonsContainer}>
        {/* User Location Button */}
        <TouchableOpacity
          style={indoorMapStyles.positionButton}
          onPress={centerMapOnUser}
          testID="locate-me-button"
        >
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>

        {/* Campus Location Button */}
        <TouchableOpacity
          style={indoorMapStyles.positionButton}
          onPress={centerMapOnCampus}
          testID="locate-campus-button"
        >
          <MaterialIcons name="location-on" size={24} color="black" />
          <Text style={indoorMapStyles.campusButtonText}>
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
          indoorMapStyles.buildingsContainer,
          isExpanded && indoorMapStyles.expandedBuildingsContainer,
        ]}
      >
        <TouchableOpacity
          style={indoorMapStyles.button}
          onPress={() => updateIsExpanded(!isExpanded)}
          testID="buildings-button"
        >
          {selectedIndoorBuilding ? (
            <Text style={indoorMapStyles.text}>
              {selectedIndoorBuilding.name === "VL" || selectedIndoorBuilding.name === "VE" 
                ? "VL&VE" 
                : selectedIndoorBuilding.name}
            </Text>
          ) : (
            <MaterialIcons name="location-city" size={24} color="black" />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={indoorMapStyles.expandedButtonsContainer}>
            {/* "None" button to disable the indoor map */}
            <TouchableOpacity
              style={indoorMapStyles.expandedButton}
              onPress={clearIndoorMap}
            >
              <Text style={indoorMapStyles.text}>Outdoor</Text>
            </TouchableOpacity>

            {/* Buildings with indoor mapping available */}
            {IndoorController.getIndoorBuildingsForCampus(
              OutdoorController.getAllBuildings(), 
              activeCampus
            ).map((building) => (
              <TouchableOpacity
                key={building.id}
                style={indoorMapStyles.expandedButton}
                onPress={() =>
                  IndoorController.handleIndoorBuildingSelect(
                    building,
                    updateSelectedIndoorBuilding,
                    updateIsExpanded,
                    updateSelectedFloor,
                    mapRef
                  )
                }
              >
                <Text style={indoorMapStyles.text}>
                  {building.name === "VL" ? "VL&VE" : building.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Switch Campus Button */}
      <View style={indoorMapStyles.switchCampusButton}>
        <TouchableOpacity
          disabled={isExpanded}
          onPress={toggleCampus}
          style={isExpanded ? indoorMapStyles.disabledButton : null}
        >
          <Text style={indoorMapStyles.text}>Switch Campus</Text>
        </TouchableOpacity>
      </View>

      {/* Shuttle Button */}
      <View style={outdoorMapStyles.shuttleButtonContainer}>
        <TouchableOpacity
          style={outdoorMapStyles.shuttleButton}
          onPress={handleShuttleButton}
        >
          <Image
            source={require("../../assets/images/icon-for-shuttle.png")}
            resizeMode="contain"
            style={outdoorMapStyles.shuttleIcon}
          />
          <Text style={outdoorMapStyles.switchButtonText}>
            {activeCampus === "sgw" ? "Shuttle To Loyola" : "Shuttle To SGW"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* POI Filter Button */}
      {showPOI && (
        <TouchableOpacity
          style={outdoorMapStyles.actionButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* POI Loading Indicator */}
      {loading && (
        <View style={outdoorMapStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#922338" />
        </View>
      )}

      {/* POI Update Button */}
      {showUpdateButton && showPOI && (
        <TouchableOpacity
          style={poiStylesImport.updateButtonContainer}
          onPress={() => handleFetchPlaces(region)}
        >
          <Text style={poiStylesImport.updateButtonText}>Update POIs</Text>
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
      <View style={outdoorMapStyles.buttonContainer}>
        <TouchableOpacity style={outdoorMapStyles.button} onPress={togglePOI}>
          <MaterialIcons
            name={showPOI ? "local-dining" : "restaurant"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Location Permission Denial */}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={indoorMapStyles.modalContainer}>
          <View style={indoorMapStyles.modalContent}>
            <Text style={indoorMapStyles.modalTitle}>Location Permission Denied</Text>
            <Text style={indoorMapStyles.modalText}>
              Location access is required to show your current location on the
              map. Please enable location permissions in your settings.
            </Text>
            <TouchableOpacity
              style={indoorMapStyles.closeButton}
              onPress={() => setShowPermissionPopup(false)}
            >
              <Text style={indoorMapStyles.closeButtonText}>X</Text>
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

      {/* Shuttle Info Popup */}
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

export default MapView;