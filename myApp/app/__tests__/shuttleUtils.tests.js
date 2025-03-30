import {
  estimateShuttleTravelTime,
  estimateShuttleFromButton,
  formatTime,
} from "../utils/shuttleUtils";
import {
  getTravelTimes
} from "../api/googleMapsApi";
import {
  fetchShuttleScheduleByDay
} from "../api/shuttleSchedule";
import {
  haversineDistance
} from "../utils/distanceShuttle";
import TravelFacade from "../utils/TravelFacade";


jest.mock("../api/googleMapsApi", () => ({
  getTravelTimes: jest.fn(),
  getGoogleTravelTime: jest.fn(() => Promise.resolve(12)),
}));

jest.mock("../api/shuttleSchedule", () => ({
  fetchShuttleScheduleByDay: jest.fn(),
}));

jest.mock("../utils/distanceShuttle", () => ({
  haversineDistance: jest.fn(),
}));

describe("estimateShuttleTravelTime", () => {
  const userLocation = {
    latitude: 45.4972,
    longitude: -73.5793
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-04T12:00:00Z")); // Mocking a Monday
  });

  test("should return an error if it is a weekend", async () => {
    jest.setSystemTime(new Date("2024-03-09T12:00:00Z")); // Mocking a Saturday

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toEqual({
      error: "No bus available on weekends."
    });
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
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: []
    });
    getTravelTimes.mockResolvedValue([{
      mode: "walking",
      duration: 10
    }]);

    const result = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(result).toBeNull();
  });

  test("should return the estimated travel time successfully", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:30", "13:00", "14:00"],
      LOY: ["12:45", "13:15", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{
      mode: "walking",
      duration: 5
    }]);
    haversineDistance.mockReturnValue(5);

    const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(estimatedTime).toBeGreaterThan(0);
  });

  test("should calculate correct shuttle travel time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["12:30", "13:00", "14:00"],
      LOY: ["12:45", "13:15", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{
      mode: "driving",
      duration: 2
    }]);
    haversineDistance.mockReturnValue(10);

    const estimatedTime = await estimateShuttleTravelTime(userLocation, "LOY");

    expect(estimatedTime).toBeGreaterThan(0);
  });
  test("should return null and log error if shuttleRideTime is null", async () => {
    // Mock schedule
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["23:59"], 
      LOY: ["00:30"]
    });
  
    const googleTravelSpy = jest.spyOn(TravelFacade, "getGoogleTravelTime").mockResolvedValue(null);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await estimateShuttleFromButton("SGW");
    expect(consoleSpy).toHaveBeenCalledWith("Google API returned invalid shuttle ride time.");
    expect(result).toBeNull();

    // Cleanup
    googleTravelSpy.mockRestore();
    consoleSpy.mockRestore();
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

    expect(result).toEqual({
      error: "No bus available on weekends."
    });
  });

  test("should return null if no shuttle service is available today", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue(null);

    const result = await estimateShuttleFromButton("SGW");

    expect(result).toBeNull();
  });

  test("should return null if no shuttle is available at this time", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: []
    });

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
    getTravelTimes.mockResolvedValue([{
      mode: "driving",
      duration: 5
    }]);
    haversineDistance.mockReturnValue(10);

    const result = await estimateShuttleTravelTime({
        latitude: 45.5,
        longitude: -73.6
      },
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

  test("should return null if shuttleRideTime is NaN", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["13:30", "14:00"],
      LOY: ["13:45", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{
      mode: "walking",
      duration: 5
    }]);
    jest.spyOn(TravelFacade, "getGoogleTravelTime").mockResolvedValue(NaN);

    const result = await estimateShuttleTravelTime({
        latitude: 45.5,
        longitude: -73.6
      },
      "LOY"
    );

    expect(result).toBeNull();
  });

  test("should return null if travelTimeToStop is NaN", async () => {
    fetchShuttleScheduleByDay.mockResolvedValue({
      SGW: ["13:30", "14:00"],
      LOY: ["13:45", "14:15"],
    });

    getTravelTimes.mockResolvedValue([{
      mode: "walking",
      duration: NaN
    }]);
    haversineDistance.mockReturnValue(10);
    jest.spyOn(TravelFacade, "getGoogleTravelTime").mockResolvedValue(NaN);

    const result = await estimateShuttleTravelTime({
        latitude: 45.5,
        longitude: -73.6
      },
      "LOY"
    );

    expect(result).toBeNull();
  });

  // Test when fetchShuttleScheduleByDay returns null (valid weekday but no data)
  test("estimateShuttleTravelTime should return null if schedule is null", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-11-01T10:00:00Z")); // Wednesday

    const mockGetTravelTimes = jest.spyOn(TravelFacade, "getTravelTimes").mockResolvedValue([{ duration: 5 }]);
  
    const mockFetch = jest.spyOn(require("../api/shuttleSchedule"), "fetchShuttleScheduleByDay");
    mockFetch.mockResolvedValue(null); // simulate failed fetch
  
    const result = await estimateShuttleTravelTime({ latitude: 1, longitude: 1 }, "LOY");
    expect(result).toBeNull();
  });

  // Test when travelOptions is an empty array
  test("estimateShuttleTravelTime should return null if no travel options are returned", async () => {
    jest.spyOn(TravelFacade, "getTravelTimes").mockResolvedValue([]); // empty options
  
    jest.spyOn(require("../api/shuttleSchedule"), "fetchShuttleScheduleByDay").mockResolvedValue({
      SGW: ["10:00"],
    });
  
    const result = await estimateShuttleTravelTime({ latitude: 0, longitude: 0 }, "LOY");
    expect(result).toBeNull();
  });

  // Test when all travel durations are null
  test("estimateShuttleTravelTime should return null if all travel durations are null", async () => {
    jest.spyOn(TravelFacade, "getTravelTimes").mockResolvedValue([
      { duration: null },
      { duration: null },
    ]);
  
    jest.spyOn(require("../api/shuttleSchedule"), "fetchShuttleScheduleByDay").mockResolvedValue({
      SGW: ["10:00"],
    });
  
    const result = await estimateShuttleTravelTime({ latitude: 0, longitude: 0 }, "LOY");
    expect(result).toBeNull();
  });

  //Test when shuttleRideTime is NaN
  test("estimateShuttleTravelTime should return null if shuttleRideTime is NaN", async () => {
    jest.spyOn(TravelFacade, "getTravelTimes").mockResolvedValue([{ duration: 5 }]);
    jest.spyOn(TravelFacade, "haversineDistance").mockReturnValue(NaN); // Force NaN
  
    jest.spyOn(require("../api/shuttleSchedule"), "fetchShuttleScheduleByDay").mockResolvedValue({
      SGW: ["23:59"], // future time
    });
  
    const result = await estimateShuttleTravelTime({ latitude: 1, longitude: 1 }, "LOY");
    expect(result).toBeNull();
  });

  // Test when stop schedule is empty (no valid future time found)
  test("estimateShuttleTravelTime should return null if no upcoming shuttle is found", async () => {
    const currentTime = new Date();
    const pastTime = `${currentTime.getHours() - 1}:${currentTime.getMinutes()}`;
  
    jest.spyOn(require("../api/shuttleSchedule"), "fetchShuttleScheduleByDay").mockResolvedValue({
      SGW: [pastTime], // all times in the past
    });
  
    jest.spyOn(TravelFacade, "getTravelTimes").mockResolvedValue([{ duration: 10 }]);
    jest.spyOn(TravelFacade, "getGoogleTravelTime").mockResolvedValue(NaN);
  
    const result = await estimateShuttleTravelTime({ latitude: 0, longitude: 0 }, "LOY");
    expect(result).toBeNull();
  });
  
  
});