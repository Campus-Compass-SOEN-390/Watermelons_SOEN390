// src/components/POIOverlay.js
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapMarkers from "./MapMarkers";
import FilterModal from "./FilterModal";
import { CoffeeMarker, RestaurantMarker, ActivityMarker } from "./Markers";
import {
  fetchPOIData,
  updatePOICache,
  getCachedPOIData,
} from "../../api/poiApi";
import { styles } from "../../styles/poiStyles";
import Mapbox from "@rnmapbox/maps";

const REGION_CHANGE_THRESHOLD = 0.005;

const POIOverlay = ({ mapRef, location, region, setRegion }) => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(region);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [error, setError] = useState(null);

  const isFetchingRef = useRef(false);
  const activeRequestRef = useRef(null);

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
      if (now - cachedData.lastFetchTime > 10 * 60 * 1000 && location) {
        console.log("Cache is stale, fetching new POI data");
        handleFetchPlaces({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } else {
        console.log("Using cached POI data");
      }
    }
  }, []);

  // Show update button when region has shifted
  useEffect(() => {
    if (!lastFetchedRegion) return;
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(
      latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD,
    );
  }, [region, lastFetchedRegion]);

  // Initial fetch if no data is loaded
  useEffect(() => {
    const shouldFetch =
      location &&
      !isFetchingRef.current &&
      coffeeShops.length === 0 &&
      restaurants.length === 0 &&
      activities.length === 0;
    if (shouldFetch) {
      console.log("Initial data fetch triggered");
      handleFetchPlaces({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [location, coffeeShops.length, restaurants.length, activities.length]);

  // Unzoom map slightly on mount using setCamera
  useEffect(() => {
    if (mapRef.current) {
      const centerCoordinate = [region.longitude, region.latitude];
      // Adjust zoom level to "unzoom" (e.g., from 15 to 14)
      const unzoomedZoom = 14;
      mapRef.current.setCamera({
        centerCoordinate,
        zoomLevel: unzoomedZoom,
        animationMode: "flyTo",
        animationDuration: 300,
      });
      // Optionally update the region state for caching purposes
      setRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      });
    }
  }, []);

  // Cleanup active requests on unmount
  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  const handleFetchPlaces = async (currentRegion = region) => {
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    setError(null);
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
        setError("Failed to load points of interest. Please try again.");
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      activeRequestRef.current = null;
    }
  };

  // Center the map on the user's location using setCamera
  const centerMapOnUser = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  }, [location]);

  // Further filter points based on distance and selected filters
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
    sortedPoints,
    location,
    distance,
    showCafes,
    showRestaurants,
    showActivities,
  ]);

  return (
    <>
      {showCafes && (
        <MapMarkers data={coffeeShops} MarkerComponent={"CoffeeMarker"} />
      )}
      {showRestaurants && (
        <MapMarkers data={restaurants} MarkerComponent={"Restaurant"} />
      )}
      {showActivities && (
        <MapMarkers data={activities} MarkerComponent={"Activity"} />
      )}

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

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

      {showUpdateButton && (
        <View style={styles.updateButtonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleFetchPlaces(region)}
          >
            <Text style={styles.updateButtonText}>Update Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}
    </>
  );
};

export default POIOverlay;
