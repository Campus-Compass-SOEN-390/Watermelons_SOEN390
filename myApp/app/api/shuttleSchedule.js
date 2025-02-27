import { getAllShuttleSchedules, getShuttleScheduleByDay } from "./shuttleScheduleData.js";
import { getRealTimeShuttleData } from "./shuttleLiveData.js";

// Fetch all shuttle schedules
export const fetchAllShuttleSchedules = async () => getAllShuttleSchedules();

// Fetch a specific day's schedule
export const fetchShuttleScheduleByDay = async (day) => getShuttleScheduleByDay(day);

// Fetch live shuttle data
export const fetchLiveShuttleData = async () => getRealTimeShuttleData();

// Default export
export default {
  fetchAllShuttleSchedules,
  fetchShuttleScheduleByDay,
  fetchLiveShuttleData
};
