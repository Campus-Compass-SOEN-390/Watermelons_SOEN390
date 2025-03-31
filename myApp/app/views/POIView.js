/**
 * POIView.jsx - View component for Points of Interest
 * 
 * Responsible for rendering the UI and passing user events to the controller.
 * Implements View in MVC architecture.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import POIController from '../controllers/POIController';
import FilterModal from '../components/POI/FilterModal';
import POIList from '../components/POI/POIList';
import { styles } from '../styles/POIListStyle';

const POIView = () => {
  // UI state
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

  // Filter states - these are kept in the view for UI binding, but controller manages actual logic
  const [distance, setDistance] = useState(40);
  const [useDistance, setUseDistance] = useState(false);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  /**
   * Subscribe to POI data changes using the controller
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
    
    // Subscribe this component as an observer via the controller
    const unsubscribe = POIController.subscribeToPOIData(updatePOIData);
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  /**
   * Initialize data using the controller
   */
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize data using the controller
        const location = await POIController.initializeData();
        
        if (!isMounted) return;
        
        setUserLocation(location);
      } catch (err) {
        console.error("Error in initialization:", err);
        if (isMounted) {
          setError('Failed to get your location or nearby places. Please try again.');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => { isMounted = false; };
  }, []);

  /**
   * Handle refresh action - delegates to controller
   */
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const location = await POIController.refreshData();
      setUserLocation(location);
    } catch (err) {
      console.error("Error refreshing location:", err);
      setError('Failed to refresh your location.');
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Apply filter settings - updates controller and UI state
   */
  const applyFilterSettings = () => {
    POIController.updateFilterSettings({
      distance,
      useDistance,
      showCafes,
      showRestaurants,
      showActivities
    });
  };

  /**
   * Handle filter modal close - applies the filters
   */
  const handleFilterModalClose = () => {
    setFilterModalVisible(false);
    applyFilterSettings();
  };

  /**
   * Get filtered data from the controller
   */
  const filteredData = POIController.getFilteredData(poiData);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <POIList
        data={filteredData}
        userLocation={userLocation}
        isLoading={isLoading}
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        calculateDistance={(lat1, lon1, lat2, lon2) => 
          POIController.calculateDistance(lat1, lon1, lat2, lon2)
        }
      />

      <FilterModal
        isVisible={filterModalVisible}
        onClose={handleFilterModalClose}
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
    </SafeAreaView>
  );
};

export default POIView;
