import React, { useState, useEffect } from 'react';
import { 
  View, 
Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { fetchPOIData } from '../api/poiApi';
import FilterModal from '../components/POI/FilterModal';
import POIList from '../components/POI/POIList';
import { styles } from '../styles/POIListStyle';

const InterestPoints = () => {
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
  const [distance, setDistance] = useState(2);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);

  // Get user location and load POI data
  useEffect(() => {
    let isMounted = true;
    
    const loadLocationAndData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Getting location permissions...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setError('Location permission denied. Cannot show nearby places.');
            setIsLoading(false);
          }
          return;
        }
        
        console.log("Getting current location...");
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
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
          setError('Failed to get your location or nearby places. Please try again.');
          setIsLoading(false);
        }
      }
    };
    
    loadLocationAndData();
    
    return () => { isMounted = false; };
  }, []);
  
  // Function to fetch POIs
  const fetchPOIs = async (coords) => {
    if (!coords) {
      console.error("No coordinates provided to fetchPOIs");
      setError('Location unavailable. Cannot fetch places.');
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
      
      const result = await fetchPOIData(region, abortController.signal);
      console.log(`POI data fetched: ${result.coffee?.length || 0} cafes, ${result.resto?.length || 0} restaurants, ${result.act?.length || 0} activities`);
      
      setPoiData({
        coffeeShops: result.coffee || [],
        restaurants: result.resto || [],
        activities: result.act || [],
      });
    } catch (err) {
      console.error("Error fetching POI data:", err);
      setError('Failed to load places of interest. Pull down to refresh.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh action
  const handleRefresh = async () => {
    console.log("Refreshing data...");
    setRefreshing(true);
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(coords);
      await fetchPOIs(coords);
    } catch (err) {
      console.error("Error refreshing location:", err);
      setError('Failed to refresh your location.');
      setRefreshing(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const getFilteredData = () => {
    if (!userLocation) return [];
    
    let allPOIs = [];
    
    if (showCafes) {
      allPOIs = [...allPOIs, ...poiData.coffeeShops.map(poi => ({...poi, category: 'cafe'}))]
    }
    if (showRestaurants) {
      allPOIs = [...allPOIs, ...poiData.restaurants.map(poi => ({...poi, category: 'restaurant'}))]
    }
    if (showActivities) {
      allPOIs = [...allPOIs, ...poiData.activities.map(poi => ({...poi, category: 'activity'}))]
    }
    
    return allPOIs.filter(poi => {
      const poiDistance = calculateDistance(
        userLocation.latitude, 
        userLocation.longitude,
        poi.geometry?.location?.lat,
        poi.geometry?.location?.lng
      );
      return poiDistance !== null && poiDistance <= distance;
    }).sort((a, b) => {
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

  const filteredData = getFilteredData();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}></View> {/* Empty space on the left */}
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
        calculateDistance={calculateDistance}
      />

      <FilterModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        distance={distance}
        setDistance={setDistance}
        showCafes={showCafes}
        setShowCafes={setShowCafes}
        showRestaurants={showRestaurants}
        setShowRestaurants={setShowRestaurants}
        showActivities={showActivities}
        setShowActivities={setShowActivities}
      />
    </SafeAreaView>
  );
};

export default InterestPoints;
