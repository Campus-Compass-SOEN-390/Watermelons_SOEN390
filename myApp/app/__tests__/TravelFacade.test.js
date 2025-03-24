// TravelFacade.test.js
import TravelFacade from "../utils/TravelFacade";
import * as googleMapsApi from "../api/googleMapsApi";
import * as shuttleUtils from "../utils/shuttleUtils";
import * as shuttleOption from "../utils/addShuttleOption";
import * as distanceShuttle from "../utils/distanceShuttle";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";

// Mock all dependencies
jest.mock("../api/googleMapsApi");
jest.mock("../utils/shuttleUtils");
jest.mock("../utils/addShuttleOption");
jest.mock("../utils/distanceShuttle");

// Sample test data
const sampleOrigin = { latitude: 45.495304, longitude: -73.578468 }; // Downtown
const sampleDestination = { latitude: 45.458026, longitude: -73.638044 }; // Loyola
const sgwLocation = { latitude: 45.497092, longitude: -73.579364 }; // SGW
const modes = ["walking", "driving", "transit", "bicycling"];

const sampleGoogleResponse = {
  duration: 30,
  distance: "5 km",
  summary: "Test Route",
  coordinates: [
    [1, 2],
    [3, 4],
  ],
  steps: [{ instruction: "Go straight", distance: "1 km", duration: 10 }],
};

const sampleShuttleResponse = {
  waitTime: 10,
  shuttleRideTime: 20,
  totalTime: 30,
  nextShuttleTime: 120,
};

