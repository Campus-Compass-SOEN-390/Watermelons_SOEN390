import { getAllShuttleSchedules, getShuttleScheduleByDay } from "./shuttleScheduleData.js";
import { getRealTimeShuttleData } from "./shuttleLiveData.js";

// Fetch all shuttle schedules
export const fetchAllShuttleSchedules = async () => getAllShuttleSchedules();

// Fetch a specific day's schedule
export const fetchShuttleScheduleByDay = async (day) => {
  try {
      console.log(`Fetching shuttle schedule for: ${day}`);
      return getShuttleScheduleByDay(day); // Now this throws an error for invalid days
  } catch (error) {
      console.error("Error fetching schedule:", error.message);
      throw error; // 🚨 Re-throw the error so tests correctly catch it
  }
};


// Fetch live shuttle data
export const fetchLiveShuttleData = async () => getRealTimeShuttleData();

// Default export
export default {
  fetchAllShuttleSchedules,
  fetchShuttleScheduleByDay,
  fetchLiveShuttleData
};
