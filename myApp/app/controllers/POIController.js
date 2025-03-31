/**
 * POIController.js - Controller component for Points of Interest
 * 
 * Responsible for coordinating between the model and view.
 * Implements Controller in MVC architecture.
 */
import POIModel from '../models/POIModel';

class POIController {
  constructor() {
    this.model = POIModel;
    this.filterSettings = {
      distance: 40,
      useDistance: false,
      showCafes: true,
      showRestaurants: true,
      showActivities: true
    };
  }

  /**
   * Initialize data and location
   * @returns {Promise<Object>} User location
   */
  async initializeData() {
    try {
      const location = await this.model.getUserLocation();
      await this.fetchPOIData(location);
      return location;
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }

  /**
   * Fetch POI data
   * @param {Object} coords - Coordinates to fetch data for
   * @returns {Promise<void>}
   */
  async fetchPOIData(coords) {
    return this.model.fetchPOIs(coords);
  }

  /**
   * Handle refreshing the data
   * @returns {Promise<void>}
   */
  async refreshData() {
    try {
      const location = await this.model.getUserLocation();
      await this.fetchPOIData(location);
      return location;
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }

  /**
   * Subscribe to POI data changes
   * @param {function} callback - Callback when data changes
   * @returns {function} Unsubscribe function
   */
  subscribeToPOIData(callback) {
    return this.model.subscribeToPOIData(callback);
  }

  /**
   * Get filtered POI data based on current filter settings
   * @param {Object} poiData - Raw POI data
   * @returns {Array} Filtered POI data
   */
  getFilteredData(poiData) {
    return this.model.getFilteredData(poiData, this.filterSettings);
  }

  /**
   * Update filter settings
   * @param {Object} newSettings - New filter settings
   */
  updateFilterSettings(newSettings) {
    this.filterSettings = {
      ...this.filterSettings,
      ...newSettings
    };
  }

  /**
   * Calculate distance between two points
   * @param {number} lat1 - First latitude
   * @param {number} lon1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lon2 - Second longitude
   * @returns {number|null} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    return this.model.calculateDistance(lat1, lon1, lat2, lon2);
  }
}

export default new POIController(); // Export as singleton
