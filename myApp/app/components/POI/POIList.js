import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  styles as defaultStyles,
  createPOIListStyles,
} from "../../styles/POIListStyle";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useLocationContext } from "@/app/context/LocationContext";
import { ThemeContext } from "@/app/context/ThemeContext";

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const POIListItem = ({
  item,
  userLocation,
  calculateDistance,
  themeStyles,
  isDarkMode,
  theme,
}) => {
  const [imageError, setImageError] = useState(false);

  // Use provided styles or fall back to defaults
  const styles = themeStyles || defaultStyles;

  const poiDistance = calculateDistance(
    userLocation?.latitude || 0,
    userLocation?.longitude || 0,
    item.geometry?.location?.lat,
    item.geometry?.location?.lng
  );

  // Extract photo reference using proper path
  const photoReference = !imageError && item.photos?.[0]?.photo_reference;

  // Build photo URL following Google Places API requirements
  const imageUrl = photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
    : null;

  const router = useRouter();
  const { updatePOILocationData } = useLocationContext();

  // Handle Get Directions button press
  const handleGetDirections = () => {
    console.log(`Get directions to: ${item.name}`);
    console.log(`Address: ${item.vicinity || "Address not available"}`);
    console.log(
      `Coordinates: ${item.geometry?.location?.lat}, ${item.geometry?.location?.lng}`
    );

    const name = item.name;
    const lat = item.geometry?.location?.lat;
    const lng = item.geometry?.location?.lng;

    // Update the context data without redirecting
    updatePOILocationData(name, lat, lng);

    // Navigate to a new page with the location details
    router.push({
      pathname: "/(tabs)/map",
      params: {
        name: item.name,
        lat: item.geometry?.location?.lat,
        lng: item.geometry?.location?.lng,
      },
    });
  };

  // Helper function to get category style with theme awareness
  const getCategoryStyle = (category) => {
    if (category === "cafe") return styles.cafeBadge;
    if (category === "restaurant") return styles.restaurantBadge;
    return styles.activityBadge;
  };

  const getCategoryText = (category) => {
    if (category === "cafe") return "Cafe";
    if (category === "restaurant") return "Restaurant";
    return "Activity";
  };

  // Theme-aware icon color
  const placeholderIconColor = isDarkMode ? "#aaa" : "#888";
  const starIconColor = isDarkMode ? "#ffd700" : "#FFD700"; // Slightly adjusted for dark mode

  return (
    <View style={styles.poiItem}>
      {imageUrl && !imageError ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.poiImage}
          resizeMode="cover"
          testID="poi-image"
          onError={(e) => {
            console.log(`Image error for ${item.name}:`, e.nativeEvent.error);
            setImageError(true);
          }}
        />
      ) : (
        <View style={styles.noImagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={40}
            color={placeholderIconColor}
          />
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.poiContent}>
        <View style={styles.poiHeader}>
          <Text style={styles.poiName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.poiDistance}>
            {poiDistance ? `${poiDistance.toFixed(1)} km` : ""}
          </Text>
        </View>
        <Text style={styles.poiAddress} numberOfLines={2}>
          {item.vicinity || "Address not available"}
        </Text>
        <View style={styles.categoryContainer}>
          <View style={[styles.categoryBadge, getCategoryStyle(item.category)]}>
            <Text style={styles.categoryText}>
              {getCategoryText(item.category)}
            </Text>
          </View>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={starIconColor} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>

        {/* Get Directions Button */}
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate" size={16} color="white" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

POIListItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    place_id: PropTypes.string,
    vicinity: PropTypes.string,
    category: PropTypes.string,
    rating: PropTypes.number,
    geometry: PropTypes.shape({
      location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }),
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        photo_reference: PropTypes.string,
      })
    ),
  }).isRequired,
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  calculateDistance: PropTypes.func.isRequired,
  themeStyles: PropTypes.object,
  isDarkMode: PropTypes.bool,
  theme: PropTypes.object,
};

const POIList = ({
  data,
  userLocation,
  isLoading,
  error,
  refreshing,
  onRefresh,
  calculateDistance,
  themeStyles,
  isDarkMode: propIsDarkMode,
  theme: propTheme,
}) => {
  // Get theme from context if not provided as props
  const themeContext = useContext(ThemeContext);
  const isDarkMode =
    propIsDarkMode !== undefined ? propIsDarkMode : themeContext?.isDarkMode;
  const theme = propTheme || themeContext?.theme;

  // Use provided styles or create theme-aware styles
  const styles =
    themeStyles ||
    (isDarkMode !== undefined
      ? createPOIListStyles({ isDarkMode, theme })
      : defaultStyles);

  // Theme-aware colors
  const loadingColor = isDarkMode
    ? theme?.buttonBackground || "#aa3355"
    : "#922338";

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={loadingColor}
          testID="activity-indicator"
        />
        <Text style={styles.loadingText}>Loading places...</Text>
      </View>
    );
  }

  if (error && (!data || data.length === 0)) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.errorText}>{error ?? "An error occurred"}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 20 }]}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>
          No places found with the current filters. Try adjusting your filter
          settings or increasing the distance.
        </Text>
      </View>
    );
  }

  console.log(`POIList rendering ${data.length} items`);

  return (
    <FlatList
      testID="poi-flatlist"
      data={data}
      renderItem={({ item }) => (
        <POIListItem
          item={item}
          userLocation={userLocation}
          calculateDistance={calculateDistance}
          themeStyles={styles}
          isDarkMode={isDarkMode}
          theme={theme}
        />
      )}
      keyExtractor={(item) => item.place_id || Math.random().toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={true}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[loadingColor]}
          tintColor={loadingColor}
          progressBackgroundColor={isDarkMode ? "#333" : "#fff"}
        />
      }
      removeClippedSubviews={true}
    />
  );
};

POIList.propTypes = {
  data: PropTypes.array,
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  calculateDistance: PropTypes.func.isRequired,
  themeStyles: PropTypes.object,
  isDarkMode: PropTypes.bool,
  theme: PropTypes.object,
};

export default POIList;
