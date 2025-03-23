import { addShuttleOption } from "../utils/addShuttleOption";
import { getAlternativeRoutes } from "../api/googleMapsApi";
import { estimateShuttleFromButton } from "../utils/shuttleUtils";
import TravelFacade from "../utils/TravelFacade";

// Mock dependencies
jest.mock("../api/googleMapsApi", () => ({
  getAlternativeRoutes: jest.fn(),
}));

jest.mock("../utils/shuttleUtils", () => ({
  estimateShuttleFromButton: jest.fn(),
}));

jest.mock("../utils/distanceShuttle", () => ({
  haversineDistance: jest.fn(),
}));

describe("addShuttleOption", () => {
  const origin = { latitude: 45.5, longitude: -73.6 };
  const destinationLoyola = { latitude: 45.4581281, longitude: -73.6417009 };
  const destinationSGW = { latitude: 45.4951962, longitude: -73.5792229 };
  const nonCampusDestination = { latitude: 45.4, longitude: -73.7 };
  const mockShuttleDistance = 4.8;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-03-18T10:00:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array if destination is NOT Loyola or SGW", async () => {
    const result = await addShuttleOption(origin, nonCampusDestination);
    expect(result).toEqual([]);
  });

  it("should return shuttle options when traveling to Loyola", async () => {
    getAlternativeRoutes.mockResolvedValue({
      driving: [
        {
          mode: "driving",
          duration: 15,
          summary: "Drive to SGW",
          distance: "3 km",
          steps: [],
        },
      ],
      walking: [
        {
          mode: "walking",
          duration: 25,
          summary: "Walk to SGW",
          distance: "2 km",
          steps: [],
        },
      ],
    });

    // Corrected shuttle departure time to 10:20 (620 minutes)
    estimateShuttleFromButton.mockResolvedValue({
      waitTime: 5, // shortest wait (arrival 10:15)
      shuttleRideTime: 20,
      totalTime: 25,
      nextShuttleTime: 630, // Shuttle at 10:30 (630 mins)
    });

    TravelFacade.haversineDistance.mockReturnValue(4.8);

    const result = await addShuttleOption(origin, destinationLoyola);

    expect(result).toEqual([
      {
        mode: "driving + Shuttle",
        duration: 50, // 15 driving + 15 waiting + 20 shuttle
        summary: "Drive to SGW → Shuttle",
        distance: "3 km + 4.8 km",
        coordinates: undefined,
        steps: [
          {
            instruction: "Wait for shuttle at SGW",
            distance: "0 km",
            duration: 15,
          },
          {
            instruction: "Take the shuttle to Loyola",
            distance: "4.8 km",
            duration: 20,
          },
        ],
        details: {
          waitTime: 5, // original minimum wait mock (just informational)
          shuttleRideTime: 20,
          totalTime: 25,
          nextShuttleTime: 630,
        },
      },
      {
        mode: "walking + Shuttle",
        duration: 50, // 25 walking + 5 waiting + 20 shuttle
        summary: "Walk to SGW → Shuttle",
        distance: "2 km + 4.8 km",
        coordinates: undefined,
        steps: [
          {
            instruction: "Wait for shuttle at SGW",
            distance: "0 km",
            duration: 5,
          },
          {
            instruction: "Take the shuttle to Loyola",
            distance: "4.8 km",
            duration: 20,
          },
        ],
        details: {
          waitTime: 5,
          shuttleRideTime: 20,
          totalTime: 25,
          nextShuttleTime: 630,
        },
      },
    ]);
  });

  it("should correctly calculate wait time based on arrival time at shuttle stop", async () => {
    getAlternativeRoutes.mockResolvedValue({
      driving: [
        {
          mode: "driving",
          duration: 10,
          summary: "Drive to SGW",
          distance: "3 km",
          steps: [],
        },
      ],
    });

    estimateShuttleFromButton.mockResolvedValue({
      waitTime: 5,
      shuttleRideTime: 20,
      totalTime: 25,
      nextShuttleTime: 615,
    });

    TravelFacade.haversineDistance.mockReturnValue(mockShuttleDistance);

    const result = await addShuttleOption(origin, destinationLoyola);

    expect(result[0].steps[0].duration).toBe(5);
    expect(result[0].duration).toBe(35);
  });

  it("should return an empty array if shuttle is not available", async () => {
    getAlternativeRoutes.mockResolvedValue({
      driving: [
        {
          mode: "driving",
          duration: 10,
          summary: "Drive to SGW",
          distance: "3 km",
          steps: [],
        },
      ],
    });

    estimateShuttleFromButton.mockResolvedValue({
      error: "No shuttle available",
    });

    const result = await addShuttleOption(origin, destinationLoyola);
    expect(result).toEqual([]);
  });
});
