// TravelFacade.js
import Constants from "expo-constants";
import {
  getGoogleTravelTime,
  getTravelTimes,
  getAlternativeRoutes,
} from "../api/googleMapsApi";
import {
  estimateShuttleTravelTime,
  estimateShuttleFromButton,
} from "../utils/shuttleUtils";
import { addShuttleOption } from "../utils/addShuttleOption";
import {
  haversineDistance,
  findNearestLocation,
} from "../utils/distanceShuttle";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

/**
 * TravelFacade - A facade design pattern implementation that provides a simplified
 * interface to the complex travel-related subsystems in the application.
 */
class TravelFacade {
  /**
   * Define shuttle stops for convenience
   */
  static sgwStop = {
    latitude: SGWtoLoyola.geometry.coordinates[0][1],
    longitude: SGWtoLoyola.geometry.coordinates[0][0],
  };

  static loyolaStop = {
    latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
    longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
  };

  /**
   * Fetch travel time from Google Maps API.
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @param {string} mode - "walking", "driving", "transit", "bicycling"
   * @returns {Promise<number|null>} Travel time in minutes or null if failed.
   */
  static getGoogleTravelTime(origin, destination, mode) {
    return getGoogleTravelTime(origin, destination, mode);
  }

  /**
   * Fetch travel times for multiple modes (driving, transit, walking, bicycling).
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @param {Array} modes - Travel modes (default: ["walking", "driving", "transit", "bicycling"])
   * @returns {Promise<Array>} List of travel modes with their estimated times.
   */
  static getTravelTimes(
    origin,
    destination,
    modes = ["walking", "driving", "transit", "bicycling"]
  ) {
    return getTravelTimes(origin, destination, modes);
  }

  /**
   * Fetch alternative routes from Google Maps API.
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @param {Array<string>} modes - Transport modes ["driving", "walking", "transit", "bicycling"]
   * @param {number} maxRoutes - Maximum number of alternative routes per mode
   * @returns {Promise<Object>} Object containing transport modes with up to maxRoutes options each.
   */
  static getAlternativeRoutes(
    origin,
    destination,
    modes = ["walking", "driving", "transit", "bicycling"],
    maxRoutes = 3
  ) {
    return getAlternativeRoutes(origin, destination, modes, maxRoutes);
  }

  /**
   * Estimate shuttle travel time
   * @param {Object} userLocation - { latitude, longitude }
   * @param {string} destinationCampus - "LOY" or "SGW"
   * @returns {Promise<number|null|{error:string}>} - Total travel time or error information
   */
  static estimateShuttleTravelTime(userLocation, destinationCampus) {
    return estimateShuttleTravelTime(userLocation, destinationCampus);
  }

  /**
   * Estimate shuttle travel time from button press
   * @param {string} currentStop - "SGW" or "LOY"
   * @returns {Promise<{waitTime:number, shuttleRideTime:number, totalTime:number}|null|{error:string}>}
   */
  static estimateShuttleFromButton(currentStop) {
    return estimateShuttleFromButton(currentStop);
  }

  /**
   * Add shuttle option to existing travel options
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @returns {Promise<Array>} - Array of shuttle options
   */
  static addShuttleOption(origin, destination) {
    return addShuttleOption(origin, destination);
  }

  /**
   * Calculate real-world distance using Haversine formula
   * @param {Object} coord1 - { latitude, longitude }
   * @param {Object} coord2 - { latitude, longitude }
   * @returns {number} Distance in km
   */
  static haversineDistance(coord1, coord2) {
    return haversineDistance(coord1, coord2);
  }

  /**
   * Find the nearest location from a list of locations
   * @param {Object} userLocation - { latitude, longitude }
   * @param {Array} locations - List of { latitude, longitude }
   * @returns {Object} Nearest location
   */
  static findNearestLocation(userLocation, locations) {
    return findNearestLocation(userLocation, locations);
  }

  /**
   * Check if a location is within a campus (SGW or Loyola)
   * @param {Object} location - { latitude, longitude }
   * @param {Object} campusRegion - Campus region object with latitude, longitude, and deltas
   * @returns {boolean} True if location is in campus
   */
  static isLocationInCampus(location, campusRegion) {
    return (
      location.latitude >= campusRegion.latitude - campusRegion.latitudeDelta &&
      location.latitude <= campusRegion.latitude + campusRegion.latitudeDelta &&
      location.longitude >=
        campusRegion.longitude - campusRegion.longitudeDelta &&
      location.longitude <= campusRegion.longitude + campusRegion.longitudeDelta
    );
  }

