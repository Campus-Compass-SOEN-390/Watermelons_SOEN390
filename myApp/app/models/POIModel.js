import { fetchPOIData, poiDataSubject, getCachedPOIData } from "../api/poiApi";

class POIModel {
  constructor() {
    this.coffeeShops = [];
    this.restaurants = [];
    this.activities = [];
    this.loading = false;
    this.lastFetchedRegion = null;
    this.activeRequest = null;
    this.isFetching = false;
  }

  // Calculate distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate distance to a specific POI from a reference location
  getDistanceToPOI(poi, location) {
    if (!location || !poi?.geometry?.location) return null;

    const lat1 = location.latitude;
    const lon1 = location.longitude;
    const lat2 = poi.geometry.location.lat;
    const lon2 = poi.geometry.location.lng;

    return this.calculateDistance(lat1, lon1, lat2, lon2);
  }

  // Fetch POI data
  async fetchPlaces(region, signal) {
    if (this.isFetching) {
      console.log("Fetch already in progress, skipping");
      return;
    }

    if (!region) {
      console.error("Cannot fetch POIs: No region provided");
      return;
    }

    this.isFetching = true;
    this.loading = true;

    const controller = new AbortController();
    this.activeRequest = controller;

    try {
      await fetchPOIData(region, signal || controller.signal);
      return true;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted - this is normal during unmount or when starting a new request");
      } else {
        console.error("Error fetching places:", error);
      }
      return false;
    } finally {
      this.isFetching = false;
      this.loading = false;
      this.activeRequest = null;
    }
  }

  // Load cached POI data
  loadCachedData() {
    try {
      const cachedData = getCachedPOIData();
      if (
        cachedData.coffeeShops.length > 0 ||
        cachedData.restaurants.length > 0 ||
        cachedData.activities.length > 0
      ) {
        this.coffeeShops = cachedData.coffeeShops;
        this.restaurants = cachedData.restaurants;
        this.activities = cachedData.activities;
        if (cachedData.lastRegion) {
          this.lastFetchedRegion = cachedData.lastRegion;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading cached POI data:", error);
      return false;
    }
  }

  // Check if region has changed enough to require a data refresh
  hasRegionChanged(newRegion, threshold = 0.005) {
    if (!this.lastFetchedRegion || !newRegion) return false;
    
    const latDiff = Math.abs(newRegion.latitude - this.lastFetchedRegion.latitude);
    const lngDiff = Math.abs(newRegion.longitude - this.lastFetchedRegion.longitude);
    
    return latDiff > threshold || lngDiff > threshold;
  }

  // Clean up any active requests
  cleanup() {
    if (this.activeRequest) {
      this.activeRequest.abort();
      this.activeRequest = null;
    }
  }

  // Subscribe to POI data changes
  subscribe(callback) {
    return poiDataSubject.subscribe(callback);
  }
}

export default new POIModel();
