import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/POIListStyle';
import Constants from "expo-constants";
import { useLocationContext } from '@/app/context/LocationContext';

const {
    updateOrigin,
    updateDestination,
    updateShowTransportation,
    updateRenderMap,
    updateTravelMode,
    updateShowShuttleRoute,
    origin,
    destination,
    originText,
    destinationText,
    showTransportation,
    renderMap,
    showShuttleRoute,
    travelMode,
  } = useLocationContext();

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const POIListItem = ({ item, userLocation, calculateDistance }) => {
    const [imageError, setImageError] = useState(false);

    const poiDistance = calculateDistance(
        userLocation?.latitude || 0,
        userLocation?.longitude || 0,
        item.geometry?.location?.lat,
        item.geometry?.location?.lng
    );

    // Extract photo reference using proper path
    const photoReference = !imageError && item.photos && item.photos[0]?.photo_reference;

    // Build photo URL following Google Places API requirements
    const imageUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
        : null;

    // Handle Get Directions button press
    const handleGetDirections = () => {
        console.log(`Get directions to: ${item.name}`);
        console.log(`Address: ${item.vicinity || 'Address not available'}`);
        console.log(`Coordinates: ${item.geometry?.location?.lat}, ${item.geometry?.location?.lng}`);
        updateDestination({latitude: item.geometry.location.lat, longitude: item.geometry.location}, item.name);
    };

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
                        item.category === 'cafe' ? styles.cafeBadge :
                            item.category === 'restaurant' ? styles.restaurantBadge : styles.activityBadge
                    ]}>
                        <Text style={styles.categoryText}>
                            {item.category === 'cafe' ? 'Cafe' :
                                item.category === 'restaurant' ? 'Restaurant' : 'Activity'}
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
};

const POIList = ({
    data,
    userLocation,
    isLoading,
    error,
    refreshing,
    onRefresh,
    calculateDistance
}) => {
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
                <Text style={styles.errorText}>{error ? error : "An error occurred"}</Text>
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
        <FlatList
            testID="poi-flatlist"
            data={data}
            renderItem={({ item }) => (
                <POIListItem
                    item={item}
                    userLocation={userLocation}
                    calculateDistance={calculateDistance}
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
                    colors={["#922338"]}
                    tintColor="#922338"
                />
            }
            removeClippedSubviews={true}
        />
    );
};

export default POIList;
