import TravelFacade from "./TravelFacade";
import { fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";

/**
 * Estimate total shuttle travel time for the user
 * @param {Object} userLocation - { latitude, longitude }
 * @param {string} destinationCampus - "LOY" or "SGW"
 * @returns {Promise<number|null|{error:string}>}
 */
export const estimateShuttleTravelTime = async (
  userLocation,
  destinationCampus
) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  if (today === "Saturday" || today === "Sunday") {
    return { error: "No bus available on weekends." };
  }

  const schedule = await fetchShuttleScheduleByDay(today);
  if (!schedule) return null;

  const sgwStop = {
    latitude: SGWtoLoyola.geometry.coordinates[0][1],
    longitude: SGWtoLoyola.geometry.coordinates[0][0],
  };
  const loyolaStop = {
    latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
    longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
  };

  const departureStop = destinationCampus === "LOY" ? sgwStop : loyolaStop;

  const travelModes = ["walking", "driving", "transit", "bicycling"];
  const travelOptions = await TravelFacade.getTravelTimes(userLocation, departureStop, travelModes);
  if (!travelOptions.length) return null;

  const validOptions = travelOptions.filter(option => option.duration !== null);
  if (!validOptions.length) return null;

  const travelTimeToStop = Math.min(...validOptions.map(option => option.duration));

  const stopKey = destinationCampus === "LOY" ? "SGW" : "LOY";
  const stopSchedule = schedule[stopKey]?.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }) || [];

  let nextShuttleTime = stopSchedule.find((time) => time > currentTime);
  if (nextShuttleTime === undefined) return null;

  let waitTime = Math.max(0, nextShuttleTime - currentTime);

  const shuttleRideTime =
    destinationCampus === "LOY"
      ? (TravelFacade.haversineDistance(sgwStop, loyolaRegion) / 40) * 60
      : (TravelFacade.haversineDistance(loyolaStop, sgwRegion) / 40) * 60;

  if (isNaN(travelTimeToStop) || isNaN(shuttleRideTime)) return null;

  return Math.round(travelTimeToStop + waitTime + shuttleRideTime);
};

/**
 * Estimate shuttle times (wait + ride) for a button press
 * @param {string} currentStop - "SGW" or "LOY"
 * @returns {Promise<{waitTime:number, shuttleRideTime:number, totalTime:number}|null|{error:string}>}
 */
export const estimateShuttleFromButton = async (currentStop) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  if (today === "Saturday" || today === "Sunday") {
    return { error: "No bus available on weekends." };
  }

  const schedule = await fetchShuttleScheduleByDay(today);
  if (!schedule) return null;

  const stopKey = currentStop === "SGW" ? "SGW" : "LOY";

  const stopSchedule = schedule[stopKey]?.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }) || [];

  let nextShuttleTime = stopSchedule.find((time) => time > currentTime);
  if (nextShuttleTime === undefined) return null;

  let waitTime = Math.max(0, nextShuttleTime - currentTime);

  const sgwStop = {
    latitude: SGWtoLoyola.geometry.coordinates[0][1],
    longitude: SGWtoLoyola.geometry.coordinates[0][0],
  };
  const loyolaStop = {
    latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
    longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
  };

  const shuttleRideTime =
    currentStop === "SGW"
      ? (TravelFacade.haversineDistance(sgwStop, loyolaRegion) / 40) * 60
      : (TravelFacade.haversineDistance(loyolaStop, sgwRegion) / 40) * 60;

  if (isNaN(shuttleRideTime)) return null;

  return {
    waitTime: Math.round(waitTime),
    shuttleRideTime: Math.round(shuttleRideTime),
    totalTime: Math.round(waitTime + shuttleRideTime),
  };
};

/**
 * Formats time in minutes into a human-readable string
 * @param {number} minutes
 * @returns {string} e.g. "~About 1 hr 5 minutes"
 */
export const formatTime = (minutes) => {
  if (typeof minutes !== "number" || isNaN(minutes)) return "Unavailable";

  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;

  let timeStr = "";

  if (hours > 0) {
    timeStr += hours === 1 ? "1 hr" : `${hours} hrs`;
  }

  if (mins > 0) {
    if (hours > 0) timeStr += " ";
    timeStr += `${mins} minute${mins !== 1 ? "s" : ""}`;
  }

  if (timeStr === "") timeStr = "0 minutes";

  return `~About ${timeStr}`;
};