import React from "react";
import { fetchAllShuttleSchedules, fetchShuttleScheduleByDay, fetchLiveShuttleData } from "../api/shuttleSchedule";
import axios from "axios";


jest.mock("axios"); // Mock Axios

// Explicitly cast Axios as a Jest Mock
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

  test("fetchShuttleScheduleByDay should throw error for invalid day", async () => {
    await expect(fetchShuttleScheduleByDay("InvalidDay")).rejects.toThrow(
      "Invalid day: InvalidDay. Please provide Monday, Tuesday, Wednesday, Thursday, or Friday."
    );
  });
  

  
});