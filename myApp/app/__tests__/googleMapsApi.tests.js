import React from "react";
import { getGoogleTravelTime, getSortedTravelTimes } from "../api/googleMapsApi";


describe("Google Travel Time API Tests", () => {
  beforeEach(() => {
    fetch.resetMocks(); // Reset mock before each test
  });

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
  test("should return 0 if Google API returns no routes", async () => {
    fetch.mockResponseOnce(JSON.stringify({ routes: [] }));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "driving";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBe(0); // No route found → Return 0
  });

 /**
 * Test Case 3: API request failure
 * - Simulates network error when fetching travel time data.
 * - Ensures the function handles errors and returns `0`.
 */
  test("should return 0 if fetch request fails", async () => {
    fetch.mockReject(new Error("Network error"));

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "walking";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBe(0); // Fetch failure → Return 0
  });

 /**
 * Test Case 4: Malformed API response
 * - Simulates an API response missing the expected routes field.
 * - Ensures the function returns 0 to handle unexpected response structures.
 */
  test("should return 0 if API response is malformed", async () => {
    fetch.mockResponseOnce(JSON.stringify({})); // No `routes` field

    const origin = { latitude: 45.4970605, longitude: -73.5788022 };
    const destination = { latitude: 45.495495, longitude: -73.5791717 };
    const mode = "walking";

    const time = await getGoogleTravelTime(origin, destination, mode);
    expect(time).toBe(0); // Malformed response → Return 0
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
        expect.stringMatching(/https:\/\/maps\.googleapis\.com\/maps\/api\/directions\/json\?.*key=TEST_API_KEY/)
    );
    
  });
});


