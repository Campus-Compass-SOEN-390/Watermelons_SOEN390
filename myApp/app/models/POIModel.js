/**
 * POIModel.js - Model component for Points of Interest data
 * 
 * Responsible for data handling, calculations and business logic.
 * Implements Model in MVC architecture.
 */
import * as Location from 'expo-location';
import { fetchPOIData, poiDataSubject } from '../api/poiApi';

class POIModel {
  constructor() {
    // Data state will be managed by the poiDataSubject
    this.userLocation = null;
  }

  /**
   * Get current user location
   * @returns {Promise<Object>} Location coordinates
   */
  async getUserLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      this.userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      return this.userLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  /**
   * Fetch POI data based on location
   * @param {Object} coords - Coordinates to search around
   * @returns {Promise<void>}
   */
  async fetchPOIs(coords) {
    if (!coords) {
      throw new Error('No coordinates provided');
    }

    try {
      const region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // This will update the POIDataSubject which will notify all observers
      await fetchPOIData(region, new AbortController().signal);
    } catch (error) {
      console.error('Error fetching POI data:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates
   * @param {number} lat1 - First latitude
   * @param {number} lon1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lon2 - Second longitude
   * @returns {number|null} Distance in kilometers or null if inputs invalid
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  /**
   * Convert degrees to radians
   * @param {number} deg - Degrees
   * @returns {number} Radians
   */
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Subscribe to POI data changes (Observer pattern)
   * @param {function} callback - Function to call when data changes
   * @returns {function} Unsubscribe function
   */
  subscribeToPOIData(callback) {
    return poiDataSubject.subscribe(callback);
  }

  /**
   * Get filtered POI data based on user preferences
   * @param {Object} poiData - Raw POI data
   * @param {Object} filters - Filter settings
   * @returns {Array} Filtered POI data
   */
  getFilteredData(poiData, filters) {
    const { showCafes, showRestaurants, showActivities, useDistance, distance } = filters;
    
    if (!this.userLocation) return [];

    let allPOIs = [];

    if (showCafes) {
      allPOIs = [...allPOIs, ...poiData.coffeeShops.map(poi => ({ ...poi, category: 'cafe' }))]
    }
    if (showRestaurants) {
      allPOIs = [...allPOIs, ...poiData.restaurants.map(poi => ({ ...poi, category: 'restaurant' }))]
    }
    if (showActivities) {
      allPOIs = [...allPOIs, ...poiData.activities.map(poi => ({ ...poi, category: 'activity' }))]
    }

    // Filter and sort by distance
    const filteredAndSorted = this.filterAndSortByDistance(allPOIs, useDistance, distance);
    return filteredAndSorted;
  }

  /**
   * Filter and sort POIs by distance
   * @param {Array} pois - POI array
   * @param {boolean} useDistance - Whether to filter by distance
   * @param {number} maxDistance - Maximum distance in km
   * @returns {Array} Filtered and sorted POIs
   */
  filterAndSortByDistance(pois, useDistance, maxDistance) {
    // Only filter by distance if useDistance is true
    if (useDistance) {
      return pois.filter(poi => {
        const poiDistance = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          poi.geometry?.location?.lat,
          poi.geometry?.location?.lng
        );
        return poiDistance !== null && poiDistance <= maxDistance;
      }).sort((a, b) => {
        const distA = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          a.geometry?.location?.lat,
          a.geometry?.location?.lng
        );
        const distB = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          b.geometry?.location?.lat,
          b.geometry?.location?.lng
        );
        return distA - distB;
      });
    }

    // If useDistance is false, return all POIs, still sorted by distance
    return pois.sort((a, b) => {
      const distA = this.calculateDistance(
        this.userLocation.latitude,
        this.userLocation.longitude,
        a.geometry?.location?.lat,
        a.geometry?.location?.lng
      );
      const distB = this.calculateDistance(
        this.userLocation.latitude,
        this.userLocation.longitude,
        b.geometry?.location?.lat,
        b.geometry?.location?.lng
      );
      return distA - distB;
    });
  }
}

export default new POIModel(); // Export as singleton
