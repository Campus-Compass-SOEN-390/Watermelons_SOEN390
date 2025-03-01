import React, { useState, useRef, useEffect, Fragment, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Text, Modal, ActivityIndicator, ScrollView, Switch } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import useLocation from "../hooks/useLocation";
import styles from "../styles/UnifiedMapStyles"; // You'll need to create this
import { buildings, Campus, getBuildingById } from "../api/buildingData";
import StartAndDestinationPoints from "../components/StartAndDestinationPoints";
import { BuildingPopup } from "../components/BuildingPopUp";
import MapDirections from "../components/MapDirections";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";
import { useLocalSearchParams } from 'expo-router';

// API key for Google Places
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Custom marker components
const CoffeeMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="coffee" size={24} color="black" />
  </View>
);

const RestaurantMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="orange" />
  </View>
);

const ActivityMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="run" size={20} color="green" />
  </View>
);

const UnifiedMap = () => {
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
  // Feature mode state
  const { mode = 'poi' , campus = 'sgw'} = useLocalSearchParams();
  // Shared states
  const mapRef = useRef(null);
  const { location, hasPermission } = useLocation();
  const [region, setRegion] = useState(sgwRegion);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [showLocating, setShowLocating] = useState(true);
  
  // Campus map states
  const [activeCampus, setActiveCampus] = useState(campus);
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [travelMode, setTravelMode] = useState('TRANSIT');
  const [renderMap, setRenderMap] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  // Points of interest states
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(sgwRegion);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);

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

  // Helper for distance calculations
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

  const formatDistance = (d) => {
    if (d > 1000) {
      return (d / 1000).toFixed(2) + " km";
    }
    return Math.round(d) + " m";
  };

  // Determine which icon to show for each POI
  const renderIconForPoint = (point) => {
    const types = point.types || [];
    
    if (types.includes("cafe") || point.name.toLowerCase().includes("coffee")) {
      return <CoffeeMarker />;
    } else if (types.includes("restaurant")) {
      return <RestaurantMarker />;
    } else if (
      point.name.toLowerCase().includes("tourist") ||
      point.name.toLowerCase().includes("bowling") ||
      point.name.toLowerCase().includes("cinema") ||
      point.name.toLowerCase().includes("theater") ||
      point.name.toLowerCase().includes("gold")
    ) {
      return <ActivityMarker />;
    }
    return null;
  };

  // Effect for location setup and building highlight
  useEffect(() => {
    if (location) {
      setShowLocating(false);
      
      if (mode === "campus") {
        // Building highlight for campus mode
        let found = false;
        for (const building of buildings.filter(b => b.coordinates && b.coordinates.length > 0)) {
          if (isPointInPolygon(location, building.coordinates)) {
            setHighlightedBuilding(building.name);
            found = true;
            break;
          }
        }
        if (!found) setHighlightedBuilding(null);
      }
    }
    
    if (!hasPermission) {
      setShowPermissionPopup(true);
    }
  }, [location, hasPermission, mode]);

  // Effect for campus switching
  useEffect(() => {
    if (mapRef.current && mode === "campus") {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      mapRef.current.animateToRegion(region, 1000);
      setRegion(region);
    }
  }, [activeCampus, mode]);

  // Effect to monitor region changes for POI update button
  useEffect(() => {
    if (mode === "poi") {
      const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
      const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
      if (latDiff > 0.005 || lngDiff > 0.005) {
        setShowUpdateButton(true);
      } else {
        setShowUpdateButton(false);
      }
    }
  }, [region, lastFetchedRegion, mode]);

  // Initial setup when mode changes
  useEffect(() => {
    if (mode === "poi" && coffeeShops.length === 0 && location) {
      fetchPlacesForRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [mode, location]);

  useEffect(() => {
    // When changing from campus to POI mode, unzoom the map
    if (mode === 'poi' && mapRef.current) {
      // Unzoom by increasing delta values (3x wider view)
      const currentRegion = mapRef.current.__lastRegion || region;
      const unzoomedRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: currentRegion.latitudeDelta * 3,
        longitudeDelta: currentRegion.longitudeDelta * 3
      };
      
      // Animate to the new zoomed-out region
      mapRef.current.animateToRegion(unzoomedRegion, 300);
      
      // Update the region state
      setRegion(unzoomedRegion);
    }
  }, [mode]);
  // Fetch POIs from Google Places API
  const fetchPlacesForRegion = async (currentRegion = region) => {
    setLoading(true);
    try {
      let allResults = [];
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|tourist|bowling|cinema|theater|gold&key=${GOOGLE_PLACES_API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();
      allResults = data.results;
      
      while (data.next_page_token) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url);
        data = await response.json();
        allResults = allResults.concat(data.results);
      }
      
      // Process results: split into categories
      const coffee = [];
      const resto = [];
      const act = [];
      allResults.forEach(place => {
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
    setLastFetchedRegion(currentRegion);
    setShowUpdateButton(false);
  };

  // Center map on user location
  const centerMapOnUser = useCallback(() => {
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
  }, [location]);

  // Center map on campus
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
    const fullBuilding = getBuildingById(building.id);
    if (fullBuilding) {
      setSelectedBuilding(fullBuilding);
      setPopupVisible(true);
    }
  };

  // Zoom functions
  const handleZoomIn = () => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 2,
      longitudeDelta: prev.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
  };

  // Filter and sort POIs
  const sortedPoints = useMemo(() => {
    const allPoints = [...coffeeShops, ...restaurants, ...activities];
    if (location) {
      return allPoints.sort((a, b) => {
        const aLat = a.geometry?.location?.lat;
        const aLng = a.geometry?.location?.lng;
        const bLat = b.geometry?.location?.lat;
        const bLng = b.geometry?.location?.lng;
        const aDistance = aLat && aLng
          ? calculateDistance(location.latitude, location.longitude, aLat, aLng)
          : Infinity;
        const bDistance = bLat && bLng
          ? calculateDistance(location.latitude, location.longitude, bLat, bLng)
          : Infinity;
        return aDistance - bDistance;
      });
    }
    return allPoints;
  }, [coffeeShops, restaurants, activities, location]);

  const filteredPoints = useMemo(() => {
    if (!location) return [];
    return sortedPoints.filter((point) => {
      const lat = point.geometry?.location?.lat;
      const lng = point.geometry?.location?.lng;
      if (!lat || !lng) return false;
      const d = calculateDistance(location.latitude, location.longitude, lat, lng);
      if (d > distance * 1000) return false;
      
      const isCafe = showCafes && (point.types?.includes("cafe") || point.name.toLowerCase().includes("coffee"));
      const isRestaurant = showRestaurants && point.types?.includes("restaurant");
      const isActivity = showActivities &&
        (point.name.toLowerCase().includes("tourist") ||
         point.name.toLowerCase().includes("bowling") ||
         point.name.toLowerCase().includes("cinema") ||
         point.name.toLowerCase().includes("theater") ||
         point.name.toLowerCase().includes("gold"));
      
      return isCafe || isRestaurant || isActivity;
    });
  }, [sortedPoints, location, distance, showCafes, showRestaurants, showActivities]);

  return (
    <View style={styles.container}>
      {/* Campus mode UI elements */}
      {mode === "campus" && (
        <StartAndDestinationPoints
          setOriginLocation={setOriginLocation}
          setDestinationLocation={setDestinationLocation}
          setTravelMode={setTravelMode}
          renderMap={renderMap}
          setRenderMap={setRenderMap}
        />
      )}

      {/* POI mode list view and filter UI */}
      {mode === "poi" && (
        <View style={{ marginTop: 0, alignSelf: "flex-end", marginRight: 20}} />
      )}
      
      {mode === "poi" && isListView && (
        <>
          {/* Filters Button */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          {/* Modal for Filter Options */}
          <Modal
            visible={isFilterModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsFilterModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Options</Text>

                {/* Distance Slider */}
                <Text style={{ marginTop: 20 }}>Max Distance: {distance} km</Text>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0.5}
                  maximumValue={10}
                  step={0.5}
                  value={distance}
                  onValueChange={(value) => setDistance(value)}
                  minimumTrackTintColor="#1E88E5"
                  maximumTrackTintColor="#000000"
                />

                <View style={styles.filterOption}>
                  <Text>Cafes</Text>
                  <Switch value={showCafes} onValueChange={setShowCafes} />
                </View>

                <View style={styles.filterOption}>
                  <Text>Restaurants</Text>
                  <Switch value={showRestaurants} onValueChange={setShowRestaurants} />
                </View>

                <View style={styles.filterOption}>
                  <Text>Activities</Text>
                  <Switch value={showActivities} onValueChange={setShowActivities} />
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsFilterModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* POI mode in list view */}
      {mode === "poi" && isListView ? (
        <ScrollView
          style={styles.listViewContainer}
          contentContainerStyle={styles.listContent}
        >
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => {
              const lat = point.geometry?.location?.lat;
              const lng = point.geometry?.location?.lng;
              const d = lat && lng && location
                ? calculateDistance(location.latitude, location.longitude, lat, lng)
                : null;
              
              return (
                <View
                  key={point.place_id}
                  style={[
                    styles.listItem,
                    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
                  ]}
                >
                  <View style={{ flex: 1, width: "100%" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {renderIconForPoint(point)}
                      <Text style={[styles.listItemText, { marginLeft: 10, marginRight: 40 }]}>
                        {point.name}
                      </Text>
                    </View>
                    {d !== null && (
                      <Text style={styles.listItemDistance}>
                        {formatDistance(d)}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsListView(false);
                      setOriginLocation("My Position");
                      setDestinationLocation({ latitude: lat, longitude: lng });
                      setRenderMap(true);
                    }}
                    style={{
                      backgroundColor: "#922338",
                      padding: 8,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No points match the selected filters.
            </Text>
          )}
        </ScrollView>
      ) : (
        // Map View (for both modes)
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
        >
          {/* Campus mode - Direction lines */}
          {mode === "campus" && originLocation && destinationLocation && renderMap && (
            <MapDirections
              origin={originLocation}
              destination={destinationLocation}
              mapRef={mapRef}
              travelMode={travelMode}
            />
          )}

          {/* Campus mode - Start/End markers */}
          {mode === "campus" && originLocation && coordinatesMap[originLocation]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[originLocation]}
              title="Origin"
              pinColor="green"
            />
          )}

          {mode === "campus" && destinationLocation && coordinatesMap[destinationLocation]?.latitude !== undefined && (
            <Marker
              coordinate={coordinatesMap[destinationLocation]}
              title="Destination"
              pinColor="red"
            />
          )}

          {/* Campus mode - Campus center marker */}
          {mode === "campus" && (
            <Marker
              coordinate={
                activeCampus === "sgw"
                  ? { latitude: sgwRegion.latitude, longitude: sgwRegion.longitude }
                  : { latitude: loyolaRegion.latitude, longitude: loyolaRegion.longitude }
              }
              title={activeCampus === "sgw" ? "SGW Campus" : "Loyola Campus"}
              description="Campus Center"
            />
          )}

          {/* Campus mode - Building polygons */}
          {mode === "campus" && buildings
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
                  <Marker
                    coordinate={center}
                    opacity={0}
                    onPress={() => handleBuildingPress(building)}
                  />
                </Fragment>
              );
            })}

          {/* POI mode - Coffee shop markers */}
          {mode === "poi" && !isListView && showCafes && coffeeShops.map((shop) => {
            const lat = shop.geometry?.location?.lat;
            const lng = shop.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker
                key={shop.place_id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={shop.name}
              >
                <CoffeeMarker />
              </Marker>
            );
          })}

          {/* POI mode - Restaurant markers */}
          {mode === "poi" && !isListView && showRestaurants && restaurants.map((restaurant) => {
            const lat = restaurant.geometry?.location?.lat;
            const lng = restaurant.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker
                key={restaurant.place_id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={restaurant.name}
              >
                <RestaurantMarker />
              </Marker>
            );
          })}

          {/* POI mode - Activity markers */}
          {mode === "poi" && !isListView && showActivities && activities.map((act) => {
            const lat = act.geometry?.location?.lat;
            const lng = act.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker
                key={act.place_id}
                coordinate={{ latitude: lat, longitude: lng }}
                title={act.name}
              >
                <ActivityMarker />
              </Marker>
            );
          })}
        </MapView>
      )}

      {/* Floating Buttons - Common for both modes */}
      
      <View style={styles.buttonContainer}>
        
        
        {mode === "campus" && (
          <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
            <MaterialIcons name="place" size={24} color="white" />
            <Text style={styles.debugText}>
              {activeCampus === "sgw" ? "SGW" : "Loyola"}
            </Text>
          </TouchableOpacity>
        )}
        
        {mode === "poi" && !isListView && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
              <MaterialIcons name="remove" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
              <MaterialIcons name="my-location" size={24} color="white" />
              {showLocating && <Text style={styles.debugText}>Locating...</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Mode-specific buttons */}
      {mode === "campus" && (
        <View style={styles.switchButtonContainer}>
          <TouchableOpacity style={styles.switchButton} onPress={toggleCampus}>
            <Text style={styles.switchButtonText}>Switch Campus</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === "poi" && (
        <TouchableOpacity
          style={styles.listButton}
          onPress={() => setIsListView((prev) => !prev)}
        >
          <MaterialIcons
            name={isListView ? "map" : "list"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* POI mode - Update Results Button */}
      {mode === "poi" && !isListView && showUpdateButton && (
        <View style={styles.updateButtonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => fetchPlacesForRegion(region)}
          >
            <Text style={styles.updateButtonText}>Update Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}

      {/* Modal for Location Permission Denial */}
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
      />
    </View>
  );
};


export default UnifiedMap;
