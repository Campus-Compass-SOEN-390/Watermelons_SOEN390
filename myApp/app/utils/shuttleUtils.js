import React from "react";
import { getGoogleTravelTime, getSortedTravelTimes } from "../api/googleMapsApi";
import { findNearestLocation, haversineDistance } from "./distanceShuttle";
import { fetchShuttleInfo, fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";

/**
 * Estimate total shuttle travel time for the user
 * @param {Object} userLocation - { latitude, longitude }
 * @param {string} destinationCampus - "LOY" or "SGW"
 * @returns {Promise<number|string>} Estimated total travel time in minutes, or a message if no shuttle is available
 */
export const estimateShuttleTravelTime = async (userLocation, destinationCampus) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
    // No shuttle on weekends
    const schedule = fetchShuttleScheduleByDay(today);
    if (!schedule) {
        throw new Error("No shuttle service available today.");
    }
    
    // Define fixed shuttle stops
    const sgwStop = { latitude: SGWtoLoyola.geometry.coordinates[0][1], longitude: SGWtoLoyola.geometry.coordinates[0][0] };
    const loyolaStop = { latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1], longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0] };
    
    // Select correct stop based on destination
    const departureStop = destinationCampus === "LOY" ? sgwStop : loyolaStop;
    
    // Get all possible travel times to the stop (walking, driving, transit, etc.)
    const travelModes = ["walking", "driving", "transit", "bicycling"];
    const travelOptions = await getSortedTravelTimes(userLocation, departureStop, travelModes);
    if (!travelOptions.length) {
        throw new Error("No available transportation to the shuttle stop.");
    }
    const travelTimeToStop = travelOptions[0].duration; // Pick the shortest travel time
    
    // Determine next available shuttle departure time
    const stopKey = destinationCampus === "LOY" ? "SGW" : "LOY";
    const stopSchedule = schedule[stopKey]?.map(time => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes; // Convert time to minutes
    }) || [];
    
    let nextShuttleTime = stopSchedule.find(time => time > currentTime);
    if (!nextShuttleTime) {
        throw new Error("No shuttle available at this time.");
    }
    let waitTime = Math.max(0, nextShuttleTime - currentTime);
    
    // Estimate shuttle ride duration based on distance and speed assumption (40 km/h)
    const shuttleRideTime = (destinationCampus === "LOY")
        ? haversineDistance(sgwStop, loyolaRegion) / 40 * 60
        : haversineDistance(loyolaStop, sgwRegion) / 40 * 60;
    
    // Total estimated travel time
    return travelTimeToStop + waitTime + shuttleRideTime;
};
