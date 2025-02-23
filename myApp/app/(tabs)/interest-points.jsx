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
import Constants from 'expo-constants';


// API key moved to json file
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// --- Custom Marker Components ---
const CoffeeMarker = () => (
  <View style={styles.coffeeMarker}>
    <MaterialCommunityIcons name="coffee" size={20} color="#fff" />
  </View>
);

const RestaurantMarker = () => (
  <View style={styles.restaurantMarker}>
    <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#fff" />
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
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  // Toggle between map view and list view
  const [isListView, setIsListView] = useState(false);

  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(5); // Default distance in km

  // Helper function to calculate distance using the Haversine formula.
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

  const formatDistance = (distance) => {
    if (distance > 1000) {
      return (distance / 1000).toFixed(2) + " km";
    }
    return Math.round(distance) + " m";
  };

  // Helper function to render an icon based on the point's type.
  const renderIconForPoint = (point) => {
    const types = point.types || [];
    if (types.includes("restaurant")) {
      return (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={24}
          color="orange"
        />
      );
    } else if (types.includes("cafe") || point.name.toLowerCase().includes("coffee")) {
      return (
        <MaterialCommunityIcons name="coffee" size={24} color="black" />
      );
    }
    return null;
  };

  // When user location becomes available, update region and fetch places immediately.
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
   * Fetch places (coffee shops & restaurants) for the specified region.
   * Accepts an optional parameter so that we can pass the updated region when needed.
   */
  const fetchPlacesForRegion = async (currentRegion = region) => {
    setLoading(true);
    try {
      const { latitude, longitude } = currentRegion;
      const radius = 2000; // meters
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=coffee|restaurant&key=${GOOGLE_PLACES_API_KEY}`;
      console.debug("Fetching places for region:", currentRegion, "URL:", url);
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        const coffee = [];
        const resto = [];

        data.results.forEach((place) => {
          const types = place.types || [];
          if (types.includes("restaurant")) {
            resto.push(place);
          } else if (
            types.includes("cafe") ||
            place.name.toLowerCase().includes("coffee")
          ) {
            coffee.push(place);
          }
        });

        setCoffeeShops(coffee);
        setRestaurants(resto);
        console.debug(
          `Found ${coffee.length} coffee shops, ${resto.length} restaurants.`
        );
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    // Add a slight delay for consistency.
    await new Promise((resolve) => setTimeout(resolve, 1000));
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

  // Memoize sorted points to avoid recalculating on every render.
  const sortedPoints = useMemo(() => {
    const allPoints = [...coffeeShops, ...restaurants];
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
  }, [coffeeShops, restaurants, location]);

  return (
   <View style={styles.container}>
    <View style={{ marginTop: 40, alignSelf: "flex-end", marginRight: 20 }}></View>
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
            minimumValue={1}
            maximumValue={20}
            step={1}
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
        // List View: Display the points sorted by distance.
        <ScrollView
          style={styles.listViewContainer}
          contentContainerStyle={styles.listContent}
        >
         {sortedPoints
          .filter(
            (point) =>
              (showCafes && point.types?.includes("cafe")) ||
              (showRestaurants && point.types?.includes("restaurant"))
        ).map((point) => {
            const lat = point.geometry?.location?.lat;
            const lng = point.geometry?.location?.lng;
            const distance =
              lat && lng && location
                ? calculateDistance(
                    location.latitude,
                    location.longitude,
                    lat,
                    lng
                  )
                : null;
            return (
              <View style={styles.listItem} key={point.place_id}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {renderIconForPoint(point)}
                  <Text style={[styles.listItemText, { marginLeft: 10 }]}>
                    {point.name}
                  </Text>
                </View>
                {distance !== null && (
                  <Text style={styles.listItemDistance}>
                    {formatDistance(distance)}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        // Map View: Display the map with markers.
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
