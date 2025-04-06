import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  fetchPOIData,
  poiDataSubject,
  shouldUpdatePOIData,
  loadPOICache,
  precomputeDistances,
} from "../api/poiApi";
import FilterModal from "../components/POI/FilterModal";
import POIList from "../components/POI/POIList";
import { createPOIListStyles } from "../styles/POIListStyle";
import { useButtonInteraction } from "../hooks/useButtonInteraction";
import { ThemeContext } from "../context/ThemeContext";

/**
 * InterestPoints component - Displays a list of POIs
 *
 * This component implements the Observer pattern by subscribing to
 * the poiDataSubject and updating its state when the data changes.
 */
const InterestPoints = () => {
  // Get theme context
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Create theme-aware styles
  const themeStyles = createPOIListStyles({
    isDarkMode,
    theme: {
      background: isDarkMode ? "#333333" : "#FFFFFF",
      cardBackground: isDarkMode ? "#242424" : "#FFFFFF",
      buttonBackground: "#922338",
      text: isDarkMode ? "#FFFFFF" : "#333333",
      subText: isDarkMode ? "#CCCCCC" : "#666666",
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [poiData, setPoiData] = useState({
    coffeeShops: [],
    restaurants: [],
    activities: [],
  });
  const [userLocation, setUserLocation] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Filter states
  const [distance, setDistance] = useState(40); // Changed from 2 to 40 km
  const [useDistance, setUseDistance] = useState(false);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  const { handleButtonPress } = useButtonInteraction();

  /**
   * Subscribe to POI data changes (Observer pattern)
   * This makes the POIList component an observer of POIDataSubject
   */
  useEffect(() => {
    // Observer callback function that will be called when data changes
    const updatePOIData = (data, isLoading) => {
      // Only update with precomputed distances if we have user location
      if (userLocation) {
        setPoiData({
          coffeeShops: precomputeDistances(data.coffeeShops, userLocation),
          restaurants: precomputeDistances(data.restaurants, userLocation),
          activities: precomputeDistances(data.activities, userLocation),
        });
      } else {
        setPoiData({
          coffeeShops: data.coffeeShops,
          restaurants: data.restaurants,
          activities: data.activities,
        });
      }

      setIsLoading(isLoading);

      // If data is not empty, mark as loaded
      if (
        data.coffeeShops.length > 0 ||
        data.restaurants.length > 0 ||
        data.activities.length > 0
      ) {
        setDataLoaded(true);
      }
    };

    // Subscribe this component as an observer
    const unsubscribe = poiDataSubject.subscribe(updatePOIData);

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
      // Also abort any in-progress fetch
      if (abortController) {
        abortController.abort();
      }
    };
  }, [userLocation]);

  // Load cached data first, then get fresh location and update if needed
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        // Try to load cached data immediately
        const cachedData = await loadPOICache();
        if (cachedData && isMounted) {
          console.log("Using cached POI data for initial render");
          setDataLoaded(true);
        }
      } catch (err) {
        console.error("Error loading cached POI data:", err);
      }

      // Get location and update data regardless of cache
      if (isMounted) {
        getLocationAndUpdatePOIs();
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get user location and load POI data if needed
  const getLocationAndUpdatePOIs = async () => {
    setError(null);

    try {
      console.log("Getting location permissions...");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied. Cannot show nearby places.");
        setIsLoading(false);
        return;
      }

      console.log("Getting current location...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log("Location obtained:", coords);
      setUserLocation(coords);

      // Only fetch if needed (either no data, region changed, or cache expired)
      const region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      if (shouldUpdatePOIData(region)) {
        // Cancel any existing fetch
        if (abortController) {
          abortController.abort();
        }

        // Create new abort controller for this fetch
        const controller = new AbortController();
        setAbortController(controller);

        // Get only the POI types enabled by filters
        const typesToFetch = [];
        if (showCafes) typesToFetch.push("cafe");
        if (showRestaurants) typesToFetch.push("restaurant");
        if (showActivities) typesToFetch.push("attraction");

        await fetchPOIs(coords, controller.signal, typesToFetch);
      } else {
        // If using cache, still precompute distances with new user location
        const currentData = poiDataSubject.getData();
        setPoiData({
          coffeeShops: precomputeDistances(currentData.coffeeShops, coords),
          restaurants: precomputeDistances(currentData.restaurants, coords),
          activities: precomputeDistances(currentData.activities, coords),
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error in location and data loading:", err);
      setError(
        "Failed to get your location or nearby places. Please try again."
      );
      setIsLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Debounce filters to prevent constant recalculation
  useEffect(() => {
    // If filters change and we already have data, update with precomputed distances
    if (dataLoaded && userLocation) {
      const currentData = poiDataSubject.getData();
      setPoiData({
        coffeeShops: precomputeDistances(currentData.coffeeShops, userLocation),
        restaurants: precomputeDistances(currentData.restaurants, userLocation),
        activities: precomputeDistances(currentData.activities, userLocation),
      });
    }
  }, [
    distance,
    useDistance,
    showCafes,
    showRestaurants,
    showActivities,
    dataLoaded,
    userLocation,
  ]);

  // Function to fetch POIs
  const fetchPOIs = async (coords, signal, typesToFetch) => {
    if (!coords) {
      console.error("No coordinates provided to fetchPOIs");
      setError("Location unavailable. Cannot fetch places.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching POI data for", coords);

      const region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // This will update the POIDataSubject which will notify all observers
      await fetchPOIData(region, signal, typesToFetch);
      console.log("POI data fetched and observers notified");

      // Error state is reset as data has loaded successfully
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("POI fetch was aborted");
      } else {
        console.error("Error fetching POI data:", err);
        setError("Failed to load places of interest. Pull down to refresh.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Memoized function to get filtered POIs (improves performance)
  const getFilteredData = useCallback(() => {
    if (!userLocation) return [];

    let allPOIs = [];

    if (showCafes) {
      allPOIs = [
        ...allPOIs,
        ...poiData.coffeeShops.map((poi) => ({
          ...poi,
          category: "cafe",
          // Create a unique key by prefixing the place_id with the category
          uniqueKey: `cafe-${poi.place_id || Math.random().toString()}`,
        })),
      ];
    }
    if (showRestaurants) {
      allPOIs = [
        ...allPOIs,
        ...poiData.restaurants.map((poi) => ({
          ...poi,
          category: "restaurant",
          uniqueKey: `restaurant-${poi.place_id || Math.random().toString()}`,
        })),
      ];
    }
    if (showActivities) {
      allPOIs = [
        ...allPOIs,
        ...poiData.activities.map((poi) => ({
          ...poi,
          category: "activity",
          uniqueKey: `activity-${poi.place_id || Math.random().toString()}`,
        })),
      ];
    }

    // Use pre-computed distances from the precomputeDistances function
    // This is much faster than recalculating distances for every filter change
    if (useDistance) {
      return allPOIs
        .filter((poi) => poi._distance !== null && poi._distance <= distance)
        .sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
    }

    // If useDistance is false, return all POIs still sorted by distance
    return allPOIs.sort(
      (a, b) => (a._distance || Infinity) - (b._distance || Infinity)
    );
  }, [
    poiData,
    userLocation,
    distance,
    useDistance,
    showCafes,
    showRestaurants,
    showActivities,
  ]);

  // Handle refresh action
  const handleRefresh = async () => {
    console.log("Refreshing data...");
    handleButtonPress(null, "Refreshing nearby places");
    setRefreshing(true);

    // Clear error state on refresh
    setError(null);

    // Get a fresh location and update POIs
    getLocationAndUpdatePOIs();
  };

  const handleFilterClose = () => {
    handleButtonPress(null, "Closing filters menu");
    setFilterModalVisible(false);
  };

  const filteredData = getFilteredData();

  // Show placeholder message while waiting for location
  const renderPlaceholder = () => {
    if (isLoading && !dataLoaded) {
      return (
        <View style={themeStyles.placeholderContainer}>
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#FFFFFF" : "#0066cc"}
          />
          <Text style={themeStyles.placeholderText}>
            Getting nearby places...
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      }}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#333333" : "#FFFFFF"}
      />

      {/* Header with buttons */}

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
        }}
      >
        <View
          style={[
            themeStyles.headerContainer,
            { backgroundColor: isDarkMode ? "#333333" : "#FFFFFF" },
          ]}
        >
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity
            style={themeStyles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={18} color="white" />
            <Text style={themeStyles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {renderPlaceholder()}

        <POIList
          data={filteredData}
          userLocation={userLocation}
          isLoading={isLoading && !dataLoaded} // Show loading only if no cached data
          error={error}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          calculateDistance={(lat1, lon1, lat2, lon2) => {
            // Use precomputed distance if available
            const poi = filteredData.find(
              (p) =>
                p.geometry?.location?.lat === lat2 &&
                p.geometry?.location?.lng === lon2
            );
            if (poi && poi._distance !== undefined) {
              return poi._distance;
            }

            // Fallback calculation (should rarely be needed)
            if (!lat1 || !lon1 || !lat2 || !lon2) return null;

            const R = 6371; // Radius of the earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
          }}
        />

        <FilterModal
          isVisible={filterModalVisible}
          onClose={handleFilterClose}
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
          isDarkMode={isDarkMode}
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
};

export default InterestPoints;
