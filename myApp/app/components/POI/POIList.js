import React, { useState, useContext, useCallback, memo, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Platform,
    Animated
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
import { useButtonInteraction } from "../../hooks/useButtonInteraction";

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Constants for consistent item heights (important for smooth scrolling)
const ITEM_HEIGHT = 350; // Base height including image, content, padding
const IMAGE_HEIGHT = 180; // Match the style definition
const SCROLL_THRESHOLD = 300; // Show button after scrolling this much

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

// Memo-ize the POIListItem component to prevent unnecessary re-renders
const POIListItem = memo(({ item, userLocation, calculateDistance, themeStyles, isDarkMode, theme }) => {
    const [imageError, setImageError] = useState(false);
    const { handleButtonPress } = useButtonInteraction();

    // Use provided styles or fall back to defaults
    const styles = themeStyles || defaultStyles;
    
    // Use the pre-computed distance if available
    const poiDistance = item._distance !== undefined 
        ? item._distance 
        : calculateDistance(
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
    
    // Theme-aware icon color
    const placeholderIconColor = isDarkMode ? "#aaa" : "#888";
    const starIconColor = isDarkMode ? "#ffd700" : "#FFD700"; // Slightly adjusted for dark mode
    
    // Memoize the handler function to prevent recreation on each render
    const handleGetDirections = useCallback(() => {
        handleButtonPress(null, `Getting directions to ${item.name}`);
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
                lat: lat,
                lng: lng,
            },
        });
    }, [item.name, item.geometry?.location?.lat, item.geometry?.location?.lng, updatePOILocationData, router]);

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
                    // Add fast image loading
                    fadeDuration={200}
                    progressiveRenderingEnabled={true}
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
}, (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Only re-render if the item ID changes or user location changes significantly
    const prevItem = prevProps.item;
    const nextItem = nextProps.item;
    
    // If place_id is different, always re-render
    if (prevItem.place_id !== nextItem.place_id) return false;
    
    // If user location changed significantly, re-render
    const prevLoc = prevProps.userLocation;
    const nextLoc = nextProps.userLocation;
    if (!prevLoc && nextLoc) return false;
    if (prevLoc && !nextLoc) return false;
    if (prevLoc && nextLoc) {
        const latDiff = Math.abs(prevLoc.latitude - nextLoc.latitude);
        const lngDiff = Math.abs(prevLoc.longitude - nextLoc.longitude);
        
        // Location change threshold that would make distance display noticeably different
        if (latDiff > 0.001 || lngDiff > 0.001) return false;
    }
    
    // If theme changes, re-render
    if (prevProps.isDarkMode !== nextProps.isDarkMode) return false;
    
    // If item's relevant properties changed, re-render
    return !(prevItem.name === nextItem.name &&
        prevItem.vicinity === nextItem.vicinity &&
        prevItem.rating === nextItem.rating &&
        prevItem._distance === nextItem._distance);
});

POIListItem.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string,
        place_id: PropTypes.string,
        vicinity: PropTypes.string,
        category: PropTypes.string,
        rating: PropTypes.number,
        _distance: PropTypes.number, // Pre-computed distance
        geometry: PropTypes.shape({
            location: PropTypes.shape({
                lat: PropTypes.number,
                lng: PropTypes.number
            })
        }),
        photos: PropTypes.arrayOf(
            PropTypes.shape({
                photo_reference: PropTypes.string
            })
        )
    }).isRequired,
    userLocation: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number
    }),
    calculateDistance: PropTypes.func.isRequired,
    themeStyles: PropTypes.object,
    isDarkMode: PropTypes.bool,
    theme: PropTypes.object,
};

// Function to extract a stable key for FlatList
const keyExtractor = item => item.uniqueKey || item.place_id || Math.random().toString();

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
      
    // Add refs and state for scroll-to-top functionality
    const flatListRef = useRef(null);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
    
    // Memoize data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data, [data]);
    
    const { handleButtonPress } = useButtonInteraction();
    
    // Memoize renderItem function to prevent recreation on each render
    const renderItem = useCallback(({ item }) => (
        <POIListItem
            item={item}
            userLocation={userLocation}
            calculateDistance={calculateDistance}
            themeStyles={styles}
            isDarkMode={isDarkMode}
            theme={theme}
        />
    ), [userLocation, calculateDistance, styles, isDarkMode, theme]);
    
    // Ensure consistent item height for getItemLayout
    const getItemLayout = useCallback((_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    }), []);
    
    // Handle scroll event to show/hide scroll-to-top button
    const handleScroll = useCallback((event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        
        // Show button when scrolled down enough
        if (scrollY > SCROLL_THRESHOLD && !showScrollTopButton) {
            setShowScrollTopButton(true);
            Animated.timing(scrollButtonOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        } 
        // Hide button when close to the top
        else if (scrollY <= SCROLL_THRESHOLD && showScrollTopButton) {
            Animated.timing(scrollButtonOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => {
                setShowScrollTopButton(false);
            });
        }
    }, [showScrollTopButton, scrollButtonOpacity]);
    
    // Scroll to top function
    const scrollToTop = useCallback(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, []);

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
                    onPress={() => {
                        handleButtonPress(null, 'Retrying to load places');
                        onRefresh();
                    }}
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
                    No places found with the current filters.
                    Try adjusting your filter settings or increasing the distance.
                </Text>
            </View>
        );
    }
    
    console.log(`POIList rendering ${data.length} items`);
    
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                testID="poi-flatlist"
                ref={flatListRef}
                data={memoizedData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={true}
                
                // Performance optimization settings
                initialNumToRender={5}
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={100}
                windowSize={5}
                removeClippedSubviews={Platform.OS !== 'web'} // This helps on mobile
                
                // Use consistent item heights for smoother scrolling
                getItemLayout={getItemLayout}
                
                // Add scroll event listener
                onScroll={handleScroll}
                scrollEventThrottle={16}
                
                // Additional optimizations
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 3
                }}
                
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[loadingColor]}
                        tintColor={loadingColor}
                        progressBackgroundColor={isDarkMode ? "#333" : "#fff"}
                    />
                }
                
                // Progressive loading indicator
                ListFooterComponent={
                    data.length > 20 ? (
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>
                                {`Showing ${data.length} places`}
                            </Text>
                        </View>
                    ) : null
                }
            />
            
            {/* Scroll to top button */}
            {showScrollTopButton && (
                <Animated.View style={[
                    styles.scrollTopButton, 
                    { opacity: scrollButtonOpacity }
                ]}>
                    <TouchableOpacity
                        onPress={scrollToTop}
                        style={styles.scrollTopButtonTouchable}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-up" size={24} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
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

export default memo(POIList);
