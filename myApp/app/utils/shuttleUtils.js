import React from "react";
import { getGoogleTravelTime, getSortedTravelTimes } from "../api/googleMapsApi";
import { findNearestLocation, haversineDistance } from "./distanceShuttle";
import { fetchShuttleInfo, fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";

/**
 * Estimate total shuttle travel time for the user
 * @param {Object} userLocation - { latitude, longitude }
 * @param {string} destinationCampus - "LOY" or "SGW"
 * @returns {Promise<number|null|{error:string}>}
 *    - number: total travel time (minutes) if valid
 *    - null: if no shuttle is available
 *    - { error: string }: if it's a weekend or another error scenario you want to handle
 */
export const estimateShuttleTravelTime = async (userLocation, destinationCampus) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // 1) Quick weekend check
  if (today === "Saturday" || today === "Sunday") {
    return { error: "No bus available on weekends." };
  }

  // 2) Fetch schedule for today
  const schedule = await fetchShuttleScheduleByDay(today);
  if (!schedule) {
    return null;
  }

  // Define fixed shuttle stops
  const sgwStop = {
    latitude: SGWtoLoyola.geometry.coordinates[0][1],
    longitude: SGWtoLoyola.geometry.coordinates[0][0],
  };
  const loyolaStop = {
    latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
    longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
  };

  // Select correct stop based on destination
  const departureStop = destinationCampus === "LOY" ? sgwStop : loyolaStop;

  // Get all possible travel times to the stop
  const travelModes = ["walking", "driving", "transit", "bicycling"];
  const travelOptions = await getSortedTravelTimes(userLocation, departureStop, travelModes);
  if (!travelOptions.length) {
    return null; // No available transportation
  }

  const travelTimeToStop = travelOptions[0].duration; // Shortest travel time

  // Determine next available shuttle departure time
  const stopKey = destinationCampus === "LOY" ? "SGW" : "LOY";
  const stopSchedule = schedule[stopKey]?.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes; // Convert time to minutes
  }) || [];

  let nextShuttleTime = stopSchedule.find((time) => time > currentTime);
  if (nextShuttleTime === undefined) {
    // No shuttle left today
    return null;
  }

  let waitTime = Math.max(0, nextShuttleTime - currentTime);

  // Estimate shuttle ride duration (40 km/h)
  const shuttleRideTime =
    destinationCampus === "LOY"
      ? (haversineDistance(sgwStop, loyolaRegion) / 40) * 60
      : (haversineDistance(loyolaStop, sgwRegion) / 40) * 60;

  if (isNaN(travelTimeToStop) || isNaN(shuttleRideTime)) {
    return null; // Invalid calculation
  }

  // Total estimated travel time
  return travelTimeToStop + waitTime + shuttleRideTime;
};

/**
 * Estimate shuttle times (wait + ride) for a button press
 * @param {string} currentStop - "SGW" or "LOY"
 * @returns {Promise<{waitTime:number, shuttleRideTime:number, totalTime:number}|null|{error:string}>}
 *    - { waitTime, shuttleRideTime, totalTime }: valid times
 *    - null: if no shuttle is available
 *    - { error: string }: if it's a weekend or another error scenario you want to handle
 */
export const estimateShuttleFromButton = async (currentStop) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // 1) Quick weekend check
  if (today === "Saturday" || today === "Sunday") {
    return { error: "No bus available on weekends." };
  }

  // 2) Fetch shuttle schedule
  const schedule = await fetchShuttleScheduleByDay(today);
  if (!schedule) {
    return null; // No schedule (holiday, etc.)
  }

  // Determine the next available shuttle departure time
  const stopKey = currentStop === "SGW" ? "SGW" : "LOY";
  const destination = currentStop === "SGW" ? "LOY" : "SGW";

  const stopSchedule = schedule[stopKey]?.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes; // Convert time to minutes
  }) || [];

  let nextShuttleTime = stopSchedule.find((time) => time > currentTime);
  if (nextShuttleTime === undefined) {
    return null; // No upcoming shuttle
  }

  let waitTime = Math.max(0, nextShuttleTime - currentTime);

  // Estimate shuttle ride duration (40 km/h)
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
      ? (haversineDistance(sgwStop, loyolaRegion) / 40) * 60
      : (haversineDistance(loyolaStop, sgwRegion) / 40) * 60;

  if (isNaN(shuttleRideTime)) {
    return null; // Invalid calculation
  }

  // Return wait + ride times
  return {
    waitTime,
    shuttleRideTime,
    totalTime: waitTime + shuttleRideTime,
  };
};
