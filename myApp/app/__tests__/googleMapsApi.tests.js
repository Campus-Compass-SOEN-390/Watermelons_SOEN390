import React from "react";
import {
  getGoogleTravelTime,
  getTravelTimes,
  getAlternativeRoutes,
} from "../api/googleMapsApi";

describe("Google Travel Time and Alternative Routes API Tests", () => {
  beforeEach(() => {
    fetch.resetMocks(); // Reset mock before each test
  });

  //_________________Test for travel Time__________________

  /**
   * Test Case 1: Successful API response
   * - Calls getGoogleTravelTime() with valid origin, destination, and mode.
   * - Ensures it correctly parses the API response and returns the expected travel time.
   */
  test("should return correct travel time when API responds successfully", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        routes: [
          {
            legs: [
              {
                duration: { value: 900 }, // 15 minutes in seconds
              },
            ],
          },
        ],
      })
    );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "walking";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBe(15); // 900 seconds = 15 minutes
  });

  /**
   * Test Case 2: No routes found
   * - Calls getGoogleTravelTime() when the API returns no available routes.
   * - Ensures the function returns `0` when no valid routes are found.
   */
  test("should return null if Google API returns no routes", async () => {
    fetch.mockResponseOnce(JSON.stringify({ routes: [] }));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "driving";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBeNull();
  });

  /**
   * Test Case 3: API request failure
   * - Simulates network error when fetching travel time data.
   * - Ensures the function handles errors and returns `0`.
   */
  test("should return null if fetch request fails", async () => {
    fetch.mockReject(new Error("Network error"));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "walking";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBeNull();
  });

  /**
   * Test Case 4: Malformed API response
   * - Simulates an API response missing the expected routes field.
   * - Ensures the function returns 0 to handle unexpected response structures.
   */
  test("should return null if API response is malformed", async () => {
    fetch.mockResponseOnce(JSON.stringify({})); // No `routes` field

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "walking";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBeNull();
  });

  /**
   * Test Case 5: Correct API URL construction
   * - Calls getGoogleTravelTime() and verifies that the constructed API URL contains correct parameters.
   * - Ensures that the API is being queried with the expected origin, destination, mode, and API key.
   */
  test("should correctly construct API URL", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        routes: [
          {
            legs: [
              {
                duration: { value: 600 }, // 10 minutes
              },
            ],
          },
        ],
      })
    );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "driving";

    await getGoogleTravelTime(origin, destination, mode);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(
        /https:\/\/maps\.googleapis\.com\/maps\/api\/directions\/json\?.*key=TEST_API_KEY/
      )
    );
  });

  /**
   * Test Case 6: Successful response for multiple travel modes
   * - Ensures it returns travel times correctly for each mode.
   */
  test("should return correct travel times for multiple modes", async () => {
    fetch.mockResponse(
      JSON.stringify({
        routes: [
          {
            legs: [
              {
                duration: { value: 1200 }, // 20 minutes
              },
            ],
          },
        ],
      })
    );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking", "driving"];

    const times = await getTravelTimes(origin, destination, modes);

    expect(times).toEqual([
      { mode: "walking", duration: 20 },
      { mode: "driving", duration: 20 },
    ]);
  });

  /**
   * Test Case 7: Some travel modes fail while others succeed
   * - Simulates a scenario where one mode has a response but another fails.
   */
  test("should handle partial failures gracefully", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({
          routes: [
            {
              legs: [
                {
                  duration: { value: 900 }, // 15 minutes
                },
              ],
            },
          ],
        })
      )
      .mockRejectOnce(new Error("Network error"));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking", "driving"];

    const times = await getTravelTimes(origin, destination, modes);

    expect(times).toEqual([
      { mode: "walking", duration: 15 },
      { mode: "driving", duration: null }, // Failed request
    ]);
  });

  /**
   * Test Case 8: Handles empty modes array
   * - Ensures function handles empty mode list correctly.
   */
  test("should return an empty array if no travel modes are provided", async () => {
    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };

    const times = await getTravelTimes(origin, destination, []);
    expect(times).toEqual([]);
  });

  //_________________Test for alternative routes__________________

  /**
   * Test Case 9: Successful API response with multiple routes (including steps)
   */
  test("should return up to 3 alternative routes per mode with steps", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        routes: [
          {
            legs: [
              {
                duration: { value: 900 },
                distance: { text: "5 km" },
                steps: [
                  {
                    html_instructions: "Turn left",
                    distance: { text: "500m" },
                    duration: { value: 120 },
                  },
                  {
                    html_instructions: "Go straight",
                    distance: { text: "1km" },
                    duration: { value: 300 },
                  },
                ],
              },
            ],
            summary: "Route A",
            overview_polyline: { points: "encodedPolyline1" },
          },
        ],
      })
    );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking"];

    const routes = await getAlternativeRoutes(origin, destination, modes);

    const walking = routes.find((r) => r.mode === "walking");
    expect(walking.routes).toHaveLength(1);
    expect(walking.routes[0].summary).toBe("Route A");
    expect(walking.routes[0].steps).toHaveLength(2);
    expect(walking.routes[0].steps[0]).toEqual({
      instruction: "Turn left",
      distance: "500m",
      duration: 2,
    });
  });

  /**
   * Test Case 10: No routes found for a given mode
   */
  test("should return empty array if no routes found", async () => {
    fetch.mockResponseOnce(JSON.stringify({ routes: [] }));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["driving"];

    const routes = await getAlternativeRoutes(origin, destination, modes);
    const driving = routes.find((r) => r.mode === "driving");
    expect(driving.routes).toEqual([]);
  });

  /**
   * Test Case 11: API request failure
   */
  test("should return empty object if fetch request fails", async () => {
    fetch.mockReject(new Error("Network error"));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["transit"];

    const routes = await getAlternativeRoutes(origin, destination, modes);
    expect(routes).toEqual([{ mode: "transit", routes: [] }]);
  });

  /**
   * Test Case 12: Malformed API response
   */
  test("should return empty object if API response is malformed", async () => {
    fetch.mockResponseOnce(JSON.stringify({}));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking"];

    const routes = await getAlternativeRoutes(origin, destination, modes);
    expect(routes).toEqual([{ mode: "walking", routes: [] }]);
  });

  /**
   * Test Case 13: Correct API URL construction
   */
  test("should construct API URL correctly", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        routes: [
          {
            legs: [{ duration: { value: 900 }, distance: { text: "5 km" } }],
            summary: "Test Route",
            overview_polyline: { points: "encodedPolyline1" },
          },
        ],
      })
    );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["driving"];

    await getAlternativeRoutes(origin, destination, modes);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(
        /https:\/\/maps\.googleapis\.com\/maps\/api\/directions\/json\?.*key=TEST_API_KEY/
      )
    );
  });

  /**
   * Test Case 14: Handles multiple modes correctly
   */
  test("should return alternative routes for multiple modes", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({
          routes: [
            {
              legs: [{ duration: { value: 900 }, distance: { text: "5 km" } }],
              summary: "Route A",
              overview_polyline: { points: "encodedPolyline1" },
            },
          ],
        })
      )
      .mockResponseOnce(
        JSON.stringify({
          routes: [
            {
              legs: [{ duration: { value: 1200 }, distance: { text: "6 km" } }],
              summary: "Route B",
              overview_polyline: { points: "encodedPolyline2" },
            },
          ],
        })
      );

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking", "driving"];

    const routes = await getAlternativeRoutes(origin, destination, modes);

    const walking = routes.find((r) => r.mode === "walking");
    const driving = routes.find((r) => r.mode === "driving");

    expect(walking.routes[0].summary).toBe("Route A");
    expect(driving.routes[0].summary).toBe("Route B");
  });

  /**
   * Test Case 15: Partial API failures (some modes fail while others succeed)
   */
  test("should handle partial API failures gracefully", async () => {
    fetch
      .mockResponseOnce(
        JSON.stringify({
          routes: [
            {
              legs: [
                {
                  duration: { value: 900 },
                  distance: { text: "5 km" },
                  steps: [],
                },
              ],
              summary: "Route A",
              overview_polyline: { points: "encodedPolyline1" },
            },
          ],
        })
      )
      .mockRejectOnce(new Error("Network error"));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const modes = ["walking", "driving"];

    const routes = await getAlternativeRoutes(origin, destination, modes);

    expect(routes).toEqual([
      {
        mode: "walking",
        routes: [
          {
            duration: 15,
            distance: "5 km",
            summary: "Route A",
            coordinates: expect.any(Array),
            steps: [],
          },
        ],
      },
      {
        mode: "driving",
        routes: [],
      },
    ]);
  });

  /**
   * Test Case 16: Handles empty modes array
   */
  test("should return empty object if no transport modes are provided", async () => {
    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };

    const routes = await getAlternativeRoutes(origin, destination, []);
    expect(routes).toEqual([]);
  });
});
