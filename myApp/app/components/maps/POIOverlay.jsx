import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, TouchableOpacity, Text, Modal, ActivityIndicator, ScrollView, Switch, Alert } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";
import styles from "../../styles/UnifiedMapStyles";

// API key for Google Places
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Cache timeout (10 minutes)
const CACHE_TIMEOUT = 10 * 60 * 1000;

// Threshold for determining when to show the update button (in degrees)
const REGION_CHANGE_THRESHOLD = 0.005;

// Global in-memory cache for POI data
// This will persist as long as the JS context is alive (within the app session)
const POI_CACHE = {
  coffeeShops: [],
  restaurants: [],
  activities: [],
  lastRegion: null,
  lastFetchTime: 0,
};

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

const POIOverlay = ({ mapRef, location, region, setRegion }) => {
  // Points of interest states
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(region);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [renderMap, setRenderMap] = useState(false);
  const [error, setError] = useState(null);
  
  // Use refs for the scroll view and to track fetch status
  const scrollViewRef = useRef(null);
  const isFetchingRef = useRef(false);
  const activeRequestRef = useRef(null);

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

  // Load POI data from in-memory cache on component mount
  useEffect(() => {
    const loadCachedData = () => {
      // Check if we have cached data
      if (POI_CACHE.coffeeShops.length > 0 || 
          POI_CACHE.restaurants.length > 0 || 
          POI_CACHE.activities.length > 0) {
        
        // Set the data from cache
        setCoffeeShops(POI_CACHE.coffeeShops);
        setRestaurants(POI_CACHE.restaurants);
        setActivities(POI_CACHE.activities);
        
        if (POI_CACHE.lastRegion) {
          setLastFetchedRegion(POI_CACHE.lastRegion);
        }
        
        // Check if cache is still valid
        const now = Date.now();
        
        if (now - POI_CACHE.lastFetchTime > CACHE_TIMEOUT) {
          // Cache is stale, trigger a new fetch if we have location
          if (location) {
            console.log("Cache is stale, fetching new POI data");
            fetchPlacesForRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        } else {
          console.log("Using cached POI data");
        }
      }
    };
    
    loadCachedData();
  }, []);

  // Effect to monitor region changes for POI update button
  useEffect(() => {
    if (!lastFetchedRegion) return;
    
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    
    if (latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD) {
      setShowUpdateButton(true);
    } else {
      setShowUpdateButton(false);
    }
  }, [region, lastFetchedRegion]);

  // Initial fetch when location is available and we don't have data
  useEffect(() => {
    const shouldFetch = location && 
                        !isFetchingRef.current && 
                        coffeeShops.length === 0 && 
                        restaurants.length === 0 && 
                        activities.length === 0;
    
    if (shouldFetch) {
      console.log("Initial data fetch triggered");
      fetchPlacesForRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [location, coffeeShops.length, restaurants.length, activities.length]);

  // Effect to unzoom when entering POI mode
  useEffect(() => {
    if (mapRef.current) {
      // Unzoom by increasing delta values (2x wider view)
      const currentRegion = mapRef.current.__lastRegion || region;
      const unzoomedRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: currentRegion.latitudeDelta * 2,
        longitudeDelta: currentRegion.longitudeDelta * 2
      };
      
      // Animate to the new zoomed-out region
      mapRef.current.animateToRegion(unzoomedRegion, 300);
      
      // Update the region state
      setRegion(unzoomedRegion);
    }
  }, []);

  // Effect to handle map initial state based on list view
  useEffect(() => {
    if (!isListView && mapRef.current) {
      // When switching to map view, ensure the map is properly rendered
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...region,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          }, 10);
        }
      }, 100);
    }
  }, [isListView]);

  // Cleanup ScrollView when component unmounts
  useEffect(() => {
    return () => {
      // Ensure ScrollView is cleaned up properly on unmount
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }
      
      // Cancel any ongoing fetch
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  // Save POI data to in-memory cache
  const updatePOICache = (coffee, resto, act, regionData) => {
    POI_CACHE.coffeeShops = coffee;
    POI_CACHE.restaurants = resto;
    POI_CACHE.activities = act;
    POI_CACHE.lastRegion = regionData;
    POI_CACHE.lastFetchTime = Date.now();
    console.log("POI data cached in memory");
  };

  // Fetch POIs from Google Places API with improved implementation
  const fetchPlacesForRegion = async (currentRegion = region) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    // Reset error state
    setError(null);
    
    // Set loading state and fetch status
    setLoading(true);
    isFetchingRef.current = true;
    
    // Create an AbortController for the request
    const controller = new AbortController();
    activeRequestRef.current = controller;
    
    try {
      // First fetch attempt with broader types
      let allResults = [];
      const signal = controller.signal;
      
      // Use a more targeted search with multiple types for better results
      const types = ["cafe", "restaurant", "tourist_attraction", "movie_theater"];
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&type=${types.join('|')}&key=${GOOGLE_PLACES_API_KEY}`;
      
      let response = await fetch(url, { signal });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      let data = await response.json();
      
      if (data.status === "ZERO_RESULTS") {
        // If no results, try a keyword search as fallback
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|cinema|tourist&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url, { signal });
        data = await response.json();
      }
      
      if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
        throw new Error(`API request denied: ${data.error_message || "Unknown error"}`);
      }
      
      allResults = data.results || [];
      
      // Fetch next pages if available (max 2 additional pages to avoid rate limits)
      let pageCount = 0;
      while (data.next_page_token && pageCount < 2) {
        // Google requires a delay between page token requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (signal.aborted) {
          throw new Error("Request was aborted");
        }
        
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url, { signal });
        data = await response.json();
        
        if (data.results) {
          allResults = [...allResults, ...data.results];
        }
        
        pageCount++;
      }
      
      // Process results: split into categories
      const coffee = [];
      const resto = [];
      const act = [];
      
      // Pre-filter and deduplicate results based on place_id
      const seenPlaceIds = new Set();
      
      allResults.forEach(place => {
        // Skip if we've already processed this place
        if (seenPlaceIds.has(place.place_id)) return;
        seenPlaceIds.add(place.place_id);
        
        const name = place.name.toLowerCase();
        const types = place.types || [];
        
        // Categorize the place
        if (types.includes("restaurant") || types.includes("meal_takeaway") || types.includes("meal_delivery")) {
          resto.push(place);
        } else if (types.includes("cafe") || name.includes("coffee") || types.includes("bakery")) {
          coffee.push(place);
        } else if (
          types.includes("tourist_attraction") || 
          types.includes("movie_theater") || 
          types.includes("amusement_park") ||
          types.includes("museum") ||
          name.includes("tourist") ||
          name.includes("bowling") ||
          name.includes("cinema") ||
          name.includes("theater") ||
          name.includes("museum") ||
          name.includes("attraction")
        ) {
          act.push(place);
        }
      });
      
      // Update state with new data
      setCoffeeShops(coffee);
      setRestaurants(resto);
      setActivities(act);
      
      // Update in-memory cache
      updatePOICache(coffee, resto, act, currentRegion);
      
      // Update the last fetched region
      setLastFetchedRegion(currentRegion);
      setShowUpdateButton(false);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
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

  // Zoom functions
  const handleZoomIn = () => {
    if (!mapRef.current) return;
    
    try {
      // Get the current region from the map or use the state region as fallback
      const currentRegion = mapRef.current.region || region;
      
      // Calculate new zoom level (smaller delta = more zoom)
      // Use a divisor of 1.5 for smoother zoom
      const newRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: currentRegion.latitudeDelta / 1.5,
        longitudeDelta: currentRegion.longitudeDelta / 1.5,
      };
      
      // Add a lower limit to prevent zooming in too far
      if (newRegion.latitudeDelta < 0.0001) {
        newRegion.latitudeDelta = 0.0001;
        newRegion.longitudeDelta = 0.0001;
      }
      
      // Animate to the new zoomed-in region
      mapRef.current.animateToRegion(newRegion, 300);
      
      // Update the region state
      setRegion(newRegion);
    } catch (error) {
      console.error("Error zooming in:", error);
    }
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    
    try {
      // Get the current region from the map or use the state region as fallback
      const currentRegion = mapRef.current.region || region;
      
      // Calculate new zoom level (larger delta = less zoom)
      // Use a multiplier of 1.5 for smoother zoom
      const newRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: currentRegion.latitudeDelta * 1.5,
        longitudeDelta: currentRegion.longitudeDelta * 1.5,
      };
      
      // Add an upper limit to prevent zooming out too far
      if (newRegion.latitudeDelta > 50) {
        newRegion.latitudeDelta = 50;
        newRegion.longitudeDelta = 50;
      }
      
      // Animate to the new zoomed-out region
      mapRef.current.animateToRegion(newRegion, 300);
      
      // Update the region state
      setRegion(newRegion);
    } catch (error) {
      console.error("Error zooming out:", error);
    }
  };

  // Filter and sort POIs - optimized with useMemo
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
      
      const types = point.types || [];
      const name = point.name.toLowerCase();
      
      const isCafe = showCafes && (types.includes("cafe") || name.includes("coffee") || types.includes("bakery"));
      const isRestaurant = showRestaurants && (types.includes("restaurant") || types.includes("meal_takeaway") || types.includes("meal_delivery"));
      const isActivity = showActivities && (
        types.includes("tourist_attraction") || 
        types.includes("movie_theater") || 
        types.includes("amusement_park") ||
        types.includes("museum") ||
        name.includes("tourist") ||
        name.includes("bowling") ||
        name.includes("cinema") ||
        name.includes("theater") ||
        name.includes("museum") ||
        name.includes("attraction")
      );
      
      return isCafe || isRestaurant || isActivity;
    });
  }, [sortedPoints, location, distance, showCafes, showRestaurants, showActivities]);

  // Render the list view for POIs
  const renderListView = () => {
    return (
      <View style={styles.listViewOuter}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => fetchPlacesForRegion(region)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.listViewContainer}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
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
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      {d !== null && (
                        <Text style={styles.listItemDistance}>
                          {formatDistance(d)}
                        </Text>
                      )}
                      {point.rating && (
                        <Text style={[styles.listItemDistance, { marginLeft: 10 }]}>
                          ★ {point.rating.toFixed(1)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
                      }
                      setIsListView(false);
                      setOriginLocation("My Position");
                      setDestinationLocation({ latitude: lat, longitude: lng });
                      setRenderMap(true);
                    }}
                    style={styles.directionsButton}
                  >
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ textAlign: "center" }}>
                Loading points of interest...
              </Text>
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ textAlign: "center", marginBottom: 15 }}>
                No points match the selected filters.
              </Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => fetchPlacesForRegion(region)}
              >
                <Text style={styles.updateButtonText}>Refresh Points</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // Toggle between list and map view with proper cleanup
  const toggleListView = () => {
    setIsListView((prev) => {
      // When switching from list to map, ensure the ScrollView is properly cleaned up
      if (prev && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }
      return !prev;
    });
  };

  return (
    <>
      {/* Render list view or map markers based on isListView */}
      {isListView ? (
        renderListView()
      ) : (
        <>
          {/* POI markers on map */}
          {showCafes && coffeeShops.map((shop) => {
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

          {showRestaurants && restaurants.map((restaurant) => {
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

          {showActivities && activities.map((act) => {
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
        </>
      )}

      {/* Filter button */}
      {!isListView && (
        <View style={{ marginTop: 0, alignSelf: "flex-end", marginRight: 20}} />
      )}
      
      {isListView && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
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

      {/* Floating controls */}
      <View style={styles.buttonContainer}>
        {!isListView && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
              <MaterialIcons name="remove" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={centerMapOnUser}>
              <MaterialIcons name="my-location" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* List/Map toggle button */}
      <TouchableOpacity
        style={styles.listButton}
        onPress={toggleListView}
      >
        <MaterialIcons
          name={isListView ? "map" : "list"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      {/* Update Results Button */}
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
    </>
  );
};

export default POIOverlay;
