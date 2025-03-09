import { getAllShuttleSchedules, getShuttleScheduleByDay } from "./shuttleScheduleData.js";
import { getRealTimeShuttleData, extractShuttleInfo } from "./shuttleLiveData.js";

// Fetch all shuttle schedules
export const fetchAllShuttleSchedules = async () => getAllShuttleSchedules();

// Fetch a specific day's schedule
export const fetchShuttleScheduleByDay = async (day) => {
  try {
    // If getShuttleScheduleByDay(day) throws "Invalid day: Sunday...", we catch it here
    return getShuttleScheduleByDay(day);
  } catch (error) {
    console.warn("Error fetching schedule:", error.message);
    throw new Error(`Invalid day: ${day}. Please provide Monday, Tuesday, Wednesday, Thursday, or Friday.`);
    // Instead of re-throwing, just return null
    
  }
};


// Fetch live shuttle data
export const fetchLiveShuttleData = async () => getRealTimeShuttleData();

// Extract shuttle information from live data
export const fetchShuttleInfo = async () => {
  const rawData = await getRealTimeShuttleData(); // Fetch data
  return extractShuttleInfo(rawData); // Process data
};


// Default export
export default {
  fetchAllShuttleSchedules,
  fetchShuttleScheduleByDay,
  fetchLiveShuttleData,
  fetchShuttleInfo,

};
