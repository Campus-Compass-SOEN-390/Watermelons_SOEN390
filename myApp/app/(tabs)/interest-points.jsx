import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { fetchPOIData, poiDataSubject } from "../api/poiApi";
import FilterModal from "../components/POI/FilterModal";
import POIList from "../components/POI/POIList";
import { styles, createPOIListStyles } from "../styles/POIListStyle";
import { ThemeContext } from "../context/ThemeContext";
import HeaderButtons from "../components/HeaderButtons";
import { useButtonInteraction } from "../hooks/useButtonInteraction";

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
  const themeStyles = createPOIListStyles({ theme, isDarkMode });

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
      setPoiData({
        coffeeShops: data.coffeeShops,
        restaurants: data.restaurants,
        activities: data.activities,
      });
      setIsLoading(isLoading);
    };

    // Subscribe this component as an observer
    const unsubscribe = poiDataSubject.subscribe(updatePOIData);

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Get user location and load POI data
  useEffect(() => {
    let isMounted = true;

    const loadLocationAndData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Getting location permissions...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setError("Location permission denied. Cannot show nearby places.");
            setIsLoading(false);
          }
          return;
        }

        console.log("Getting current location...");
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;

        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log("Location obtained:", coords);
        setUserLocation(coords);

        // Always fetch fresh data from current location
        await fetchPOIs(coords);
      } catch (err) {
        console.error("Error in location and data loading:", err);
        if (isMounted) {
          setError(
            "Failed to get your location or nearby places. Please try again."
          );
          setIsLoading(false);
        }
      }
    };

    loadLocationAndData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to fetch POIs
  const fetchPOIs = async (coords) => {
    if (!coords) {
      console.error("No coordinates provided to fetchPOIs");
      setError("Location unavailable. Cannot fetch places.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching POI data for", coords);
      const abortController = new AbortController();

      const region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // This will update the POIDataSubject which will notify all observers
      await fetchPOIData(region, abortController.signal);
      console.log("POI data fetched and observers notified");

      // Error state is reset as data has loaded successfully
      setError(null);
    } catch (err) {
      console.error("Error fetching POI data:", err);
      setError("Failed to load places of interest. Pull down to refresh.");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle refresh action
  const handleRefresh = async () => {
    console.log("Refreshing data...");
    handleButtonPress(null, "Refreshing nearby places");
    setRefreshing(true);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);
      await fetchPOIs(coords);
    } catch (err) {
      console.error("Error refreshing location:", err);
      setError("Failed to refresh your location.");
      setRefreshing(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getFilteredData = () => {
    if (!userLocation) return [];

    let allPOIs = [];

    if (showCafes) {
      allPOIs = [
        ...allPOIs,
        ...poiData.coffeeShops.map((poi) => ({ ...poi, category: "cafe" })),
      ];
    }
    if (showRestaurants) {
      allPOIs = [
        ...allPOIs,
        ...poiData.restaurants.map((poi) => ({
          ...poi,
          category: "restaurant",
        })),
      ];
    }
    if (showActivities) {
      allPOIs = [
        ...allPOIs,
        ...poiData.activities.map((poi) => ({ ...poi, category: "activity" })),
      ];
    }

    // Only filter by distance if useDistance is true
    if (useDistance) {
      return allPOIs
        .filter((poi) => {
          const poiDistance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            poi.geometry?.location?.lat,
            poi.geometry?.location?.lng
          );
          return poiDistance !== null && poiDistance <= distance;
        })
        .sort((a, b) => {
          const distA = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            a.geometry?.location?.lat,
            a.geometry?.location?.lng
          );
          const distB = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            b.geometry?.location?.lat,
            b.geometry?.location?.lng
          );
          return distA - distB;
        });
    }

    // If useDistance is false, return all POIs, still sorted by distance
    return allPOIs.sort((a, b) => {
      const distA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.geometry?.location?.lat,
        a.geometry?.location?.lng
      );
      const distB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.geometry?.location?.lat,
        b.geometry?.location?.lng
      );
      return distA - distB;
    });
  };

  const handleFilterPress = () => {
    handleButtonPress(null, "Opening filters menu");
    setFilterModalVisible(true);
  };

  const handleFilterClose = () => {
    handleButtonPress(null, "Closing filters menu");
    setFilterModalVisible(false);
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView style={themeStyles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? theme.background : "#fff"}
      />
      <View style={themeStyles.headerContainer}>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity
          style={themeStyles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="white" />
          <Text style={themeStyles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <POIList
        data={filteredData}
        userLocation={userLocation}
        isLoading={isLoading}
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        calculateDistance={calculateDistance}
        themeStyles={themeStyles}
        isDarkMode={isDarkMode}
        theme={theme}
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
  );
};

export default InterestPoints;
