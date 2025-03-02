import React, { useState, useEffect, Fragment } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, Platform } from "react-native";
import { Marker, Polygon, Callout } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { isPointInPolygon } from "geolib";
import { buildings, Campus, getBuildingById } from "../../api/buildingData";
import StartAndDestinationPoints from "../StartAndDestinationPoints";
import { BuildingPopup } from "../BuildingPopUp";
import MapDirections from "../MapDirections";
import styles from "../../styles/UnifiedMapStyles";
import Constants from "expo-constants";

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

// Custom callout component with fixed button handling
const POICallout = ({ poi, location, calculateDistance, formatDistance, onDirectionsPress }) => {
  const lat = poi.geometry?.location?.lat;
  const lng = poi.geometry?.location?.lng;
  
  const handlePress = () => {
    onDirectionsPress(poi);
  };
  
  return (
    <View style={{ width: 200, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{poi.name}</Text>
      {location && lat && lng && (
        <Text style={{ marginBottom: 10 }}>
          Distance: {formatDistance(calculateDistance(
            location.latitude,
            location.longitude,
            lat,
            lng
          ))}
        </Text>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "#922338",
          padding: 8,
          borderRadius: 5,
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const CampusOverlay = ({ mapRef, initialCampus, location }) => {
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

  // Campus state
  const [activeCampus, setActiveCampus] = useState(initialCampus);
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [travelMode, setTravelMode] = useState('TRANSIT');
  const [renderMap, setRenderMap] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState({
    latitudeDelta: activeCampus === "sgw" ? sgwRegion.latitudeDelta : loyolaRegion.latitudeDelta,
    longitudeDelta: activeCampus === "sgw" ? sgwRegion.longitudeDelta : loyolaRegion.longitudeDelta,
  });

  // POI state
  const [showPOIs, setShowPOIs] = useState(false);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState(null);

  // Coordinates mapping for start/destination points
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

  // Effect for location-based building highlighting
  useEffect(() => {
    if (location) {
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
  }, [location]);

  // Effect for campus switching
  useEffect(() => {
    if (mapRef.current) {
      const region = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      setCurrentZoomLevel({
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [activeCampus, mapRef]);

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

  // Calculate distance for POIs
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

  // Format distance
  const formatDistance = (d) => {
    if (d > 1000) {
      return (d / 1000).toFixed(2) + " km";
    }
    return Math.round(d) + " m";
  };

  // Fetch POIs
  const fetchPOIs = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const currentRegion = activeCampus === "sgw" ? sgwRegion : loyolaRegion;
      let allResults = [];
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=1000&keyword=coffee|restaurant|tourist|bowling|cinema|theater|gold&key=${GOOGLE_PLACES_API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();
      allResults = data.results;
      
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
  };

  // Toggle POIs and adjust zoom level
  const togglePOIs = async () => {
    const newShowPOIs = !showPOIs;
    setShowPOIs(newShowPOIs);
    
    if (newShowPOIs) {
      // Zoom out when showing POIs
      if (coffeeShops.length === 0) {
        await fetchPOIs();
      }
      
      if (mapRef.current) {
        try {
          const currentRegion = mapRef.current.getInitialRegion ? 
            mapRef.current.getInitialRegion() : 
            (activeCampus === "sgw" ? sgwRegion : loyolaRegion);
          
          // Save current zoom level
          setCurrentZoomLevel({
            latitudeDelta: currentRegion.latitudeDelta,
            longitudeDelta: currentRegion.longitudeDelta,
          });
          
          // Zoom out (2x wider view)
          mapRef.current.animateToRegion({
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
            latitudeDelta: currentRegion.latitudeDelta * 2,
            longitudeDelta: currentRegion.longitudeDelta * 2,
          }, 300);
        } catch (error) {
          console.error("Error zooming out:", error);
        }
      }
    } else {
      // Zoom back in when hiding POIs
      if (mapRef.current) {
        try {
          const currentRegion = mapRef.current.getInitialRegion ? 
            mapRef.current.getInitialRegion() :
            (activeCampus === "sgw" ? sgwRegion : loyolaRegion);
          
          mapRef.current.animateToRegion({
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
            latitudeDelta: currentZoomLevel.latitudeDelta,
            longitudeDelta: currentZoomLevel.longitudeDelta,
          }, 300);
        } catch (error) {
          console.error("Error zooming in:", error);
        }
      }
    }
  };

  // Get directions to POI
  const getDirectionsToPOI = (poi) => {
    const lat = poi.geometry?.location?.lat;
    const lng = poi.geometry?.location?.lng;
    if (lat && lng) {
      console.log("Getting directions to:", poi.name, "at", { latitude: lat, longitude: lng });
      
      // Set origin to user location or default campus center if not available
      setOriginLocation("My Position");
      
      // Set destination to the POI location
      setDestinationLocation({ latitude: lat, longitude: lng });
      
      // Enable route rendering
      setRenderMap(true);
    }
  };

  return (
    <>
      {/* Route planning UI */}
      <StartAndDestinationPoints
        setOriginLocation={setOriginLocation}
        setDestinationLocation={setDestinationLocation}
        setTravelMode={setTravelMode}
        renderMap={renderMap}
        setRenderMap={setRenderMap}
      />

      {/* Map Elements - Direction lines */}
      {originLocation && destinationLocation && renderMap && (
        <MapDirections
          origin={originLocation}
          destination={destinationLocation}
          mapRef={mapRef}
          travelMode={travelMode}
        />
      )}

      {/* Start/End markers */}
      {originLocation && coordinatesMap[originLocation]?.latitude !== undefined && (
        <Marker
          coordinate={coordinatesMap[originLocation]}
          title="Origin"
          pinColor="green"
        />
      )}

      {destinationLocation && (typeof destinationLocation === 'object' && 'latitude' in destinationLocation) && (
        <Marker
          coordinate={destinationLocation}
          title="Destination"
          pinColor="red"
        />
      )}

      {destinationLocation && (typeof destinationLocation === 'string' && coordinatesMap[destinationLocation]?.latitude !== undefined) && (
        <Marker
          coordinate={coordinatesMap[destinationLocation]}
          title="Destination"
          pinColor="red"
        />
      )}

      {/* Campus center marker */}
      <Marker
        coordinate={
          activeCampus === "sgw"
            ? { latitude: sgwRegion.latitude, longitude: sgwRegion.longitude }
            : { latitude: loyolaRegion.latitude, longitude: loyolaRegion.longitude }
        }
        title={activeCampus === "sgw" ? "SGW Campus" : "Loyola Campus"}
        description="Campus Center"
      />

      {/* Building polygons */}
      {buildings
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

      {/* POI Markers with callouts */}
      {showPOIs && (
        <>
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
                <Callout tooltip>
                  <POICallout 
                    poi={shop}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}

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
                <Callout tooltip>
                  <POICallout 
                    poi={restaurant}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}

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
                <Callout tooltip>
                  <POICallout 
                    poi={act}
                    location={location}
                    calculateDistance={calculateDistance}
                    formatDistance={formatDistance}
                    onDirectionsPress={getDirectionsToPOI}
                  />
                </Callout>
              </Marker>
            );
          })}
        </>
      )}

      {/* Floating Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={centerMapOnCampus}>
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.debugText}>
            {activeCampus === "sgw" ? "SGW" : "Loyola"}
          </Text>
        </TouchableOpacity>
        
        {/* POI Toggle Button */}
        <TouchableOpacity style={styles.button} onPress={togglePOIs}>
          <MaterialIcons 
            name={showPOIs ? "not-interested" : "stars"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.debugText}>
            {showPOIs ? "Hide POIs" : "Show POIs"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campus Switcher */}
      <View style={styles.switchButtonContainer}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCampus}>
          <Text style={styles.switchButtonText}>Switch Campus</Text>
        </TouchableOpacity>
      </View>

      {/* Building Popup */}
      <BuildingPopup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setSelectedBuilding(null);
        }}
        building={selectedBuilding}
      />

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}
    </>
  );
};

export default CampusOverlay; 