describe("TravelFacade", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    googleMapsApi.getGoogleTravelTime.mockResolvedValue(30);
    googleMapsApi.getTravelTimes.mockResolvedValue([
      { mode: "walking", duration: 45 },
      { mode: "driving", duration: 15 },
    ]);
    googleMapsApi.getAlternativeRoutes.mockResolvedValue([
      {
        mode: "driving",
        routes: [sampleGoogleResponse],
      },
    ]);

    shuttleUtils.estimateShuttleTravelTime.mockResolvedValue(35);
    shuttleUtils.estimateShuttleFromButton.mockResolvedValue(
      sampleShuttleResponse
    );

    shuttleOption.addShuttleOption.mockResolvedValue([
      {
        mode: "walking + Shuttle",
        duration: 55,
        distance: "3 km + 7.5 km",
        summary: "Via SGW → Shuttle",
        coordinates: [
          [1, 2],
          [3, 4],
        ],
        steps: [
          { instruction: "Walk to shuttle", distance: "3 km", duration: 25 },
          {
            instruction: "Wait for shuttle at SGW",
            distance: "0 km",
            duration: 10,
          },
          {
            instruction: "Take the shuttle to Loyola",
            distance: "7.5 km",
            duration: 20,
          },
        ],
        details: sampleShuttleResponse,
      },
    ]);

    // Setup mocks for distance functions
    distanceShuttle.haversineDistance.mockReturnValue(6.4);
    distanceShuttle.findNearestLocation.mockReturnValue(TravelFacade.sgwStop);
  });

  // Test for static shuttle stop properties
  test("has correct static shuttle stop properties", () => {
    expect(TravelFacade.sgwStop).toEqual({
      latitude: SGWtoLoyola.geometry.coordinates[0][1],
      longitude: SGWtoLoyola.geometry.coordinates[0][0],
    });
    expect(TravelFacade.loyolaStop).toEqual({
      latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
      longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
    });
  });

  // Tests for Google Maps API facade methods
  test("getGoogleTravelTime calls the underlying API with correct parameters", async () => {
    const result = await TravelFacade.getGoogleTravelTime(
      sampleOrigin,
      sampleDestination,
      "driving"
    );

    expect(googleMapsApi.getGoogleTravelTime).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination,
      "driving"
    );
    expect(result).toBe(30);
  });

  test("getTravelTimes calls the underlying API with correct parameters", async () => {
    const result = await TravelFacade.getTravelTimes(
      sampleOrigin,
      sampleDestination,
      modes
    );

    expect(googleMapsApi.getTravelTimes).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination,
      modes
    );
    expect(result).toEqual([
      { mode: "walking", duration: 45 },
      { mode: "driving", duration: 15 },
    ]);
  });

  test("getAlternativeRoutes calls the underlying API with correct parameters", async () => {
    const maxRoutes = 2;
    const result = await TravelFacade.getAlternativeRoutes(
      sampleOrigin,
      sampleDestination,
      modes,
      maxRoutes
    );

    expect(googleMapsApi.getAlternativeRoutes).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination,
      modes,
      maxRoutes
    );
    expect(result).toEqual([
      { mode: "driving", routes: [sampleGoogleResponse] },
    ]);
  });

  // Tests for shuttle utility facade methods
  test("estimateShuttleTravelTime calls the underlying function with correct parameters", async () => {
    const result = await TravelFacade.estimateShuttleTravelTime(
      sampleOrigin,
      "LOY"
    );

    expect(shuttleUtils.estimateShuttleTravelTime).toHaveBeenCalledWith(
      sampleOrigin,
      "LOY"
    );
    expect(result).toBe(35);
  });

  test("estimateShuttleFromButton calls the underlying function with correct parameters", async () => {
    const result = await TravelFacade.estimateShuttleFromButton("SGW");

    expect(shuttleUtils.estimateShuttleFromButton).toHaveBeenCalledWith("SGW");
    expect(result).toEqual(sampleShuttleResponse);
  });

  test("addShuttleOption calls the underlying function with correct parameters", async () => {
    const result = await TravelFacade.addShuttleOption(
      sampleOrigin,
      sampleDestination
    );

    expect(shuttleOption.addShuttleOption).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination
    );
    expect(result[0].mode).toBe("walking + Shuttle");
  });

  // Tests for utility methods
  test("haversineDistance calls the imported function with correct parameters", () => {
    const result = TravelFacade.haversineDistance(
      TravelFacade.sgwStop,
      TravelFacade.loyolaStop
    );

    expect(distanceShuttle.haversineDistance).toHaveBeenCalledWith(
      TravelFacade.sgwStop,
      TravelFacade.loyolaStop
    );
    expect(result).toBe(6.4);
  });

  test("findNearestLocation calls the imported function with correct parameters", () => {
    const currentLocation = { latitude: 45.496, longitude: -73.577 }; // Close to SGW
    const locations = [
      TravelFacade.sgwStop,
      TravelFacade.loyolaStop,
      { latitude: 45.5, longitude: -73.6 },
    ];

    const result = TravelFacade.findNearestLocation(currentLocation, locations);

    expect(distanceShuttle.findNearestLocation).toHaveBeenCalledWith(
      currentLocation,
      locations
    );
    expect(result).toEqual(TravelFacade.sgwStop);
  });

  test("isLocationInCampus correctly identifies locations in campus", () => {
    // Location inside SGW campus
    const inSGW = {
      latitude: sgwRegion.latitude,
      longitude: sgwRegion.longitude,
    };
    // Location outside any campus
    const outsideCampus = { latitude: 45.5, longitude: -73.7 };

    expect(TravelFacade.isLocationInCampus(inSGW, sgwRegion)).toBe(true);
    expect(TravelFacade.isLocationInCampus(outsideCampus, sgwRegion)).toBe(
      false
    );
    expect(TravelFacade.isLocationInCampus(outsideCampus, loyolaRegion)).toBe(
      false
    );
  });

  test("determineCampus correctly identifies campus locations", () => {
    // Sample locations
    const inSGW = {
      latitude: sgwRegion.latitude,
      longitude: sgwRegion.longitude,
    };
    const inLoyola = {
      latitude: loyolaRegion.latitude,
      longitude: loyolaRegion.longitude,
    };
    const outsideCampus = { latitude: 45.5, longitude: -73.7 };

    expect(TravelFacade.determineCampus(inSGW)).toBe("SGW");
    expect(TravelFacade.determineCampus(inLoyola)).toBe("LOY");
    expect(TravelFacade.determineCampus(outsideCampus)).toBeNull();
  });

  test("getDirectShuttleTime uses imported haversineDistance function", () => {
    const result = TravelFacade.getDirectShuttleTime();

    expect(distanceShuttle.haversineDistance).toHaveBeenCalledWith(
      TravelFacade.sgwStop,
      TravelFacade.loyolaStop
    );

    // 6.4 km at 40 km/h = 0.16 hours = 9.6 minutes
    expect(result).toBe(9.6);
  });

  // Tests for comprehensive methods
  test("getAllTravelOptions combines Google and shuttle options", async () => {
    const result = await TravelFacade.getAllTravelOptions(
      sampleOrigin,
      sampleDestination,
      modes,
      true,
      2
    );

    // Check that the Google API was called
    expect(googleMapsApi.getAlternativeRoutes).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination,
      modes,
      2
    );

    // Check that shuttle options were requested
    expect(shuttleOption.addShuttleOption).toHaveBeenCalledWith(
      sampleOrigin,
      sampleDestination
    );

    // The result should include both Google routes and shuttle options
    expect(result.length).toBeGreaterThan(0);

    // Check for Google routes
    const hasGoogleRoutes = result.some((item) => item.mode === "driving");
    expect(hasGoogleRoutes).toBe(true);

    // Check for shuttle options (the format is transformed in the method)
    const hasShuttleRoutes = result.some((item) =>
      item.mode.toLowerCase().includes("shuttle")
    );
    expect(hasShuttleRoutes).toBe(true);
  });

  test("getAllTravelOptions handles case when shuttle options are not available", async () => {
    // Mock shuttle options to return empty array (no shuttle available)
    shuttleOption.addShuttleOption.mockResolvedValueOnce([]);

    const result = await TravelFacade.getAllTravelOptions(
      sampleOrigin,
      sampleDestination,
      modes,
      true
    );

    // Should only have Google routes
    expect(result).toEqual([
      { mode: "driving", routes: [sampleGoogleResponse] },
    ]);
  });

  test("getAllTravelOptions respects includeShuttle parameter", async () => {
    // Call with includeShuttle = false
    const result = await TravelFacade.getAllTravelOptions(
      sampleOrigin,
      sampleDestination,
      modes,
      false
    );

    // Check that shuttle options were not requested
    expect(shuttleOption.addShuttleOption).not.toHaveBeenCalled();

    // Should only have Google routes
    expect(result).toEqual([
      { mode: "driving", routes: [sampleGoogleResponse] },
    ]);
  });

  test("getFastestRoutes selects the fastest route for each mode", async () => {
    // Mock getAllTravelOptions to return multiple routes per mode
    const mockOptions = [
      {
        mode: "driving",
        routes: [
          { ...sampleGoogleResponse, duration: 25 },
          { ...sampleGoogleResponse, duration: 20 }, // Faster route
        ],
      },
      {
        mode: "walking_shuttle",
        routes: [
          {
            ...sampleGoogleResponse,
            duration: 55,
            details: sampleShuttleResponse,
          },
        ],
      },
    ];

    // Create a spy on getAllTravelOptions
    jest
      .spyOn(TravelFacade, "getAllTravelOptions")
      .mockResolvedValueOnce(mockOptions);

    const result = await TravelFacade.getFastestRoutes(
      sampleOrigin,
      sampleDestination,
      modes,
      true
    );

    // Should have selected the fastest route for each mode
    expect(result).toEqual([
      {
        mode: "driving",
        duration: 20,
        distance: "5 km",
        summary: "Test Route",
        details: null,
      },
      {
        mode: "walking_shuttle",
        duration: 55,
        distance: "5 km",
        summary: "Test Route",
        details: sampleShuttleResponse,
      },
    ]);
  });

  test("getFastestRoutes handles empty routes", async () => {
    // Mock getAllTravelOptions to return a mode with no routes
    const mockOptions = [
      {
        mode: "driving",
        routes: [],
      },
    ];

    jest
      .spyOn(TravelFacade, "getAllTravelOptions")
      .mockResolvedValueOnce(mockOptions);

    const result = await TravelFacade.getFastestRoutes(
      sampleOrigin,
      sampleDestination,
      modes,
      true
    );

    // Should return mode with null duration
    expect(result).toEqual([
      {
        mode: "driving",
        duration: null,
      },
    ]);
  });

  // Test for error handling
  test("getAllTravelOptions handles and rethrows errors", async () => {
    // Mock getAlternativeRoutes to throw an error
    googleMapsApi.getAlternativeRoutes.mockRejectedValueOnce(
      new Error("API error")
    );

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      TravelFacade.getAllTravelOptions(sampleOrigin, sampleDestination)
    ).rejects.toThrow("API error");

    // Verify that error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error getting all travel options:",
      expect.any(Error)
    );

    // Restore console.error
    console.error.mockRestore();
  });

  test("getFastestRoutes handles and rethrows errors", async () => {
    // Mock getAllTravelOptions to throw an error
    jest
      .spyOn(TravelFacade, "getAllTravelOptions")
      .mockRejectedValueOnce(new Error("API error"));

    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      TravelFacade.getFastestRoutes(sampleOrigin, sampleDestination)
    ).rejects.toThrow("API error");

    // Verify that error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error getting fastest routes:",
      expect.any(Error)
    );

    // Restore console.error
    console.error.mockRestore();
  });
});
