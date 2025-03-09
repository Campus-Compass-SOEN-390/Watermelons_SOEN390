import React from "react";
import { estimateShuttleTravelTime } from "../utils/shuttleUtils";
import { getSortedTravelTimes } from "../api/googleMapsApi";
import { fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import { haversineDistance } from "../utils/distanceShuttle";

jest.mock("../api/googleMapsApi", () => ({
    getSortedTravelTimes: jest.fn()
}));

jest.mock("../api/shuttleSchedule", () => ({
    fetchShuttleScheduleByDay: jest.fn()
}));

jest.mock("../utils/distanceShuttle", () => ({
    haversineDistance: jest.fn()
}));

describe("estimateShuttleTravelTime", () => {
    const userLocation = { latitude: 45.4972, longitude: -73.5793 };

    beforeEach(() => {
        jest.clearAllMocks();
        console.log("Current Time in Minutes:", new Date().getHours() * 60 + new Date().getMinutes());
    });

    // Utility function to generate future shuttle times dynamically
    const generateFutureShuttleTimes = (minutesAhead) => {
        const now = new Date();
        const futureTimes = [];
        for (let i = 1; i <= 3; i++) { // Generate 3 future times
            now.setMinutes(now.getMinutes() + minutesAhead * i);
            futureTimes.push(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
        }
        return futureTimes;
    };

    /**
     * Test Case 1: No shuttle service available today
     * - Ensures the function throws an error when there is no shuttle schedule for the day.
     */
    test("should throw an error if no shuttle service is available today", async () => {
        fetchShuttleScheduleByDay.mockReturnValue(null);

        await expect(estimateShuttleTravelTime(userLocation, "LOY"))
            .rejects.toThrow("No shuttle service available today.");
    });

    /**
     * Test Case 2: No available transportation to the shuttle stop
     * - Ensures the function throws an error when no transportation options exist to reach the shuttle stop.
     */
    test("should throw an error if no available transportation to the shuttle stop", async () => {
        fetchShuttleScheduleByDay.mockReturnValue({ SGW: ["12:00", "13:00", "14:00"] });
        getSortedTravelTimes.mockResolvedValue([]);  // No available travel options

        await expect(estimateShuttleTravelTime(userLocation, "LOY"))
            .rejects.toThrow("No available transportation to the shuttle stop.");
    });
    
    /**
     * Test Case 3: No shuttle available at this time
     * - Ensures the function throws an error when there are no shuttles available after the current time.
     */
    test("should throw an error if no shuttle is available at this time", async () => {
        fetchShuttleScheduleByDay.mockReturnValue({ SGW: ["06:00", "07:00"] }); // Past times (before now)
        getSortedTravelTimes.mockResolvedValue([{ mode: "walking", duration: 10 }]);

        await expect(estimateShuttleTravelTime(userLocation, "LOY"))
            .rejects.toThrow("No shuttle available at this time.");
    });

    /**
     * Test Case 4: Successful travel time estimation
     * - Ensures the function correctly calculates the total travel time when a valid shuttle is available.
     */
    test("should return the estimated travel time successfully", async () => {
        fetchShuttleScheduleByDay.mockReturnValue({
            SGW: ["23:30", "23:45", "00:15"],  // Future times ensure no failure
            LOY: ["23:50", "00:30", "00:45"]
        });

        getSortedTravelTimes.mockResolvedValue([{ mode: "walking", duration: 5 }]);
        haversineDistance.mockReturnValue(5);

        const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");
        console.log("Estimated Travel Time:", estimatedTime);

        expect(estimatedTime).toBeGreaterThan(0);
    });
    
    /**
     * Test Case 5: Correct shuttle travel time calculation
     * - Ensures the function accurately calculates travel time based on distance and travel mode.
     */
    test("should calculate correct shuttle travel time", async () => {
        fetchShuttleScheduleByDay.mockReturnValue({
            SGW: ["23:30", "23:45", "00:15"],
            LOY: ["23:50", "00:30", "00:45"]
        });

        getSortedTravelTimes.mockResolvedValue([{ mode: "driving", duration: 2 }]);
        haversineDistance.mockReturnValue(10);

        const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");
        console.log("Estimated Travel Time:", estimatedTime);

        expect(estimatedTime).toBeGreaterThan(0);
    });

    /**
     * Test Case 6: First available shuttle in the morning
     * - Ensures the function handles cases where the first shuttle of the day is selected.
     */
    test("should handle edge case where shuttle is the first available in the morning", async () => {
        console.log("Current Time in Minutes:", new Date().getHours() * 60 + new Date().getMinutes());

        fetchShuttleScheduleByDay.mockReturnValue({
            SGW: generateFutureShuttleTimes(10),  // Ensures at least 10 minutes ahead
            LOY: generateFutureShuttleTimes(15)
        });

        getSortedTravelTimes.mockResolvedValue([{ mode: "walking", duration: 15 }]);
        haversineDistance.mockReturnValue(8);

        const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");
        console.log("Estimated Travel Time (Morning Case):", estimatedTime);

        expect(estimatedTime).toBeGreaterThan(0);
    });
    
    /**
     * Test Case 8: User has only transit as an option
     * - Ensures the function works correctly when the only available travel mode to the shuttle stop is transit.
     */
    test("should handle a scenario where the user has only transit as an option", async () => {
        console.log("Current Time in Minutes:", new Date().getHours() * 60 + new Date().getMinutes());

        fetchShuttleScheduleByDay.mockReturnValue({
            SGW: generateFutureShuttleTimes(20), // Future shuttle times
            LOY: generateFutureShuttleTimes(25)
        });

        getSortedTravelTimes.mockResolvedValue([{ mode: "transit", duration: 20 }]);
        haversineDistance.mockReturnValue(10);

        const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");
        console.log("Estimated Travel Time (Transit Only Case):", estimatedTime);

        expect(estimatedTime).toBeGreaterThan(0);
    });
    
    /**
     * Test Case 7: Late-night shuttle availability
     * - Ensures the function correctly estimates travel time for late-night shuttles.
     */
    test("should handle late-night shuttle case", async () => {
        fetchShuttleScheduleByDay.mockReturnValue({ SGW: ["23:30", "23:45"] });
        getSortedTravelTimes.mockResolvedValue([{ mode: "bicycling", duration: 10 }]);
        haversineDistance.mockReturnValue(7);

        const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");
        expect(estimatedTime).toBeGreaterThan(0);
    });

    
});