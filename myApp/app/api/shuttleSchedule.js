import { getAllShuttleSchedules, getShuttleScheduleByDay } from "./shuttleScheduleData.js";
import { getRealTimeShuttleData, extractShuttleInfo } from "./shuttleLiveData.js";

// Enable this to simulate schedule for testing
const TEST_MODE = false;

/**
 * Return a mocked shuttle schedule for testing purposes.
 */
const getMockSchedule = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const nextHour = currentHour + 1;

  return {
    SGW: [`${currentHour}:${now.getMinutes() + 2}`, `${currentHour}:${now.getMinutes() + 15}`],
    LOY: [`${nextHour}:${now.getMinutes() + 5}`, `${nextHour}:${now.getMinutes() + 20}`],
  };
};

// Fetch all shuttle schedules
export const fetchAllShuttleSchedules = async () => getAllShuttleSchedules();

/**
 * Fetch a specific day's shuttle schedule.
 * In test mode, returns a mock schedule that always has shuttles available.
 */
export const fetchShuttleScheduleByDay = async (day) => {

  try {
    return getShuttleScheduleByDay(day);
  } catch (error) {
    console.warn("Error fetching schedule:", error.message);
    return null;
  }
};

// Fetch live shuttle data
export const fetchLiveShuttleData = async () => getRealTimeShuttleData();

// Extract shuttle information from live data
export const fetchShuttleInfo = async () => {
  const rawData = await getRealTimeShuttleData();
  return extractShuttleInfo(rawData);
};

// Default export
export default {
  fetchAllShuttleSchedules,
  fetchShuttleScheduleByDay,
  fetchLiveShuttleData,
  fetchShuttleInfo,
};
