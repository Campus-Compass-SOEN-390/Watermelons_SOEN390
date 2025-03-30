import React, { useState, useCallback, memo, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/POIListStyle';
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useLocationContext } from '@/app/context/LocationContext';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// Constants for consistent item heights (important for smooth scrolling)
const ITEM_HEIGHT = 350; // Base height including image, content, padding
const IMAGE_HEIGHT = 180; // Match the style definition
const SCROLL_THRESHOLD = 300; // Show button after scrolling this much

const getCategoryStyle = (category) => {
    if (category === 'cafe') return styles.cafeBadge;
    if (category === 'restaurant') return styles.restaurantBadge;
    return styles.activityBadge;
};

const getCategoryText = (category) => {
    if (category === 'cafe') return 'Cafe';
    if (category === 'restaurant') return 'Restaurant';
    return 'Activity';
};

// Memo-ize the POIListItem component to prevent unnecessary re-renders
const POIListItem = memo(({ item, userLocation, calculateDistance }) => {
    const [imageError, setImageError] = useState(false);
    
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
    
    // Memoize the handler function to prevent recreation on each render
    const handleGetDirections = useCallback(() => {
        console.log(`Get directions to: ${item.name}`);
        
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
                    onError={() => {
                        console.log(`Image error for ${item.name}`);
                        setImageError(true);
                    }}
                    // Add fast image loading
                    fadeDuration={200}
                    progressiveRenderingEnabled={true}
                />
            ) : (
                <View style={styles.noImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#888" />
                    <Text style={styles.noImageText}>No Image Available</Text>
                </View>
            )}
            <View style={styles.poiContent}>
                <View style={styles.poiHeader}>
                    <Text style={styles.poiName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.poiDistance}>
                        {poiDistance ? `${poiDistance.toFixed(1)} km` : ''}
                    </Text>
                </View>
                <Text style={styles.poiAddress} numberOfLines={2}>
                    {item.vicinity || 'Address not available'}
                </Text>
                <View style={styles.categoryContainer}>
                    <View style={[
                        styles.categoryBadge,
                        getCategoryStyle(item.category)
                    ]}>
                        <Text style={styles.categoryText}>
                            {getCategoryText(item.category)}
                        </Text>
                    </View>
                    {item.rating && (
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={12} color="#FFD700" />
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
    calculateDistance: PropTypes.func.isRequired
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
    calculateDistance
}) => {
    // Add refs and state for scroll-to-top functionality
    const flatListRef = useRef(null);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
    
    // Memoize data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data, [data]);
    
    // Memoize renderItem function to prevent recreation on each render
    const renderItem = useCallback(({ item }) => (
        <POIListItem
            item={item}
            userLocation={userLocation}
            calculateDistance={calculateDistance}
        />
    ), [userLocation, calculateDistance]);
    
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
                <ActivityIndicator size="large" color="#922338" testID="activity-indicator" />
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
                        colors={["#922338"]}
                        tintColor="#922338"
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
        longitude: PropTypes.number
    }),
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func.isRequired,
    calculateDistance: PropTypes.func.isRequired
};

export default memo(POIList);
