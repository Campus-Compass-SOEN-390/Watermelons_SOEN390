// src/services/poiService.js
import Constants from "expo-constants";
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

// In-memory cache for POI data
const POI_CACHE = {
  coffeeShops: [],
  restaurants: [],
  activities: [],
  lastRegion: null,
  lastFetchTime: 0,
};

const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const updatePOICache = (coffee, resto, act, regionData) => {
  POI_CACHE.coffeeShops = coffee;
  POI_CACHE.restaurants = resto;
  POI_CACHE.activities = act;
  POI_CACHE.lastRegion = regionData;
  POI_CACHE.lastFetchTime = Date.now();
};

export const getCachedPOIData = () => {
  return POI_CACHE;
};

export const fetchPOIData = async (currentRegion, signal) => {
  let allResults = [];
  const types = ["cafe", "restaurant", "tourist_attraction", "movie_theater"];
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&type=${types.join(
    "|"
  )}&key=${GOOGLE_PLACES_API_KEY}`;
  let response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  let data = await response.json();
  
  if (data.status === "ZERO_RESULTS") {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentRegion.latitude},${currentRegion.longitude}&radius=2000&keyword=coffee|restaurant|cinema|tourist&key=${GOOGLE_PLACES_API_KEY}`;
    response = await fetch(url, { signal });
    data = await response.json();
  }
  if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
    throw new Error(`API request denied: ${data.error_message || "Unknown error"}`);
  }
  allResults = data.results || [];
  
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
  
  return { coffee, resto, act };
};
