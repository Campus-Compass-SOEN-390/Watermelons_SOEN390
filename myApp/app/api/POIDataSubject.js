/**
 * POIDataSubject - Implementation of the Observable/Subject pattern for POI data
 * 
 * This class maintains POI data and notifies observers when data changes.
 * It follows the Observer design pattern where:
 * - POIDataSubject is the "Subject" (Observable)
 * - Map and POIList components are "Observers"
 */

class POIDataSubject {
  constructor() {
    // Initialize with empty data
    this.data = {
      coffeeShops: [],
      restaurants: [],
      activities: [],
      lastRegion: null,
      lastFetchTime: 0,
    };
    this.observers = [];
    this.isLoading = false;
    this.dataVersion = 0; // Track data version for efficient updates
  }

  /**
   * Subscribe to data updates
   * @param {function} observer - Callback function to be called when data changes
   * @returns {function} Unsubscribe function
   */
  subscribe(observer) {
    if (typeof observer !== 'function') {
      console.error('Observer must be a function');
      return () => {};
    }
    
    this.observers.push(observer);
    
    // Immediately notify new observer with current data
    observer(this.data, this.isLoading);
    
    // Return unsubscribe function
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  /**
   * Update data and notify all observers
   * @param {Object} newData - New POI data
   */
  updateData(newData) {
    const oldDataStr = JSON.stringify(this.data);
    this.data = { ...this.data, ...newData };
    const newDataStr = JSON.stringify(this.data);
    
    // Only notify if data actually changed
    if (oldDataStr !== newDataStr) {
      this.dataVersion++; // Increment version for change tracking
      this.notifyObservers();
    }
  }

  /**
   * Set loading state and notify observers
   * @param {boolean} isLoading - Whether data is being loaded
   */
  setLoading(isLoading) {
    if (this.isLoading !== isLoading) {
      this.isLoading = isLoading;
      this.notifyObservers();
    }
  }

  /**
   * Notify all observers of data changes
   * Uses batch updates to prevent too many UI updates
   */
  notifyObservers() {
    // Use requestAnimationFrame to batch notify in the next frame
    // This prevents multiple renders in rapid succession
    if (this.batchUpdateTimeout) {
      clearTimeout(this.batchUpdateTimeout);
    }
    
    this.batchUpdateTimeout = setTimeout(() => {
      const currentData = this.data;
      const loadingState = this.isLoading;
      
      this.observers.forEach(observer => {
        try {
          observer(currentData, loadingState);
        } catch (error) {
          console.error('Error in observer:', error);
        }
      });
      
      this.batchUpdateTimeout = null;
    }, 16); // Approximately one frame at 60fps
  }

  /**
   * Get current data
   * @returns {Object} Current POI data
   */
  getData() {
    return this.data;
  }

  /**
   * Get current loading state
   * @returns {boolean} Whether data is currently loading
   */
  getIsLoading() {
    return this.isLoading;
  }

  /**
   * Get current data version
   * @returns {number} Current data version
   */
  getDataVersion() {
    return this.dataVersion;
  }

  /**
   * Check if region has changed significantly
   * @param {Object} newRegion - New map region
   * @returns {boolean} Whether region has changed enough to warrant a new fetch
   */
  hasRegionChanged(newRegion) {
    if (!this.data.lastRegion || !newRegion) return true;
    
    const REGION_CHANGE_THRESHOLD = 0.01; // Increased from 0.005 to reduce API calls
    const latDiff = Math.abs(newRegion.latitude - this.data.lastRegion.latitude);
    const lngDiff = Math.abs(newRegion.longitude - this.data.lastRegion.longitude);
    
    return latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD;
  }

  /**
   * Merge new POI data into existing data
   * @param {Object} newData - New POI data to merge
   */
  mergeData(newData) {
    // Create a map of existing place IDs for faster lookup
    const existingPlaceIds = new Map();
    
    // Add all existing POIs to the map
    this.data.coffeeShops.forEach(poi => 
      existingPlaceIds.set(poi.place_id, { type: 'coffee', data: poi }));
    this.data.restaurants.forEach(poi => 
      existingPlaceIds.set(poi.place_id, { type: 'restaurant', data: poi }));
    this.data.activities.forEach(poi => 
      existingPlaceIds.set(poi.place_id, { type: 'activity', data: poi }));
    
    // Create new arrays with merged data
    const mergedCoffee = [...this.data.coffeeShops];
    const mergedRestaurants = [...this.data.restaurants];
    const mergedActivities = [...this.data.activities];
    
    // Helper to merge new POIs into appropriate category
    const mergePOIs = (pois, category) => {
      if (!pois || !Array.isArray(pois)) return;
      
      pois.forEach(poi => {
        if (!poi.place_id) return;
        
        // If this POI doesn't exist yet or is in a different category, add it
        const existing = existingPlaceIds.get(poi.place_id);
        if (!existing) {
          if (category === 'coffee') mergedCoffee.push(poi);
          else if (category === 'restaurant') mergedRestaurants.push(poi);
          else if (category === 'activity') mergedActivities.push(poi);
          
          existingPlaceIds.set(poi.place_id, { type: category, data: poi });
        } 
        // If existing and same category, update with newer data
        else if (existing.type === category) {
          const index = 
            category === 'coffee' 
              ? mergedCoffee.findIndex(p => p.place_id === poi.place_id)
              : category === 'restaurant'
                ? mergedRestaurants.findIndex(p => p.place_id === poi.place_id)
                : mergedActivities.findIndex(p => p.place_id === poi.place_id);
                
          if (index !== -1) {
            if (category === 'coffee') mergedCoffee[index] = { ...mergedCoffee[index], ...poi };
            else if (category === 'restaurant') mergedRestaurants[index] = { ...mergedRestaurants[index], ...poi };
            else if (category === 'activity') mergedActivities[index] = { ...mergedActivities[index], ...poi };
          }
        }
      });
    };
    
    // Merge each category
    if (newData.coffeeShops) mergePOIs(newData.coffeeShops, 'coffee');
    if (newData.restaurants) mergePOIs(newData.restaurants, 'restaurant');
    if (newData.activities) mergePOIs(newData.activities, 'activity');
    
    // Update data with merged results
    this.updateData({
      coffeeShops: mergedCoffee,
      restaurants: mergedRestaurants,
      activities: mergedActivities,
      lastRegion: newData.lastRegion || this.data.lastRegion,
      lastFetchTime: newData.lastFetchTime || Date.now(),
    });
  }
}

// Create a singleton instance
const poiDataSubject = new POIDataSubject();

export default poiDataSubject;
