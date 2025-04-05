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
    this.data = { ...this.data, ...newData };
    this.notifyObservers();
  }

  /**
   * Set loading state and notify observers
   * @param {boolean} isLoading - Whether data is being loaded
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.notifyObservers();
  }

  /**
   * Notify all observers of data changes
   */
  notifyObservers() {
    this.observers.forEach(observer => {
      observer(this.data, this.isLoading);
    });
  }

  /**
   * Get current data
   * @returns {Object} Current POI data
   */
  getData() {
    return this.data;
  }

  /**
   * Check if region has changed significantly
   * @param {Object} newRegion - New map region
   * @returns {boolean} Whether region has changed enough to warrant a new fetch
   */
  hasRegionChanged(newRegion) {
    if (!this.data.lastRegion || !newRegion) return true;
    
    const REGION_CHANGE_THRESHOLD = 0.005;
    const latDiff = Math.abs(newRegion.latitude - this.data.lastRegion.latitude);
    const lngDiff = Math.abs(newRegion.longitude - this.data.lastRegion.longitude);
    
    return latDiff > REGION_CHANGE_THRESHOLD || lngDiff > REGION_CHANGE_THRESHOLD;
  }
}

// Create a singleton instance
const poiDataSubject = new POIDataSubject();

export default poiDataSubject;
