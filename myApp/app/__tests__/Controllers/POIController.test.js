import POIController from "../../controllers/POIController";
import POIModel from "../../models/POIModel";

// Mock dependencies
jest.mock("../../models/POIModel", () => ({
  fetchPlaces: jest.fn(),
  getDistanceToPOI: jest.fn(),
  loadCachedData: jest.fn(),
  hasRegionChanged: jest.fn(),
  coffeeShops: [],
  restaurants: [],
  activities: [],
  lastFetchedRegion: null,
  loading: false,
  cleanup: jest.fn(),
  subscribe: jest.fn(),
}));

describe("POIController Tests", () => {
  let mockMapRef;
  let mockUpdateOrigin;
  let mockUpdateDestination;
  let mockUpdateShowTransportation;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Initialize mock POI data
    POIModel.coffeeShops = [{ id: "coffee1", place_id: "coffee1" }];
    POIModel.restaurants = [{ id: "restaurant1", place_id: "restaurant1" }];
    POIModel.activities = [{ id: "activity1", place_id: "activity1" }];
    POIModel.lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
    POIModel.loading = false;
    
    // Create mock refs and functions
    mockMapRef = {
      current: {
        getCamera: jest.fn().mockResolvedValue({
          centerCoordinate: [-73.5792, 45.4952]
        })
      }
    };
    
    mockUpdateOrigin = jest.fn();
    mockUpdateDestination = jest.fn();
    mockUpdateShowTransportation = jest.fn();
  });

  describe("fetchPOIs", () => {
    test("should call model's fetchPlaces with provided arguments", async () => {
      const region = { latitude: 45.4962, longitude: -73.5772 };
      const signal = new AbortController().signal;
      
      POIModel.fetchPlaces.mockResolvedValueOnce(true);
      
      const result = await POIController.fetchPOIs(region, signal);
      
      expect(POIModel.fetchPlaces).toHaveBeenCalledWith(region, signal);
      expect(result).toBe(true);
    });
  });

  describe("getDistanceToPOI", () => {
    test("should call model's getDistanceToPOI method", () => {
      const poi = { id: "poi1" };
      const location = { latitude: 45.4962, longitude: -73.5772 };
      
      POIModel.getDistanceToPOI.mockReturnValueOnce(100);
      
      const result = POIController.getDistanceToPOI(poi, location);
      
      expect(POIModel.getDistanceToPOI).toHaveBeenCalledWith(poi, location);
      expect(result).toBe(100);
    });
  });

  describe("loadCachedPOIs", () => {
    test("should call model's loadCachedData method", () => {
      POIModel.loadCachedData.mockReturnValueOnce(true);
      
      const result = POIController.loadCachedPOIs();
      
      expect(POIModel.loadCachedData).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe("shouldShowUpdateButton", () => {
    test("should call model's hasRegionChanged with current region and threshold", () => {
      const currentRegion = { latitude: 45.4970, longitude: -73.5780 };
      
      POIModel.hasRegionChanged.mockReturnValueOnce(true);
      
      const result = POIController.shouldShowUpdateButton(currentRegion);
      
      expect(POIModel.hasRegionChanged).toHaveBeenCalledWith(currentRegion, POIController.REGION_CHANGE_THRESHOLD);
      expect(result).toBe(true);
    });
  });

  describe("getter methods", () => {
    test("getCoffeeShops should return model's coffeeShops", () => {
      const result = POIController.getCoffeeShops();
      expect(result).toBe(POIModel.coffeeShops);
    });
    
    test("getRestaurants should return model's restaurants", () => {
      const result = POIController.getRestaurants();
      expect(result).toBe(POIModel.restaurants);
    });
    
    test("getActivities should return model's activities", () => {
      const result = POIController.getActivities();
      expect(result).toBe(POIModel.activities);
    });
    
    test("getLastFetchedRegion should return model's lastFetchedRegion", () => {
      const result = POIController.getLastFetchedRegion();
      expect(result).toBe(POIModel.lastFetchedRegion);
    });
    
    test("isLoading should return model's loading state", () => {
      const result = POIController.isLoading();
      expect(result).toBe(POIModel.loading);
    });
  });

  describe("abortActiveRequest", () => {
    test("should call model's cleanup method", () => {
      POIController.abortActiveRequest();
      expect(POIModel.cleanup).toHaveBeenCalled();
    });
  });

  describe("subscribe", () => {
    test("should call model's subscribe method with callback", () => {
      const callback = jest.fn();
      const mockSubscription = { unsubscribe: jest.fn() };
      
      POIModel.subscribe.mockReturnValueOnce(mockSubscription);
      
      const result = POIController.subscribe(callback);
      
      expect(POIModel.subscribe).toHaveBeenCalledWith(callback);
      expect(result).toBe(mockSubscription);
    });
  });

  describe("handlePOIPress", () => {
    test("should return null if the same POI is clicked", () => {
      const selectedPOI = { place_id: "poi1" };
      const poi = { place_id: "poi1" };
      
      const result = POIController.handlePOIPress(selectedPOI, poi);
      
      expect(result).toBeNull();
    });
    
    test("should return the new POI if a different POI is clicked", () => {
      const selectedPOI = { place_id: "poi1" };
      const poi = { place_id: "poi2" };
      
      const result = POIController.handlePOIPress(selectedPOI, poi);
      
      expect(result).toBe(poi);
    });
    
    test("should return the POI if no POI was previously selected", () => {
      const selectedPOI = null;
      const poi = { place_id: "poi1" };
      
      const result = POIController.handlePOIPress(selectedPOI, poi);
      
      expect(result).toBe(poi);
    });
  });

  describe("handlePOIGetDirections", () => {
    test("should set origin, destination and show transportation when user location is available", () => {
      const poi = {
        geometry: {
          location: {
            lat: 45.4967,
            lng: -73.5782
          }
        }
      };
      const userLocation = { latitude: 45.4962, longitude: -73.5772 };
      
      POIController.handlePOIGetDirections(
        poi,
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation,
        mockUpdateShowTransportation
      );
      
      expect(mockUpdateOrigin).toHaveBeenCalledWith(userLocation);
      expect(mockUpdateDestination).toHaveBeenCalledWith({
        latitude: 45.4967,
        longitude: -73.5782
      });
      expect(mockUpdateShowTransportation).toHaveBeenCalledWith(true);
    });
    
    test("should not set directions if POI data is incomplete", () => {
      const poi = { incomplete: true };
      const userLocation = { latitude: 45.4962, longitude: -73.5772 };
      
      console.error = jest.fn();
      
      POIController.handlePOIGetDirections(
        poi,
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation,
        mockUpdateShowTransportation
      );
      
      expect(console.error).toHaveBeenCalledWith("POI data is incomplete!", poi);
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
      expect(mockUpdateDestination).not.toHaveBeenCalled();
      expect(mockUpdateShowTransportation).not.toHaveBeenCalled();
    });
    
    test("should log error when user location is not available", () => {
      const poi = {
        geometry: {
          location: {
            lat: 45.4967,
            lng: -73.5782
          }
        }
      };
      const userLocation = null;
      
      console.error = jest.fn();
      
      POIController.handlePOIGetDirections(
        poi,
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation,
        mockUpdateShowTransportation
      );
      
      expect(console.error).toHaveBeenCalledWith("User location is not available for directions");
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
      expect(mockUpdateDestination).not.toHaveBeenCalled();
      expect(mockUpdateShowTransportation).not.toHaveBeenCalled();
    });
  });

  describe("handleRegionChange", () => {
    test("should return null if isRegionChangingRef is true", () => {
      const feature = {
        properties: {
          visibleBounds: [
            [-73.58, 45.49],
            [-73.57, 45.50]
          ]
        }
      };
      const isRegionChangingRef = { current: true };
      
      const result = POIController.handleRegionChange(feature, isRegionChangingRef, true, { latitude: 45.4962, longitude: -73.5772 });
      
      expect(result).toBeNull();
    });
    
    test("should return null if feature or feature.properties is undefined", () => {
      const feature = undefined;
      const isRegionChangingRef = { current: false };
      
      const result = POIController.handleRegionChange(feature, isRegionChangingRef, true, { latitude: 45.4962, longitude: -73.5772 });
      
      expect(result).toBeNull();
    });
    
    test("should calculate new region and shouldShowUpdateButton values", () => {
      const feature = {
        properties: {
          visibleBounds: [
            [-73.58, 45.49],
            [-73.57, 45.50]
          ]
        }
      };
      const isRegionChangingRef = { current: false };
      const showPOI = true;
      const lastFetchedRegion = { latitude: 45.4962, longitude: -73.5772 };
      
      POIModel.hasRegionChanged.mockReturnValueOnce(true);
      
      const result = POIController.handleRegionChange(feature, isRegionChangingRef, showPOI, lastFetchedRegion);
      
      // Since there can be floating point precision issues with the values, check approximately
      expect(result).toHaveProperty('newRegion');
      expect(result.newRegion.latitude).toBeCloseTo(45.495, 5);
      expect(result.newRegion.longitude).toBeCloseTo(-73.575, 5);
      expect(result.newRegion.latitudeDelta).toBe(0.005);
      expect(result.newRegion.longitudeDelta).toBe(0.005);
      expect(result.shouldShowUpdateButton).toBe(true);
      
      expect(POIModel.hasRegionChanged).toHaveBeenCalled();
    });
    
    test("should handle invalid bounds gracefully", () => {
      const feature = {
        properties: {
          visibleBounds: []
        }
      };
      const isRegionChangingRef = { current: false };
      
      const result = POIController.handleRegionChange(feature, isRegionChangingRef, true, { latitude: 45.4962, longitude: -73.5772 });
      
      expect(result).toBeNull();
    });
  });

  describe("handleFetchPlaces", () => {
    test("should use current region if provided", async () => {
      const currentRegion = { latitude: 45.4962, longitude: -73.5772 };
      const isFetchingRef = { current: false };
      
      POIModel.fetchPlaces.mockResolvedValueOnce(true);
      
      const result = await POIController.handleFetchPlaces(mockMapRef, currentRegion, isFetchingRef);
      
      // The fetchPlaces method will be called with just the region in the implementation
      expect(POIModel.fetchPlaces).toHaveBeenCalled();
      expect(POIModel.fetchPlaces.mock.calls[0][0]).toEqual(currentRegion);
      expect(result).toEqual({ success: true });
      expect(isFetchingRef.current).toBe(false);
    });
    
    test("should use camera position if no region is provided", async () => {
      const isFetchingRef = { current: false };
      
      POIModel.fetchPlaces.mockResolvedValueOnce(true);
      
      const result = await POIController.handleFetchPlaces(mockMapRef, null, isFetchingRef);
      
      expect(mockMapRef.current.getCamera).toHaveBeenCalled();
      // Verify the region was calculated from the camera coordinates
      expect(POIModel.fetchPlaces).toHaveBeenCalled();
      const calledRegion = POIModel.fetchPlaces.mock.calls[0][0];
      expect(calledRegion.latitude).toBeCloseTo(45.4952, 5);
      expect(calledRegion.longitude).toBeCloseTo(-73.5792, 5);
      expect(calledRegion.latitudeDelta).toBe(0.005);
      expect(calledRegion.longitudeDelta).toBe(0.005);
      
      expect(result).toEqual({ success: true });
      expect(isFetchingRef.current).toBe(false);
    });
    
    test("should handle error when no region can be determined", async () => {
      mockMapRef.current.getCamera.mockResolvedValueOnce({});
      const isFetchingRef = { current: false };
      
      console.error = jest.fn();
      
      const result = await POIController.handleFetchPlaces(mockMapRef, null, isFetchingRef);
      
      expect(console.error).toHaveBeenCalledWith("Cannot fetch POIs: No region provided");
      expect(POIModel.fetchPlaces).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false });
    });
    
    test("should skip if fetch is already in progress", async () => {
      const currentRegion = { latitude: 45.4962, longitude: -73.5772 };
      const isFetchingRef = { current: true };
      
      console.log = jest.fn();
      
      const result = await POIController.handleFetchPlaces(mockMapRef, currentRegion, isFetchingRef);
      
      expect(console.log).toHaveBeenCalledWith("Fetch already in progress, skipping");
      expect(POIModel.fetchPlaces).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false });
    });
    
    test("should handle fetch errors", async () => {
      const currentRegion = { latitude: 45.4962, longitude: -73.5772 };
      const isFetchingRef = { current: false };
      const error = new Error("Fetch error");
      
      POIModel.fetchPlaces.mockRejectedValueOnce(error);
      console.error = jest.fn();
      
      const result = await POIController.handleFetchPlaces(mockMapRef, currentRegion, isFetchingRef);
      
      // Verify fetchPlaces was called with the region
      expect(POIModel.fetchPlaces).toHaveBeenCalled();
      expect(POIModel.fetchPlaces.mock.calls[0][0]).toEqual(currentRegion);
      
      expect(console.error).toHaveBeenCalledWith("Error fetching places:", error);
      expect(result).toEqual({ success: false, error });
      expect(isFetchingRef.current).toBe(false);
    });
  });
});