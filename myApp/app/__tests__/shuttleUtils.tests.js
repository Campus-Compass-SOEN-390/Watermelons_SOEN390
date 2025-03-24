import {
  estimateShuttleTravelTime,
  estimateShuttleFromButton,
  formatTime,
} from "../utils/shuttleUtils";
import { getTravelTimes } from "../api/googleMapsApi";
import { fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import { haversineDistance } from "../utils/distanceShuttle";

jest.mock("../api/googleMapsApi", () => ({
  getTravelTimes: jest.fn(),
}));

jest.mock("../api/shuttleSchedule", () => ({
  fetchShuttleScheduleByDay: jest.fn(),
}));

jest.mock("../utils/distanceShuttle", () => ({
  haversineDistance: jest.fn(),
}));

describe("estimateShuttleTravelTime", () => {
  const userLocation = { latitude: 45.4972, longitude: -73.5793 };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-04T12:00:00Z")); // Mocking a Monday
  });

  test("should return an error if it is a weekend", async () => {
    jest.setSystemTime(new Date("2024-03-09T12:00:00Z")); // Mocking a Saturday

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toEqual({ error: "No bus available on weekends." });
  });

  test("should return null if no shuttle schedule is available", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue(null);

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toBeNull();
  });

  test("should return null if no travel options exist", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:00", "13:00", "14:00"],
    });
    getTravelTimes.mockResolvedValue([]); // No available travel options

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toBeNull();
  });

  test("should return null if no shuttle is available after the current time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({ SGW: [] });
    getTravelTimes.mockResolvedValue([{ mode: "walking", duration: 10 }]);

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toBeNull();
  });

  test("should return the estimated travel time successfully", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:30", "13:00", "14:00"],
      LOY: ["12:45", "13:15", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{ mode: "walking", duration: 5 }]);
    haversineDistance.mockReturnValue(5);

    const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(estimatedTime).toBeGreaterThan(0);
  });

  test("should calculate correct shuttle travel time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:30", "13:00", "14:00"],
      LOY: ["12:45", "13:15", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{ mode: "driving", duration: 2 }]);
    haversineDistance.mockReturnValue(10);

    const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(estimatedTime).toBeGreaterThan(0);
  });
});

describe("estimateShuttleFromButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-04T12:00:00Z")); // Mocking a Monday
  });

  test("should return an error if it is a weekend", async () => {
    jest.setSystemTime(new Date("2024-03-09T12:00:00Z")); // Mocking a Saturday

    const result = await estimateShuttleFromButton("SGW");

    expect(result).toEqual({ error: "No bus available on weekends." });
  });

  test("should return null if no shuttle service is available today", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue(null);

    const result = await estimateShuttleFromButton("SGW");

    expect(result).toBeNull();
  });

  test("should return null if no shuttle is available at this time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({ SGW: [] });

    const result = await estimateShuttleFromButton("SGW");

    expect(result).toBeNull();
  });

  test("should return estimated wait time and shuttle ride time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:30", "13:00", "14:00"],
      LOY: ["12:45", "13:15", "14:15"],
    });

    haversineDistance.mockReturnValue(7);

    const result = await estimateShuttleFromButton("SGW");

    expect(result.waitTime).toBeGreaterThanOrEqual(0);
    expect(result.shuttleRideTime).toBeGreaterThan(0);
    expect(result.totalTime).toEqual(result.waitTime + result.shuttleRideTime);
  });
});

describe("formatTime", () => {
  test("returns 'Unavailable' for NaN", () => {
    expect(formatTime(NaN)).toBe("Unavailable");
  });

  test("returns '0 minutes' for 0", () => {
    expect(formatTime(0)).toBe("~About 0 minutes");
  });

  test("formats only minutes correctly", () => {
    expect(formatTime(5)).toBe("~About 5 minutes");
  });

  test("formats only hours correctly", () => {
    expect(formatTime(60)).toBe("~About 1 hr");
  });

  test("formats both hours and minutes correctly", () => {
    expect(formatTime(125)).toBe("~About 2 hrs 5 minutes");
  });

  test("should handle malformed shuttle schedule time gracefully", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["badTime", "13:30"],
    });
    getTravelTimes.mockResolvedValue([{ mode: "driving", duration: 5 }]);
    haversineDistance.mockReturnValue(10);
  
    const result = await estimateShuttleTravelTime(
      { latitude: 45.5, longitude: -73.6 },
      "LOY"
    );
  
    expect(result).toBeGreaterThan(0); // Should skip badTime and continue
  });
  
  test("should handle malformed time strings in shuttleFromButton", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["not-a-time", "14:30"],
    });
    haversineDistance.mockReturnValue(7);
  
    const result = await estimateShuttleFromButton("SGW");
  
    expect(result).not.toBeNull();
    expect(result.waitTime).toBeGreaterThanOrEqual(0);
  });
  
});
