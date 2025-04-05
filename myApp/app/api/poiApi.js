// src/services/poiService.js
import Constants from "expo-constants";
import poiDataSubject from "./POIDataSubject";
import * as FileSystem from 'expo-file-system';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;
const CACHE_TIMEOUT = 30 * 60 * 1000; // Extended to 30 minutes
const CACHE_FILE = `${FileSystem.cacheDirectory}poi_cache.json`;

// Keep the in-memory cache for backward compatibility
const POI_CACHE = {
  coffeeShops: [],
  restaurants: [],
  activities: [],
  lastRegion: null,
  lastFetchTime: 0,
};

/**
 * Save POI data to persistent cache
 * @param {Object} data - POI data to cache
 */
const savePOICache = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(
      CACHE_FILE,
      JSON.stringify(data),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    console.log("POI data saved to persistent cache");
  } catch (error) {
    console.error("Error saving POI cache:", error);
  }
};

/**
 * Load POI data from persistent cache
 * @returns {Object} Cached POI data or null if no cache exists
 */
export const loadPOICache = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(CACHE_FILE);
    if (fileInfo.exists) {
      const cacheData = await FileSystem.readAsStringAsync(CACHE_FILE);
      const parsedData = JSON.parse(cacheData);
      console.log("Loaded POI data from persistent cache");
      
      // Update in-memory cache and subject
      Object.assign(POI_CACHE, parsedData);
      poiDataSubject.updateData(parsedData);
      
      return parsedData;
    }
  } catch (error) {
    console.error("Error loading POI cache:", error);
  }
  return null;
};

/**
 * Update POI cache and notify observers
 * This implements the Observer pattern by updating the subject
 * which then notifies all observers (Map view and POI List)
 */
export const updatePOICache = (coffee, resto, act, regionData) => {
  const newCacheData = {
    coffeeShops: coffee,
    restaurants: resto,
    activities: act,
    lastRegion: regionData,
    lastFetchTime: Date.now(),
  };
  
  // Update the old cache for backward compatibility
  Object.assign(POI_CACHE, newCacheData);
  
  // Update the subject (observable) with new data
  poiDataSubject.updateData(newCacheData);
  
  // Save to persistent cache
  savePOICache(newCacheData);
};

export const getCachedPOIData = () => {
  return POI_CACHE;
};

/**
 * Fetch POI data from Google Places API with progressive loading
 * 
 * @param {Object} currentRegion - Map region to fetch POIs for
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @param {Array} typesToFetch - Optional array of POI types to fetch (for partial updates)
 */
