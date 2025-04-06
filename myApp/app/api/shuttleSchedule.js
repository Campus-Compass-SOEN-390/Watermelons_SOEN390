import { getAllShuttleSchedules, getShuttleScheduleByDay } from "./shuttleScheduleData.js";
import { getRealTimeShuttleData, extractShuttleInfo } from "./shuttleLiveData.js";


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
