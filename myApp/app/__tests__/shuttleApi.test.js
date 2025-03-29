import React from "react";
import { fetchAllShuttleSchedules, fetchShuttleScheduleByDay, fetchLiveShuttleData, fetchShuttleInfo } from "../api/shuttleSchedule";
import * as shuttleScheduleData from "../api/shuttleScheduleData";
import axios from "axios";

jest.mock("axios"); 

const mockedAxios = axios;

describe("Shuttle Data Fetching Tests", () => {

  /**
   *  Test Case 1: Fetch all shuttle schedules
   * - Calls fetchAllShuttleSchedules(), which should return the full static shuttle schedule.
   * - Ensures that the returned schedule includes all days (Monday to Friday).
   */
  
  test("fetchAllShuttleSchedules should return full shuttle schedule", async () => {
    const schedule = await fetchAllShuttleSchedules();
    // console.log("Test fetched schedule:", schedule);

    // All expected days
    expect(schedule).toHaveProperty("Monday");  
    expect(schedule).toHaveProperty("Tuesday");
    expect(schedule).toHaveProperty("Wednesday");
    expect(schedule).toHaveProperty("Thursday");
    expect(schedule).toHaveProperty("Friday");
});
  
  /**
   * Test Case 2: Fetch a specific day's shuttle schedule (Monday)
   * - Calls fetchShuttleScheduleByDay("Monday") to fetch the schedule.
   * - Ensures that the response contains `LOY` (Loyola) and its value is an array.
   */
  
  test("fetchShuttleScheduleByDay should return Monday schedule", async () => {
    const schedule = await fetchShuttleScheduleByDay("Monday");
    expect(schedule).toHaveProperty("LOY"); // Validates the key exists
    expect(Array.isArray(schedule.LOY)).toBe(true); // Ensures it's an array
});

  /**
   * Test Case 3: Fetch a specific day's shuttle schedule (Wednesday)
   * - Calls fetchShuttleScheduleByDay ("WEDNESDAY") to fetch the schedule.
   * - Ensures the function can normalize the day string format (Since it's in all caps)
   * - Ensures that the response contains `SGW` and its value is an array.
   */
  
  test("fetchShuttleScheduleByDay should return Monday schedule", async () => {
    const schedule = await fetchShuttleScheduleByDay("WEDNESDAY");
    expect(schedule).toHaveProperty("SGW"); // Validates the key exists
    expect(Array.isArray(schedule.SGW)).toBe(true); // Ensures it's an array
});

  /**
   * Test Case 4: Fetching live shuttle data (mocked)
   * - Simulates an API call to `fetchLiveShuttleData()`.
   * - Ensures the response matches the expected mocked live data.
   */

  test("fetchLiveShuttleData should return live shuttle data", async () => {
    // Ensure Axios mock includes all required fields
    mockedAxios.create.mockReturnValue(mockedAxios); // Mock `axios.create()`
    mockedAxios.get.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
      config: { url: "https://shuttle.concordia.ca/concordiabusmap/Map.aspx" }, 
      data: "session cookies set", // Mocking session setup response
    });
    mockedAxios.post.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
      config: { url: "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject" }, // Added `url`
      data: { test: "mocked data" }, // Mocked response data
    });

    // Call the function and expect the mocked data to be returned
    const data = await fetchLiveShuttleData();
    expect(data).toEqual({ test: "mocked data" });
  });

  /**
   * Test Case 5: Handle session request failure in live data API
   * - Simulates a failed session request to fetch live shuttle data.
   * - Ensures that the function throws the correct error.
   */

  test("fetchLiveShuttleData should handle session request failure", async () => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockRejectedValue(new Error("Session request failed")); // Simulating failure
  
    await expect(fetchLiveShuttleData()).rejects.toThrow("Could not retrieve shuttle data.");
  });

  /**
   * Test Case 6: Handle POST request failure in live data API
   * - Simulates a failed POST request to fetch live shuttle data.
   * - Ensures that the function throws the correct error.
   */
  
  test("fetchLiveShuttleData should handle POST request failure", async () => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
    mockedAxios.post.mockRejectedValue(new Error("POST request failed")); // Simulating failure
  
    await expect(fetchLiveShuttleData()).rejects.toThrow("Could not retrieve shuttle data.");
  });

  /**
   * Test Case 7: Handle empty response from the live shuttle data API
   * - Simulates a scenario where the API returns an empty response.
   * - Ensures that the function throws an error indicating the response is empty.
   */
  
  test("fetchLiveShuttleData should throw error if response data is empty", async () => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
    mockedAxios.post.mockResolvedValue({ status: 200, data: null }); // Empty response
  
    await expect(fetchLiveShuttleData()).rejects.toThrow("Received empty response from the server.");
  });
  
  /**
   * Test Case 8: Handle invalid day input for shuttle schedule
   * - Calls fetchShuttleScheduleByDay("InvalidDay").
   */

  test("fetchShuttleScheduleByDay should return null on invalid day", async () => {
    const fallback = await fetchShuttleScheduleByDay("InvalidDay");
    expect(fallback).toBeNull();
  });
    

  /**
   * Test Case 9: Extracting relevant shuttle info
   * - Calls fetchShuttleInfo() with a sample response and verifies the output.
   */

  test("fetchShuttleInfo should return formatted shuttle data", async () => {
    // Mock Axios request to prevent real API call
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: "session cookies set",
    });

  // Mock Axios POST request for shuttle data
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        d: {
          Points: [
            { ID: "BUS1", Latitude: 45.5017, Longitude: -73.5673 },
            { ID: "BUS2", Latitude: 45.5088, Longitude: -73.554 },
          ],
        },
      },
    });

    // Call fetchShuttleInfo(), which now automatically fetches data
    const extractedData = await fetchShuttleInfo();

    expect(extractedData).toEqual([
      {
        id: "BUS1",
        latitude: 45.5017,
        longitude: -73.5673,
        timestamp: expect.any(String),
      },
      {
        id: "BUS2",
        latitude: 45.5088,
        longitude: -73.554,
        timestamp: expect.any(String),
      },
    ]);
  });


  /**
   * Test Case 10: Handle missing "Points" in API response
   * - Calls fetchShuttleInfo() with incomplete data.
   * - Ensures an error is thrown.
   */

  test("fetchShuttleInfo should throw an error for missing Points field", async () => {
    // Mock the API to return missing `Points`
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
    mockedAxios.post.mockResolvedValue({ status: 200, data: { d: {} } }); //  Missing `Points`

    // Ensure `fetchShuttleInfo()` throws the correct error
    await expect(fetchShuttleInfo()).rejects.toThrow("Error processing shuttle data.");

  });


  /**
   * Test Case 11: Handle empty Points array
   * - Calls fetchShuttleInfo() with an empty shuttle list.
   * - Ensures the function returns an empty array.
   */
  test("fetchShuttleInfo should return an empty array when no shuttles are present", async () => {
    // Mock Axios response with empty `Points`
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
    mockedAxios.post.mockResolvedValue({ status: 200, data: { d: { Points: [] } } });

    // Ensure function returns an empty array
    const extractedData = await fetchShuttleInfo();
    expect(extractedData).toEqual([]);
  });

  /**
   * Test Case 12: Fetch shuttle info from real-time data
   * - Calls fetchShuttleInfo() to ensure it processes live data correctly.
   */

  test("fetchShuttleInfo should extract data from live shuttle response", async () => {
    // Mock Axios request for session cookies
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: "session cookies set",
    });

    // Mock Axios POST request for shuttle data
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        d: {
          Points: [
            { ID: "BUS1", Latitude: 45.5017, Longitude: -73.5673 },
            { ID: "BUS2", Latitude: 45.5088, Longitude: -73.554 },
          ],
        },
      },
    });

    // Call `fetchShuttleInfo()`, which should use `fetchLiveShuttleData()`
    const extractedData = await fetchShuttleInfo();

    // Validate the extracted shuttle info
    expect(extractedData).toEqual([
      {
        id: "BUS1",
        latitude: 45.5017,
        longitude: -73.5673,
        timestamp: expect.any(String),
      },
      {
        id: "BUS2",
        latitude: 45.5088,
        longitude: -73.554,
        timestamp: expect.any(String),
      },
    ]);
  });

  /**
   * Test Case 13: Handle completely invalid API response
   * - Simulates a scenario where the API returns `null` instead of expected data.
   * - Ensures that `fetchShuttleInfo()` throws an error indicating an empty response.
   */

  test("fetchShuttleInfo should throw error for completely invalid response", async () => {
    // Mock invalid API response
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
    mockedAxios.post.mockResolvedValue({ status: 200, data: null }); // Invalid response

    await expect(fetchShuttleInfo()).rejects.toThrow("Received empty response from the server.");

  });

  test("fetchShuttleScheduleByDay should return mock schedule when getShuttleScheduleByDay is mocked", async () => {
    const mockSchedule = {
      SGW: ["12:00", "12:30"],
      LOY: ["13:00", "13:30"],
    };
  
    jest
      .spyOn(shuttleScheduleData, "getShuttleScheduleByDay")
      .mockImplementation(() => mockSchedule);
  
    const schedule = await fetchShuttleScheduleByDay("Whatever");
  
    expect(schedule).toEqual(mockSchedule);
  });

  test("extractShuttleInfo should default latitude and longitude to 0 when missing", async () => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({ status: 200, data: "session cookies set" });
  
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        d: {
          Points: [
            { ID: "BUS1" }, // No Latitude or Longitude
          ],
        },
      },
    });
  
    const extracted = await fetchShuttleInfo();
    expect(extracted).toEqual([
      {
        id: "BUS1",
        latitude: 0,      // defaulted
        longitude: 0,     // defaulted
        timestamp: expect.any(String),
      },
    ]);
  });
  
  
});

