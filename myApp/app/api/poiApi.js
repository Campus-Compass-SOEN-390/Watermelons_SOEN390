// src/services/poiService.js
import Constants from "expo-constants";
import poiDataSubject from "./POIDataSubject";

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;
const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Keep the in-memory cache for backward compatibility
const POI_CACHE = {
  coffeeShops: [],
  restaurants: [],
  activities: [],
  lastRegion: null,
  lastFetchTime: 0,
};

/**
 * Update POI cache and notify observers
 * This implements the Observer pattern by updating the subject
 * which then notifies all observers (Map view and POI List)
 */
export const updatePOICache = (coffee, resto, act, regionData) => {
  // Update the old cache for backward compatibility
  POI_CACHE.coffeeShops = coffee;
  POI_CACHE.restaurants = resto;
  POI_CACHE.activities = act;
  POI_CACHE.lastRegion = regionData;
  POI_CACHE.lastFetchTime = Date.now();
  
  // Update the subject (observable) with new data
  poiDataSubject.updateData({
    coffeeShops: coffee,
    restaurants: resto,
    activities: act,
    lastRegion: regionData,
    lastFetchTime: Date.now(),
  });
};

export const getCachedPOIData = () => {
  return POI_CACHE;
};

/**
 * Fetch POI data from Google Places API
 * 
 * This function now integrates with the observer pattern by:
 * 1. Setting loading state on the subject
 * 2. Updating the subject with new data when fetch completes
 *
 * @param {Object} currentRegion - Map region to fetch POIs for
 * @param {AbortSignal} signal - AbortController signal for cancellation
 */
export const fetchPOIData = async (currentRegion, signal) => {
  if (!currentRegion?.latitude || !currentRegion?.longitude) {
    console.error("Invalid region data:", currentRegion);
    throw new Error("Invalid region data for POI fetch");
  }

  console.log("Fetching POI data for region:", currentRegion);
  poiDataSubject.setLoading(true);
  
  let allResults = [];
  const types = ["cafe", "restaurant", "tourist_attraction", "movie_theater"];
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&type=${types.join(
    "|"
  )}&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    let response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    let data = await response.json();
    
    if (data.status === "ZERO_RESULTS") {
      console.log("Zero results, trying with keywords");
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|cinema|tourist&key=${GOOGLE_PLACES_API_KEY}`;
      response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Keyword API request failed with status ${response.status}`);
      }
      data = await response.json();
    }
    
    if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
      throw new Error(`API request denied: ${data.error_message || "Unknown error"}`);
    }
    
    allResults = data.results || [];
    console.log(`Initial fetch returned ${allResults.length} POIs`);
    
    let pageCount = 0;
    while (data.next_page_token && pageCount < 2) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (signal.aborted) {
        throw new Error("Request was aborted");
      }
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
      response = await fetch(url, { signal });
      data = await response.json();
      if (data.results) {
        allResults = [...allResults, ...data.results];
        console.log(`Pagination ${pageCount + 1} returned ${data.results.length} additional POIs`);
      }
      pageCount++;
    }
    
    // Categorize results
    const coffee = [];
    const resto = [];
    const act = [];
    const seenPlaceIds = new Set();
    
    allResults.forEach((place) => {
      if (seenPlaceIds.has(place.place_id)) return;
      seenPlaceIds.add(place.place_id);
      const name = place.name.toLowerCase();
      const types = place.types || [];
      
      if (types.includes("restaurant") || types.includes("meal_takeaway") || types.includes("meal_delivery")) {
        resto.push(place);
      } else if (types.includes("cafe") || name.includes("coffee") || types.includes("bakery")) {
        coffee.push(place);
      } else if (
        types.includes("tourist_attraction") ||
        types.includes("movie_theater") ||
        types.includes("amusement_park") ||
        types.includes("museum") ||
        name.includes("tourist") ||
        name.includes("bowling") ||
        name.includes("cinema") ||
        name.includes("theater") ||
        name.includes("museum") ||
        name.includes("attraction")
      ) {
        act.push(place);
      }
    });
    
    console.log(`Categorized POIs: ${coffee.length} cafes, ${resto.length} restaurants, ${act.length} activities`);
    
    // Update the subject data, which will notify all observers
    updatePOICache(coffee, resto, act, currentRegion);
    
    return { coffee, resto, act };
  } catch (error) {
    console.error("Error in fetchPOIData:", error);
    throw error;
  } finally {
    poiDataSubject.setLoading(false);
  }
};

/**
 * Check if POI data needs to be updated based on region and time
 * @param {Object} newRegion - Current map region
 * @returns {boolean} Whether data should be fetched
 */
export const shouldUpdatePOIData = (newRegion) => {
  const currentData = poiDataSubject.getData();
  const now = Date.now();
  
  return (
    // If no data exists, definitely fetch
    (currentData.coffeeShops.length === 0 && 
     currentData.restaurants.length === 0 && 
     currentData.activities.length === 0) ||
    
    // If region has changed significantly, fetch
    poiDataSubject.hasRegionChanged(newRegion) ||
    
    // If data is older than cache timeout, fetch
    (now - currentData.lastFetchTime > CACHE_TIMEOUT)
  );
};

export { poiDataSubject };
