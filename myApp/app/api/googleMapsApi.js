import React from "react";
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.apiKey;

/**
 * Fetch travel time from Google Maps API with traffic consideration.
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @param {string} mode - "walking", "driving", "transit"
 * @returns {Promise<number>} Travel time in minutes
 */
export const getGoogleTravelTime = async (origin, destination, mode) => {
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_API_KEY}`;

    if (mode === "driving") {
        url += `&departure_time=now&traffic_model=best_guess`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Ensure `routes` exists and has a valid structure
        if (data.routes && data.routes.length > 0 && data.routes[0].legs.length > 0) {
            const leg = data.routes[0].legs[0];

            // Use duration_in_traffic if available
            const durationInSeconds = leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value;
            return durationInSeconds / 60; // Convert to minutes
        }
    } catch (error) {
        console.error(`Error fetching ${mode} time:`, error);
    }

    return 0; // Return 0 if request fails or no routes are found
};


/**
 * Fetch travel times for multiple modes and sort them, considering traffic for driving.
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @param {Array} modes - Array of travel modes (e.g., ["walking", "driving", "transit"])
 * @returns {Promise<Array>} Sorted list of travel modes with their estimated times.
 */
export const getSortedTravelTimes = async (origin, destination, modes = ["walking", "driving", "transit"]) => {
    try {
        const travelTimePromises = modes.map(async (mode) => {
            let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_API_KEY}`;

            // Enable traffic for driving mode
            if (mode === "driving") {
                url += `&departure_time=now&traffic_model=best_guess`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.routes.length > 0) {
                    return {
                        mode,
                        duration: data.routes[0].legs[0].duration.value / 60, // Convert seconds to minutes
                    };
                }
            } catch (error) {
                console.error(`Error fetching ${mode} time:`, error);
            }

            return { mode, duration: Infinity }; // Default large value if API fails
        });

        // Await all mode fetches
        const travelTimes = await Promise.all(travelTimePromises);

        // Sort by shortest travel time
        return travelTimes.filter(t => t.duration !== Infinity).sort((a, b) => a.duration - b.duration);
    } catch (error) {
        console.error("Error fetching travel times:", error);
        return [];
    }
};