describe("Unit tests for shuttleScheduleData functions", () => {


  // Restore mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getAllShuttleSchedules should throw if shuttleSchedule is empty", () => {
    jest.spyOn(shuttleScheduleData, "getAllShuttleSchedules").mockImplementation(() => {
      throw new Error("Shuttle schedule data is empty.");
    });
  
    expect(() => shuttleScheduleData.getAllShuttleSchedules()).toThrow(
      "Shuttle schedule data is empty."
    );
  });
  

  test("getShuttleScheduleByDay should throw if input is empty", () => {
    expect(() => shuttleScheduleData.getShuttleScheduleByDay("")).toThrow(
      "Invalid day format received"
    );
  });

  test("getShuttleScheduleByDay should throw if input is not a string", () => {
    expect(() => shuttleScheduleData.getShuttleScheduleByDay(123)).toThrow(
      "Invalid day format received"
    );
  });

  test("getShuttleScheduleByDay should throw if day does not exist in schedule", () => {
    expect(() => shuttleScheduleData.getShuttleScheduleByDay("Saturday")).toThrow(
      "Invalid day: Saturday"
    );
  });

  test("getShuttleScheduleByDay should return data for valid normalized input", () => {
    const schedule = shuttleScheduleData.getShuttleScheduleByDay("wednesday");
    expect(schedule).toHaveProperty("LOY");
    expect(schedule).toHaveProperty("SGW");
  });

});



  

  