  /**
   * Determine which campus a location is in (if any)
   * @param {Object} location - { latitude, longitude }
   * @returns {string|null} "SGW", "LOY", or null if not in any campus
   */
  static determineCampus(location) {
    if (this.isLocationInCampus(location, sgwRegion)) {
      return "SGW";
    } else if (this.isLocationInCampus(location, loyolaRegion)) {
      return "LOY";
    }
    return null;
  }

  /**
   * Comprehensive method that gets all transportation options including shuttle if appropriate
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @param {Array} modes - Travel modes to include
   * @param {boolean} includeShuttle - Whether to include shuttle option
   * @param {number} maxRoutes - Maximum number of alternative routes per mode
   * @returns {Promise<Object>} - All travel options organized by mode
   */
  static async getAllTravelOptions(
    origin,
    destination,
    modes = ["walking", "driving", "transit", "bicycling"],
    includeShuttle = true,
    maxRoutes = 3
  ) {
    try {
      // Get alternative routes for all specified modes
      const googleRoutes = await this.getAlternativeRoutes(
        origin,
        destination,
        modes,
        maxRoutes
      );

      // Include shuttle options if requested and applicable
      if (includeShuttle) {
        const shuttleOptions = await this.addShuttleOption(origin, destination);

        if (shuttleOptions && shuttleOptions.length > 0) {
          // Convert shuttleOptions array to object format to match googleRoutes
          const shuttleRoutesObj = shuttleOptions.reduce((acc, option) => {
            // Extract mode name (e.g., "walking + Shuttle" -> "walking_shuttle")
            const modeKey = option.mode
              .replace(/ \+ Shuttle/i, "_shuttle")
              .toLowerCase();

            if (!acc[modeKey]) {
              acc[modeKey] = [];
            }

            acc[modeKey].push({
              duration: option.duration,
              distance: option.distance,
              summary: option.summary,
              coordinates: option.coordinates,
              steps: option.steps,
              details: option.details,
            });

            return acc;
          }, {});

          // Combine Google routes with shuttle options
          return [
            ...googleRoutes,
            ...Object.entries(shuttleRoutesObj).map(([mode, routes]) => ({
              mode,
              routes,
            })),
          ];
        }
      }

      return googleRoutes;
    } catch (error) {
      console.error("Error getting all travel options:", error);
      throw error;
    }
  }

  /**
   * Get the fastest route for each transport mode
   * @param {Object} origin - { latitude, longitude }
   * @param {Object} destination - { latitude, longitude }
   * @param {Array} modes - Travel modes to include
   * @param {boolean} includeShuttle - Whether to include shuttle option
   * @returns {Promise<Array>} - Array of objects containing mode and duration
   */
  static async getFastestRoutes(
    origin,
    destination,
    modes = ["walking", "driving", "transit", "bicycling"],
    includeShuttle = true
  ) {
    try {
      // Get all options including alternatives
      const allOptions = await this.getAllTravelOptions(
        origin,
        destination,
        modes,
        includeShuttle,
        1 // Only need one route per mode for fastest comparison
      );

      // For each mode, find the fastest route
      const fastestRoutes = allOptions.map((modeData) => {
        if (!modeData.routes || modeData.routes.length === 0) {
          return { mode: modeData.mode, duration: null };
        }

        // Find the route with the shortest duration
        const fastestRoute = modeData.routes.reduce(
          (fastest, current) =>
            current.duration &&
            (fastest.duration === null || current.duration < fastest.duration)
              ? current
              : fastest,
          { duration: null }
        );

        return {
          mode: modeData.mode,
          duration: fastestRoute.duration,
          distance: fastestRoute.distance,
          summary: fastestRoute.summary,
          details: fastestRoute.details || null,
        };
      });

      return fastestRoutes;
    } catch (error) {
      console.error("Error getting fastest routes:", error);
      throw error;
    }
  }

  /**
   * Get direct shuttle travel time between campuses
   * @returns {number} Travel time in minutes
   */
  static getDirectShuttleTime() {
    // Calculate based on 40 km/h speed
    const distance = haversineDistance(this.sgwStop, this.loyolaStop);
    return (distance / 40) * 60; // Convert to minutes
  }
}

export default TravelFacade;