describe("getSortedTravelTimes Tests", () => {
    const origin = { latitude: 45.4971, longitude: -73.5789 };
    const destination = { latitude: 45.4955, longitude: -73.5792 };

    beforeEach(() => {
        fetch.resetMocks();
    });

    /**
    *  Test Case 6: Successful API response with sorted travel times
    * - Calls getSortedTravelTimes() with multiple modes (`walking`, `driving`, `transit`).
    * - Ensures it correctly fetches, processes, and sorts travel times in ascending order.
    */
    test("should return sorted travel times for different modes", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                routes: [{ legs: [{ duration: { value: 300 } }] }] // 5 min
            })
        });

        fetch.mockResolvedValueOnce({
            json: async () => ({
                routes: [{ legs: [{ duration: { value: 180 } }] }] // 3 min
            })
        });

        fetch.mockResolvedValueOnce({
            json: async () => ({
                routes: [{ legs: [{ duration: { value: 480 } }] }] // 8 min
            })
        });

        const sortedTimes = await getSortedTravelTimes(origin, destination, ["walking", "driving", "transit"]);

        expect(sortedTimes).toEqual([
            { mode: "driving", duration: 3 },
            { mode: "walking", duration: 5 },
            { mode: "transit", duration: 8 }
        ]);
    });

    /**
    * Test Case 7: No routes found for any mode
    * - Calls getSortedTravelTimes() when the API returns no available routes for any mode.
    * - Ensures the function returns an empty array.
    */
    test("should return an empty array if API returns no routes", async () => {
        fetch.mockResolvedValue({
            json: async () => ({ routes: [] }) // No routes
        });

        const sortedTimes = await getSortedTravelTimes(origin, destination, ["walking"]);
        expect(sortedTimes).toEqual([]); // Should return an empty array
    });

    /**
    * Test Case 8: API failure for all modes
    * - Simulates network failures when calling getSortedTravelTimes().
    * - Ensures the function handles errors and returns an empty array.
    */
    test("should return default infinite duration when API fails", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        const sortedTimes = await getSortedTravelTimes(origin, destination, ["walking"]);
        expect(sortedTimes).toEqual([]); // Should return an empty array
    });

    /**
    * Test Case 9: Partial failures (some modes fail)
    * - Simulates a case where some travel modes return valid results while others fail.
    * - Ensures the function returns valid travel times and filters out failed modes.
    */
    test("should include valid times and ignore failed fetches", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                routes: [{ legs: [{ duration: { value: 240 } }] }] // 4 min
            })
        });

        fetch.mockRejectedValueOnce(new Error("API Failure for Driving"));

        fetch.mockResolvedValueOnce({
            json: async () => ({
                routes: [{ legs: [{ duration: { value: 600 } }] }] // 10 min
            })
        });

        const sortedTimes = await getSortedTravelTimes(origin, destination, ["walking", "driving", "transit"]);

        expect(sortedTimes).toEqual([
            { mode: "walking", duration: 4 }, // Should include only valid times
            { mode: "transit", duration: 10 }
        ]);
    });

    /**
    * Test Case 10: Empty modes list
    * - Calls getSortedTravelTimes() with an empty array of travel modes.
    * - Ensures the function returns an empty array since no API calls should be made.
    */
    test("should return an empty array if no modes are provided", async () => {
        const sortedTimes = await getSortedTravelTimes(origin, destination, []);
        expect(sortedTimes).toEqual([]); // No modes = no requests
    });

    /**
    * Test Case 11: Unexpected API response structure
    * - Simulates a malformed API response with missing or incorrect data fields.
    * - Ensures the function gracefully handles unexpected data and returns an empty array.
    */
    test("should return an empty array if API response is malformed", async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ invalidKey: "unexpected data" }) // Malformed API response
        });

        const sortedTimes = await getSortedTravelTimes(origin, destination, ["walking"]);
        expect(sortedTimes).toEqual([]); // Should gracefully handle malformed response
    });

   
    
        /**
        * Test Case 12: Driving mode considers traffic
        * - Ensures that when using driving mode, the API includes traffic parameters.
        * - Mocks API response with different durations based on traffic.
        */
        test("should return adjusted travel time with traffic for driving mode", async () => {
            fetch.mockResponseOnce(
                JSON.stringify({
                    routes: [
                        {
                            legs: [
                                {
                                    duration_in_traffic: { value: 1200 }, // 20 minutes
                                    duration: { value: 900 } // 15 minutes
                                }
                            ]
                        }
                    ]
                })
            );
        
            const origin = { latitude: 45.4970605, longitude: -73.5788022 };
            const destination = { latitude: 45.495495, longitude: -73.5791717 };
            const mode = "driving";
        
            const time = await getGoogleTravelTime(origin, destination, mode);
            expect(time).toBe(20); // Ensure it picks duration_in_traffic
        });
        
    
        /**
        * Test Case 13: Driving mode without traffic data fallback
        * - Ensures that if `duration_in_traffic` is missing, it falls back to `duration`.
        */
        test("should fall back to duration when duration_in_traffic is missing", async () => {
            fetch.mockResponseOnce(
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
            );
    
            const origin = { latitude: 45.4970605, longitude: -73.5788022 };
            const destination = { latitude: 45.495495, longitude: -73.5791717 };
            const mode = "driving";
    
            const time = await getGoogleTravelTime(origin, destination, mode);
            expect(time).toBe(15); // Should fallback to normal duration
        });
    
        /**
        * Test Case 14: API correctly appends traffic parameters in driving mode
        * - Ensures the API call includes traffic parameters (`departure_time=now`).
        */
        test("should include traffic parameters in API URL for driving mode", async () => {
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
                expect.stringContaining(
                    `&departure_time=now&traffic_model=best_guess`
                )
            );
        });
    
        /**
        * Test Case 15: Traffic parameters are ignored for non-driving modes
        * - Ensures the API call does NOT include traffic parameters for walking and transit.
        */
        test("should not include traffic parameters for non-driving modes", async () => {
            fetch.mockResponseOnce(
                JSON.stringify({
                    routes: [{ legs: [{ duration_in_traffic: { value: 1200 }, duration: { value: 900 } }] }]
                })
            );
            
    
            const origin = { latitude: 45.4970605, longitude: -73.5788022 };
            const destination = { latitude: 45.495495, longitude: -73.5791717 };
            const mode = "walking";
    
            await getGoogleTravelTime(origin, destination, mode);
    
            expect(fetch).not.toHaveBeenCalledWith(
                expect.stringContaining(`&departure_time=now&traffic_model=best_guess`)
            );
        });
  
});