export const fetchPOIData = async (currentRegion, signal, typesToFetch = ['cafe', 'restaurant', 'attraction']) => {
  if (!currentRegion?.latitude || !currentRegion?.longitude) {
    console.error("Invalid region data:", currentRegion);
    throw new Error("Invalid region data for POI fetch");
  }

  console.log("Fetching POI data for region:", currentRegion);
  poiDataSubject.setLoading(true);
  
  const currentData = poiDataSubject.getData();
  let coffee = [...currentData.coffeeShops];
  let resto = [...currentData.restaurants];
  let act = [...currentData.activities];
  
  try {
    // Process each POI type in sequence for progressive loading
    for (const poiType of typesToFetch) {
      if (signal.aborted) throw new Error("Request was aborted");
      
      if (poiType === 'cafe' && !typesToFetch.includes('cafe')) continue;
      if (poiType === 'restaurant' && !typesToFetch.includes('restaurant')) continue;
      if (poiType === 'attraction' && !typesToFetch.includes('attraction')) continue;
      
      console.log(`Fetching ${poiType} POIs...`);
      
      let typeQuery = '';
      let keywordQuery = '';
      
      if (poiType === 'cafe') {
        typeQuery = 'cafe';
        keywordQuery = 'coffee|bakery';
      } else if (poiType === 'restaurant') {
        typeQuery = 'restaurant';
        keywordQuery = 'food|meal';
      } else if (poiType === 'attraction') {
        typeQuery = 'tourist_attraction|movie_theater';
        keywordQuery = 'tourist|cinema|museum|attraction';
      }
      
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&type=${typeQuery}&key=${GOOGLE_PLACES_API_KEY}`;
      
      let response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      let data = await response.json();
      
      if (data.status === "ZERO_RESULTS") {
        console.log(`Zero results for ${poiType}, trying with keywords`);
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=${keywordQuery}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`Keyword API request failed with status ${response.status}`);
        }
        data = await response.json();
      }
      
      if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
        throw new Error(`API request denied: ${data.error_message || "Unknown error"}`);
      }
      
      let results = data.results || [];
      console.log(`Initial fetch for ${poiType} returned ${results.length} POIs`);
      
      // Only get the next page if we have less than 10 results
      let pageCount = 0;
      if (results.length < 10 && data.next_page_token && pageCount < 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (signal.aborted) {
          throw new Error("Request was aborted");
        }
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
        response = await fetch(url, { signal });
        data = await response.json();
        if (data.results) {
          results = [...results, ...data.results];
          console.log(`Pagination for ${poiType} returned ${data.results.length} additional POIs`);
        }
      }
      
      // Process and categorize the results
      if (poiType === 'cafe') {
        // Use a Set to deduplicate by place_id
        const seenPlaceIds = new Set();
        coffee = results
          .filter(place => {
            // Only include the place if we haven't seen this place_id yet
            const isDuplicate = seenPlaceIds.has(place.place_id);
            if (!isDuplicate && (
              place.types.includes("cafe") || 
              place.name.toLowerCase().includes("coffee") || 
              place.types.includes("bakery")
            )) {
              seenPlaceIds.add(place.place_id);
              return true;
            }
            return false;
          });
          
        // Update immediately to show something to the user
        updatePOICache(coffee, resto, act, currentRegion);
      }
      else if (poiType === 'restaurant') {
        // Use a Set to deduplicate by place_id
        const seenPlaceIds = new Set();
        resto = results
          .filter(place => {
            // Only include the place if we haven't seen this place_id yet
            const isDuplicate = seenPlaceIds.has(place.place_id);
            if (!isDuplicate && (
              place.types.includes("restaurant") || 
              place.types.includes("meal_takeaway") || 
              place.types.includes("meal_delivery")
            )) {
              seenPlaceIds.add(place.place_id);
              return true;
            }
            return false;
          });
          
        // Update immediately
        updatePOICache(coffee, resto, act, currentRegion);
      }
      else if (poiType === 'attraction') {
        // Use a Set to deduplicate by place_id
        const seenPlaceIds = new Set();
        act = results
          .filter(place => {
            // Only include the place if we haven't seen this place_id yet
            const isDuplicate = seenPlaceIds.has(place.place_id);
            if (!isDuplicate && (
              place.types.includes("tourist_attraction") || 
              place.types.includes("movie_theater") || 
              place.types.includes("amusement_park") || 
              place.types.includes("museum") ||
              place.name.toLowerCase().includes("tourist") || 
              place.name.toLowerCase().includes("cinema") || 
              place.name.toLowerCase().includes("theater") || 
              place.name.toLowerCase().includes("museum") || 
              place.name.toLowerCase().includes("attraction")
            )) {
              seenPlaceIds.add(place.place_id);
              return true;
            }
            return false;
          });
          
        // Update immediately
        updatePOICache(coffee, resto, act, currentRegion);
      }
    }
    
    console.log(`Final categorized POIs: ${coffee.length} cafes, ${resto.length} restaurants, ${act.length} activities`);
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
  
  // Check if we have any data at all
  const hasNoData = currentData.coffeeShops.length === 0 && 
                    currentData.restaurants.length === 0 && 
                    currentData.activities.length === 0;
  
  // Check if the region has changed significantly
  const regionChanged = poiDataSubject.hasRegionChanged(newRegion);
  
  // Check if the cache has expired
  const cacheExpired = now - currentData.lastFetchTime > CACHE_TIMEOUT;
  
  console.log(`POI Update Check: No data: ${hasNoData}, Region changed: ${regionChanged}, Cache expired: ${cacheExpired}`);
  
  return hasNoData || regionChanged || cacheExpired;
};

// Pre-compute distance (optimization for filtering)
export const precomputeDistances = (pois, userLocation) => {
  if (!userLocation || !pois || pois.length === 0) return pois;
  
  const R = 6371; // Radius of the earth in km
  
  return pois.map(poi => {
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = poi.geometry?.location?.lat;
    const lon2 = poi.geometry?.location?.lng;
    
    if (!lat2 || !lon2) {
      poi._distance = null;
      return poi;
    }
    
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    // Store the distance directly on the POI object for faster sorting/filtering
    poi._distance = distance;
    return poi;
  });
};

export { poiDataSubject };
