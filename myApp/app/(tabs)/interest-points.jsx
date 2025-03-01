import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import styles from "../styles/InterestPointsStyles"; // Assuming this file exists
import Slider from "@react-native-community/slider";
import Constants from "expo-constants";

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// --- Custom Marker Components for InterestPoints ---
const CoffeeMarker = () => (
  <View style={[styles.coffeeMarker, { backgroundColor: "white", padding: 5, borderRadius: 5 }]}>
    <MaterialCommunityIcons name="coffee" size={24} color="black" />
  </View>
);

const RestaurantMarker = () => (
  <View style={[styles.restaurantMarker, { backgroundColor: "white", padding: 5, borderRadius: 5 }]}>
    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="orange" />
  </View>
);

const ActivityMarker = () => (
  <View style={styles.activityMarker}>
    <MaterialCommunityIcons name="run" size={20} color="green" />
  </View>
);

// --- Custom Marker for OutdoorMap (Placeholder) ---
const ParkMarker = () => (
  <View style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="tree" size={24} color="green" />
  </View>
);

// --- InterestPoints Component ---
const InterestPoints = () => {
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
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [showCafes, setShowCafes] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);

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

  const formatDistance = (d) => {
    if (d > 1000) return (d / 1000).toFixed(2) + " km";
    return Math.round(d) + " m";
  };

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

  useEffect(() => {
    if (location) {
      const newRegion = { ...region, latitude: location.latitude, longitude: location.longitude };
      setRegion(newRegion);
      fetchPlacesForRegion(newRegion);
    }
    if (!hasPermission) setShowPermissionPopup(true);
  }, [location, hasPermission]);

  useEffect(() => {
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(latDiff > 0.005 || lngDiff > 0.005);
  }, [region, lastFetchedRegion]);

  const fetchPlacesForRegion = async (currentRegion = region) => {
    setLoading(true);
    try {
      let allResults = [];
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|tourist|bowling|cinema|theater|gold&key=${GOOGLE_PLACES_API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();
      allResults = data.results;

      while (data.next_page_token) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url);
        data = await response.json();
        allResults = allResults.concat(data.results);
      }

      const coffee = [];
      const resto = [];
      const act = [];
      allResults.forEach((place) => {
        const name = place.name.toLowerCase();
        const types = place.types || [];
        if (types.includes("restaurant")) resto.push(place);
        else if (types.includes("cafe") || name.includes("coffee")) coffee.push(place);
        else if (
          name.includes("tourist") ||
          name.includes("bowling") ||
          name.includes("cinema") ||
          name.includes("theater") ||
          name.includes("gold")
        )
          act.push(place);
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

  const centerMapOnUser = useCallback(() => {
    if (location && mapRef.current) {
      const updatedRegion = { ...region, latitude: location.latitude, longitude: location.longitude };
      mapRef.current.animateToRegion(updatedRegion, 1000);
      setRegion(updatedRegion);
    }
  }, [location, region]);

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

  const sortedPoints = useMemo(() => {
    const allPoints = [...coffeeShops, ...restaurants, ...activities];
    if (location) {
      return allPoints.sort((a, b) => {
        const aLat = a.geometry?.location?.lat;
        const aLng = a.geometry?.location?.lng;
        const bLat = b.geometry?.location?.lat;
        const bLng = b.geometry?.location?.lng;
        const aDistance = aLat && aLng ? calculateDistance(location.latitude, location.longitude, aLat, aLng) : Infinity;
        const bDistance = bLat && bLng ? calculateDistance(location.latitude, location.longitude, bLat, bLng) : Infinity;
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
      const isCafe = showCafes && point.types?.includes("cafe");
      const isRestaurant = showRestaurants && point.types?.includes("restaurant");
      const isActivity =
        showActivities &&
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
      {isListView && (
        <>
          <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterModalVisible(true)}>
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
          <Modal
            visible={isFilterModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsFilterModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Options</Text>
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
        <ScrollView style={styles.listViewContainer} contentContainerStyle={styles.listContent}>
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => {
              const lat = point.geometry?.location?.lat;
              const lng = point.geometry?.location?.lng;
              const d = lat && lng && location ? calculateDistance(location.latitude, location.longitude, lat, lng) : null;
              return (
                <View
                  key={point.place_id}
                  style={[styles.listItem, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {renderIconForPoint(point)}
                      <Text style={[styles.listItemText, { marginLeft: 10, marginRight: 40 }]}>{point.name}</Text>
                    </View>
                    {d !== null && <Text style={styles.listItemDistance}>{formatDistance(d)}</Text>}
                  </View>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{ backgroundColor: "#922338", padding: 8, borderRadius: 4 }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>No points match the selected filters.</Text>
          )}
        </ScrollView>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
        >
          {coffeeShops.map((shop) => {
            const lat = shop.geometry?.location?.lat;
            const lng = shop.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={shop.place_id} coordinate={{ latitude: lat, longitude: lng }} title={shop.name}>
                <CoffeeMarker />
              </Marker>
            );
          })}
          {restaurants.map((restaurant) => {
            const lat = restaurant.geometry?.location?.lat;
            const lng = restaurant.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={restaurant.place_id} coordinate={{ latitude: lat, longitude: lng }} title={restaurant.name}>
                <RestaurantMarker />
              </Marker>
            );
          })}
          {activities.map((act) => {
            const lat = act.geometry?.location?.lat;
            const lng = act.geometry?.location?.lng;
            if (!lat || !lng) return null;
            return (
              <Marker key={act.place_id} coordinate={{ latitude: lat, longitude: lng }} title={act.name}>
                <ActivityMarker />
              </Marker>
            );
          })}
        </MapView>
      )}
      <View style={styles.floatingButtonsContainer}>
        {!isListView && (
          <>
            <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
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
        <TouchableOpacity style={styles.listButton} onPress={() => setIsListView((prev) => !prev)}>
          <MaterialIcons name={isListView ? "map" : "list"} size={24} color="white" />
        </TouchableOpacity>
      </View>
      {!isListView && showUpdateButton && (
        <View style={styles.updateButtonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={() => fetchPlacesForRegion(region)}>
            <Text style={styles.updateButtonText}>Update Results</Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Permission Denied</Text>
            <Text style={styles.modalText}>
              Location access is required to show your current location on the map. Please enable location permissions in your settings.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPermissionPopup(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- OutdoorMap Component (Placeholder) ---
const OutdoorMap = () => {
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
  const [showPermissionPopup, setShowPermissionPopup] = useState(!hasPermission);
  const [parks, setParks] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    if (location) {
      const newRegion = { ...region, latitude: location.latitude, longitude: location.longitude };
      setRegion(newRegion);
      fetchOutdoorPlaces(newRegion);
    }
    if (!hasPermission) setShowPermissionPopup(true);
  }, [location, hasPermission]);

  useEffect(() => {
    const latDiff = Math.abs(region.latitude - lastFetchedRegion.latitude);
    const lngDiff = Math.abs(region.longitude - lastFetchedRegion.longitude);
    setShowUpdateButton(latDiff > 0.005 || lngDiff > 0.005);
  }, [region, lastFetchedRegion]);

  const fetchOutdoorPlaces = async (currentRegion = region) => {
    setLoading(true);
    try {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&type=park&key=${GOOGLE_PLACES_API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();
      setParks(data.results);
    } catch (error) {
      console.error("Error fetching outdoor places:", error);
    }
    setLoading(false);
    setLastFetchedRegion(currentRegion);
    setShowUpdateButton(false);
  };

  const centerMapOnUser = useCallback(() => {
    if (location && mapRef.current) {
      const updatedRegion = { ...region, latitude: location.latitude, longitude: location.longitude };
      mapRef.current.animateToRegion(updatedRegion, 1000);
      setRegion(updatedRegion);
    }
  }, [location, region]);

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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
        showsPointsOfInterest={false}
        showsBuildings={false}
      >
        {parks.map((park) => {
          const lat = park.geometry?.location?.lat;
          const lng = park.geometry?.location?.lng;
          if (!lat || !lng) return null;
          return (
            <Marker key={park.place_id} coordinate={{ latitude: lat, longitude: lng }} title={park.name}>
              <ParkMarker />
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
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
      </View>
      {showUpdateButton && (
        <View style={styles.updateButtonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={() => fetchOutdoorPlaces(region)}>
            <Text style={styles.updateButtonText}>Update Results</Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}
      <Modal visible={showPermissionPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Permission Denied</Text>
            <Text style={styles.modalText}>
              Location access is required to show your current location on the map. Please enable location permissions in your settings.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPermissionPopup(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- FeatureSwitcher Component ---
const FeatureSwitcher = () => {
  const [feature, setFeature] = useState("interestPoints");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          marginTop: 0,  
          backgroundColor: "#f0f0f0", // Optional: light background for contrast
        }}
      >
        <Text style={{ marginRight: 10, fontSize: 16 }}>Interest Points</Text>
        <Switch
          value={feature === "outdoorMap"}
          onValueChange={(value) => setFeature(value ? "outdoorMap" : "interestPoints")}
        />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>Outdoor Map</Text>
      </View>
      {feature === "interestPoints" ? <InterestPoints /> : <OutdoorMap />}
    </View>
  );
};

export default FeatureSwitcher;