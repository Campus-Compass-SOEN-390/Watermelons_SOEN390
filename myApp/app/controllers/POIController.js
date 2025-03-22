import POIModel from '../models/POIModel';

class POIController {
  constructor() {
    this.model = POIModel;
    this.REGION_CHANGE_THRESHOLD = 0.005;
  }

  async fetchPOIs(region, signal) {
    return await this.model.fetchPlaces(region, signal);
  }

  getDistanceToPOI(poi, location) {
    return this.model.getDistanceToPOI(poi, location);
  }

  loadCachedPOIs() {
    return this.model.loadCachedData();
  }

  shouldShowUpdateButton(currentRegion) {
    return this.model.hasRegionChanged(currentRegion, this.REGION_CHANGE_THRESHOLD);
  }

  getCoffeeShops() {
    return this.model.coffeeShops;
  }

  getRestaurants() {
    return this.model.restaurants;
  }

  getActivities() {
    return this.model.activities;
  }

  getLastFetchedRegion() {
    return this.model.lastFetchedRegion;
  }

  isLoading() {
    return this.model.loading;
  }

  abortActiveRequest() {
    this.model.cleanup();
  }

  // Subscribe to POI data changes (Observer pattern)
  subscribe(callback) {
    return this.model.subscribe(callback);
  }

  // Handle POI selection
  handlePOIPress(selectedPOI, poi) {
    // If the same POI is clicked, deselect it
    if (selectedPOI && selectedPOI.place_id === poi.place_id) {
      return null;
    }
    // Otherwise select the new POI
    return poi;
  }

  // Get directions to POI
  handlePOIGetDirections(poi, updateOrigin, updateDestination, userLocation, updateShowTransportation) {
    if (!poi || !poi.geometry || !poi.geometry.location) {
      console.error("POI data is incomplete!", poi);
      return;
    }

    const destination = {
      latitude: poi.geometry.location.lat,
      longitude: poi.geometry.location.lng,
    };

    // If user location is available, use it as origin
    if (userLocation) {
      updateOrigin(userLocation);
      updateDestination(destination);
      updateShowTransportation(true);
    } else {
      console.error("User location is not available for directions");
    }
  }

  // Handle region change for POI update button
  handleRegionChange(feature, isRegionChangingRef, showPOI, lastFetchedRegion) {
    if (isRegionChangingRef.current || !feature?.properties) return null;

    try {
      // Get the center coordinates from the visibleBounds property
      const { visibleBounds } = feature.properties;
      if (!visibleBounds || visibleBounds.length < 2) return null;

      // Calculate center from the visible bounds [sw, ne]
      const centerLng = (visibleBounds[0][0] + visibleBounds[1][0]) / 2;
      const centerLat = (visibleBounds[0][1] + visibleBounds[1][1]) / 2;

      if (isNaN(centerLat) || isNaN(centerLng)) return null;

      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      // Check if we should show update button
      const shouldShowUpdateButton = 
        showPOI && 
        lastFetchedRegion && 
        this.shouldShowUpdateButton(newRegion);

      return {
        newRegion,
        shouldShowUpdateButton
      };
    } catch (error) {
      console.error("Error in handleRegionChange:", error);
      return null;
    }
  }

  // Handle fetching places with current camera position
  async handleFetchPlaces(mapRef, currentRegion, isFetchingRef) {
    let regionToUse = currentRegion;

    // If no region provided, try to get camera position
    if (!regionToUse && mapRef.current) {
      try {
        const camera = await mapRef.current.getCamera();
        if (camera?.centerCoordinate) {
          regionToUse = {
            latitude: camera.centerCoordinate[1],
            longitude: camera.centerCoordinate[0],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
        }
      } catch (error) {
        console.error("Error getting camera position:", error);
      }
    }

    if (!regionToUse) {
      console.error("Cannot fetch POIs: No region provided");
      return { success: false };
    }

    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return { success: false };
    }

    try {
      isFetchingRef.current = true;
      await this.fetchPOIs(regionToUse);
      return { success: true };
    } catch (error) {
      console.error("Error fetching places:", error);
      return { success: false, error };
    } finally {
      isFetchingRef.current = false;
    }
  }
}

export default new POIController();
