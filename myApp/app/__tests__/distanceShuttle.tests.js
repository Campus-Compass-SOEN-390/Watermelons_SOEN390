import React from "react";
import {
  findNearestLocation,
  haversineDistance,
} from "../utils/distanceShuttle";

describe("Haversine Distance Function", () => {
  /**
   * Test Case 1: Correct distance between two known points
   * - Uses real-world coordinates to verify correct distance calculation.
   */
  test("should return correct distance between two points", () => {
    const coord1 = { latitude: 45.5017, longitude: -73.5673 }; // Montreal
    const coord2 = { latitude: 40.7128, longitude: -74.006 }; // New York

    const distance = haversineDistance(coord1, coord2);
    expect(distance).toBeCloseTo(534, 0); // Expected ~534 km
  });

  /**
   * Test Case 2: Identical coordinates should return 0 km
   */
  test("should return 0 km for identical locations", () => {
    const coord = { latitude: 45.5017, longitude: -73.5673 };
    expect(haversineDistance(coord, coord)).toBe(0);
  });

  /**
   * Test Case 3: Handles negative latitude and longitude values
   */
  test("should correctly calculate distance with negative latitude/longitude", () => {
    const coord1 = { latitude: -34.6037, longitude: -58.3816 }; // Buenos Aires
    const coord2 = { latitude: 51.5074, longitude: -0.1278 }; // London

    const distance = haversineDistance(coord1, coord2);
    expect(distance).toBeCloseTo(11128, 0); // Increase precision tolerance to 1 decimal place
  });
});

describe("Find Nearest Location Function", () => {
  /**
   * Test Case 4: Returns the closest location from a list of stops
   */
  test("should return the nearest location", () => {
    const userLocation = { latitude: 45.5017, longitude: -73.5673 }; // Montreal

    const stops = [
      { latitude: 40.7128, longitude: -74.006 }, // New York (~534 km)
      { latitude: 43.65107, longitude: -79.347015 }, // Toronto (~500 km)
      { latitude: 45.5088, longitude: -73.554 }, // Montreal (~1 km)
    ];

    const nearest = findNearestLocation(userLocation, stops);
    expect(nearest).toEqual(stops[2]); // The closest location should be Montreal (~1 km)
  });

  /**
   * Test Case 5: Handles an empty list of locations gracefully
   */
  test("should return undefined for an empty list of locations", () => {
    const userLocation = { latitude: 45.5017, longitude: -73.5673 };
    expect(findNearestLocation(userLocation, [])).toBeUndefined();
  });

  /**
   *  Test Case 6: Returns the only location available when one option is given
   */
  test("should return the only location when one option is provided", () => {
    const userLocation = { latitude: 45.5017, longitude: -73.5673 };
    const stops = [{ latitude: 40.7128, longitude: -74.006 }];

    expect(findNearestLocation(userLocation, stops)).toEqual(stops[0]);
  });

  /**
   * Test Case 7: Works correctly when locations are equidistant
   */
  test("should return the first closest location when two are equidistant", () => {
    const userLocation = { latitude: 45.5017, longitude: -73.5673 };

    const stops = [
      { latitude: 45.51, longitude: -73.56 }, // 1st stop
      { latitude: 45.51, longitude: -73.56 }, // 2nd stop (same distance)
    ];

    const nearest = findNearestLocation(userLocation, stops);
    expect(nearest).toEqual(stops[0]); // Should return the first one
  });
});
