import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Modal,
  Switch
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import styles from "../styles/InterestPointsStyles";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";

// API key moved to json file
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// --- Custom Marker Components ---
const CoffeeMarker = () => (
  <View style={[styles.coffeeMarker, { backgroundColor: 'white', padding: 5, borderRadius: 5 }]}>
    <MaterialCommunityIcons name="coffee" size={24} color="black" />
  </View>
);

const RestaurantMarker = () => (
  <View style={[styles.restaurantMarker, { backgroundColor: 'white', padding: 5, borderRadius: 5 }]}>
    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="orange" />
  </View>
);


const ActivityMarker = () => (
  <View style={styles.activityMarker}>
    <MaterialCommunityIcons name="run" size={20} color="#fff" />
  </View>
);

const InterestPoints = () => {
  // Default region centered on SGW (example)
  const defaultRegion = {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const { location, hasPermission } = useLocation();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(defaultRegion);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(defaultRegion);
  const [loading, setLoading] = useState(false);
  const [showLocating, setShowLocating] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  // Toggle between map view and list view
  const [isListView, setIsListView] = useState(false);

  // Filter states
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10); // Maximum distance in km

  // Helper: Calculate distance (in meters) using the Haversine formula.
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

  // Helper: Render an icon based on the point's type.
  const renderIconForPoint = (point) => {
    const types = point.types || [];
    
    // Check for cafes (or coffee) first.
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
  

  // When user location becomes available, update region and fetch places.
  useEffect(() => {
    if (location) {
      console.debug("User location obtained:", location);
      setShowLocating(false);
      const newRegion = {
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setRegion(newRegion);
      fetchPlacesForRegion(newRegion);
    } else {
      console.debug("User location not yet available or permission denied.");
    }
    if (!hasPermission) {
      console.warn("Location permission denied.");
      setShowPermissionPopup(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, hasPermission]);

  // Monitor region changes to conditionally show the update button.
  useEffect(() => {
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    if (latDiff > 0.005 || lngDiff > 0.005) {
      setShowUpdateButton(true);
    } else {
      setShowUpdateButton(false);
    }
  }, [region, lastFetchedRegion]);

  /**
   * Fetch places (coffee shops, restaurants, and activities) for the specified region.
   * Uses pagination with next_page_token to fetch additional results.
   */
  const fetchPlacesForRegion = async (currentRegion = region) => {
    setLoading(true);
    try {
      let allResults = [];
      // Updated keyword: using our activity keywords "tourist", "bowling", "cinema", "theater", "gold"
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|tourist|bowling|cinema|theater|gold&key=${GOOGLE_PLACES_API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();
      allResults = data.results;
      
      // Pagination: fetch additional results if next_page_token is provided.
      while (data.next_page_token) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url);
        data = await response.json();
        allResults = allResults.concat(data.results);
      }
      
      // Process results: split into categories.
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
      console.debug(`Found ${coffee.length} coffee shops, ${resto.length} restaurants, and ${act.length} activities.`);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    setLoading(false);
    setLastFetchedRegion(currentRegion);
    setShowUpdateButton(false);
  };

  /**
   * Centers the map on the user's current location.
   */
  const centerMapOnUser = useCallback(() => {
    if (location && mapRef.current) {
      console.debug("Centering map on user location:", location);
      const updatedRegion = {
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      };
      mapRef.current.animateToRegion(updatedRegion, 1000);
      setRegion(updatedRegion);
    } else {
      console.warn("Cannot center map - user location not available.");
    }
  }, [location, region]);

  /**
   * Zoom in/out functions.
   */
  const handleZoomIn = () => {
    console.debug("Zooming in");
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 2,
      longitudeDelta: prev.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    console.debug("Zooming out");
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
  };

  // Merge and sort all points (coffee shops, restaurants, and activities) by distance.
  const sortedPoints = useMemo(() => {
    const allPoints = [...coffeeShops, ...restaurants, ...activities];
    if (location) {
      return allPoints.sort((a, b) => {
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
      });
    }
    return allPoints;
  }, [coffeeShops, restaurants, activities, location]);

  // Filter points based on selected maximum distance (in km) and type.
  const filteredPoints = useMemo(() => {
    if (!location) return [];
    return sortedPoints.filter((point) => {
      const lat = point.geometry?.location?.lat;
      const lng = point.geometry?.location?.lng;
      if (!lat || !lng) return false;
      // Calculate distance (in meters) from user location.
      const d = calculateDistance(location.latitude, location.longitude, lat, lng);
      if (d > distance * 1000) return false;
      // Determine if the point matches the selected type filters.
      const isCafe = showCafes && point.types?.includes("cafe");
      const isRestaurant = showRestaurants && point.types?.includes("restaurant");
      const isActivity =
        showActivities &&
        (
          point.name.toLowerCase().includes("tourist") ||
          point.name.toLowerCase().includes("bowling") ||
          point.name.toLowerCase().includes("cinema") ||
          point.name.toLowerCase().includes("theater") ||
          point.name.toLowerCase().includes("gold")
        );
      return isCafe || isRestaurant || isActivity;
    });
  }, [sortedPoints, location, distance, showCafes, showRestaurants, showActivities]);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 40, alignSelf: "flex-end", marginRight: 20 }} />
      {isListView && (
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

      {isListView ? (
        // List View: Display points filtered by distance and type.
        <ScrollView
          style={styles.listViewContainer}
          contentContainerStyle={styles.listContent}
        >
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => {
              const lat = point.geometry?.location?.lat;
              const lng = point.geometry?.location?.lng;
              const d =
                lat && lng && location
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
                    onPress={() => {}}
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
        // Map View: Display the map with all markers.
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => {
            setRegion(newRegion);
            console.debug("Map region changed:", newRegion);
          }}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
        >
          {/* Coffee shop markers */}
          {coffeeShops.map((shop) => {
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
          {/* Restaurant markers */}
          {restaurants.map((restaurant) => {
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
          {/* Activity markers */}
          {activities.map((act) => {
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

      {/* Floating Buttons Container */}
      <View style={styles.floatingButtonsContainer}>
        {!isListView && (
          <>
            <TouchableOpacity
              style={styles.centerButton}
              onPress={centerMapOnUser}
            >
              <MaterialIcons name="my-location" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.zoomContainer}>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                <MaterialIcons name="remove" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Toggle Button: Shows "list" icon in map view and "map" icon in list view */}
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
      </View>

      {/* Update Results Button (only visible in Map view) */}
      {!isListView && showUpdateButton && (
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
              onPress={() => {
                console.debug("Closing permission modal.");
                setShowPermissionPopup(false);
              }}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InterestPoints;
