import POIModel from "../../models/POIModel";
import { fetchPOIData, poiDataSubject, getCachedPOIData } from "../../api/poiApi";

// Mock the dependencies
jest.mock("../../api/poiApi", () => ({
  fetchPOIData: jest.fn(),
  poiDataSubject: {
    subscribe: jest.fn(),
  },
  getCachedPOIData: jest.fn(),
}));

// Mock console methods to reduce noise
console.log = jest.fn();
console.error = jest.fn();

describe("POIModel Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset POIModel state for each test
    POIModel.coffeeShops = [];
    POIModel.restaurants = [];
    POIModel.activities = [];
    POIModel.loading = false;
    POIModel.lastFetchedRegion = null;
    POIModel.activeRequest = null;
    POIModel.isFetching = false;
  });

  describe("calculateDistance", () => {
    test("should calculate distance between two coordinates correctly", () => {
      // Example: Montreal to Toronto distance is approximately 505-510km
      const montrealCoords = { lat: 45.5017, lon: -73.5673 };
      const torontoCoords = { lat: 43.6532, lon: -79.3832 };
      
      const distance = POIModel.calculateDistance(
        montrealCoords.lat, 
        montrealCoords.lon, 
        torontoCoords.lat, 
        torontoCoords.lon
      );
      
      // Convert to km for easier validation
      const distanceInKm = distance / 1000;
      
      // Should be approximately 500km
      expect(distanceInKm).toBeGreaterThan(500);
      expect(distanceInKm).toBeLessThan(520);
    });

    test("should return 0 for same coordinates", () => {
      const coords = { lat: 45.5017, lon: -73.5673 };
      
      const distance = POIModel.calculateDistance(
        coords.lat, 
        coords.lon, 
        coords.lat, 
        coords.lon
      );
      
      expect(distance).toBe(0);
    });
  });

  describe("getDistanceToPOI", () => {
    test("should return distance to POI from reference location", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      const poi = {
        geometry: {
          location: {
            lat: 45.4967,
            lng: -73.5782
          }
        }
      };
      
      const distance = POIModel.getDistanceToPOI(poi, location);
      
      // Should be a small distance (approximately 100-150 meters)
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200);
    });

    test("should return null if location is not provided", () => {
      const poi = {
        geometry: {
          location: {
            lat: 45.4967,
            lng: -73.5782
          }
        }
      };
      
      const distance = POIModel.getDistanceToPOI(poi, null);
      
      expect(distance).toBeNull();
    });

    test("should return null if POI has no geometry location", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      const poi = {};
      
      const distance = POIModel.getDistanceToPOI(poi, location);
      
      expect(distance).toBeNull();
    });
  });

  describe("fetchPlaces", () => {
    test("should skip fetch if already fetching", async () => {
      POIModel.isFetching = true;
      
      const result = await POIModel.fetchPlaces({ latitude: 45.4962, longitude: -73.5772 });
      
      expect(console.log).toHaveBeenCalledWith("Fetch already in progress, skipping");
      expect(fetchPOIData).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test("should return error if no region is provided", async () => {
      const result = await POIModel.fetchPlaces(null);
      
      expect(console.error).toHaveBeenCalledWith("Cannot fetch POIs: No region provided");
      expect(fetchPOIData).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test("should call fetchPOIData with region and return true when successful", async () => {
      const region = { latitude: 45.4962, longitude: -73.5772 };
      fetchPOIData.mockResolvedValueOnce();
      
      const result = await POIModel.fetchPlaces(region);
      
      expect(fetchPOIData).toHaveBeenCalledWith(region, expect.any(Object));
      expect(result).toBe(true);
      expect(POIModel.isFetching).toBe(false);
      expect(POIModel.loading).toBe(false);
      expect(POIModel.activeRequest).toBeNull();
    });

    test("should handle aborted fetch gracefully", async () => {
      const region = { latitude: 45.4962, longitude: -73.5772 };
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      fetchPOIData.mockRejectedValueOnce(abortError);
      
      const result = await POIModel.fetchPlaces(region);
      
      expect(fetchPOIData).toHaveBeenCalledWith(region, expect.any(Object));
      expect(console.log).toHaveBeenCalledWith("Fetch aborted - this is normal during unmount or when starting a new request");
      expect(result).toBe(false);
      expect(POIModel.isFetching).toBe(false);
      expect(POIModel.loading).toBe(false);
      expect(POIModel.activeRequest).toBeNull();
    });

    test("should handle fetch errors gracefully", async () => {
      const region = { latitude: 45.4962, longitude: -73.5772 };
      const error = new Error("Network error");
      fetchPOIData.mockRejectedValueOnce(error);
      
      const result = await POIModel.fetchPlaces(region);
      
      expect(fetchPOIData).toHaveBeenCalledWith(region, expect.any(Object));
      expect(console.error).toHaveBeenCalledWith("Error fetching places:", error);
      expect(result).toBe(false);
      expect(POIModel.isFetching).toBe(false);
      expect(POIModel.loading).toBe(false);
      expect(POIModel.activeRequest).toBeNull();
    });
  });

  describe("loadCachedData", () => {
    test("should load cached data successfully and return true", () => {
      const cachedData = {
        coffeeShops: [{ id: 'coffee1' }],
        restaurants: [{ id: 'restaurant1' }],
        activities: [{ id: 'activity1' }],
        lastRegion: { latitude: 45.4962, longitude: -73.5772 }
      };
      
      getCachedPOIData.mockReturnValueOnce(cachedData);
      
      const result = POIModel.loadCachedData();
      
      expect(getCachedPOIData).toHaveBeenCalled();
      expect(POIModel.coffeeShops).toEqual(cachedData.coffeeShops);
      expect(POIModel.restaurants).toEqual(cachedData.restaurants);
      expect(POIModel.activities).toEqual(cachedData.activities);
      expect(POIModel.lastFetchedRegion).toEqual(cachedData.lastRegion);
      expect(result).toBe(true);
    });

    test("should return false if cached data is empty", () => {
      const cachedData = {
        coffeeShops: [],
        restaurants: [],
        activities: [],
      };
      
      getCachedPOIData.mockReturnValueOnce(cachedData);
      
      const result = POIModel.loadCachedData();
      
      expect(getCachedPOIData).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test("should handle errors and return false", () => {
      getCachedPOIData.mockImplementationOnce(() => {
        throw new Error("Failed to load cache");
      });
      
      const result = POIModel.loadCachedData();
      
      expect(getCachedPOIData).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Error loading cached POI data:", expect.any(Error));
      expect(result).toBe(false);
    });
  });

  describe("hasRegionChanged", () => {
    test("should return false if lastFetchedRegion is null", () => {
      POIModel.lastFetchedRegion = null;
      const newRegion = { latitude: 45.4962, longitude: -73.5772 };
      
      const result = POIModel.hasRegionChanged(newRegion);
      
      expect(result).toBe(false);
    });

    test("should return false if newRegion is null", () => {
      POIModel.lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
      
      const result = POIModel.hasRegionChanged(null);
      
      expect(result).toBe(false);
    });

    test("should return false if region difference is less than threshold", () => {
      POIModel.lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
      const newRegion = { latitude: 45.4964, longitude: -73.5774 }; // Small difference
      
      const result = POIModel.hasRegionChanged(newRegion, 0.005);
      
      expect(result).toBe(false);
    });

    test("should return true if latitude difference exceeds threshold", () => {
      POIModel.lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
      const newRegion = { latitude: 45.5015, longitude: -73.5772 }; // Lat difference > 0.005
      
      const result = POIModel.hasRegionChanged(newRegion, 0.005);
      
      expect(result).toBe(true);
    });

    test("should return true if longitude difference exceeds threshold", () => {
      POIModel.lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
      const newRegion = { latitude: 45.4962, longitude: -73.5830 }; // Lng difference > 0.005
      
      const result = POIModel.hasRegionChanged(newRegion, 0.005);
      
      expect(result).toBe(true);
    });
  });

  describe("cleanup", () => {
    test("should abort active request and set to null", () => {
      const mockAbort = jest.fn();
      POIModel.activeRequest = { abort: mockAbort };
      
      POIModel.cleanup();
      
      expect(mockAbort).toHaveBeenCalled();
      expect(POIModel.activeRequest).toBeNull();
    });

    test("should do nothing if no active request", () => {
      POIModel.activeRequest = null;
      
      POIModel.cleanup();
      
      expect(POIModel.activeRequest).toBeNull();
    });
  });

  describe("subscribe", () => {
    test("should call poiDataSubject.subscribe with callback", () => {
      const mockCallback = jest.fn();
      const mockSubscription = { unsubscribe: jest.fn() };
      poiDataSubject.subscribe.mockReturnValueOnce(mockSubscription);
      
      const result = POIModel.subscribe(mockCallback);
      
      expect(poiDataSubject.subscribe).toHaveBeenCalledWith(mockCallback);
      expect(result).toBe(mockSubscription);
    });
  });
});