import React from "react";
import Constants from "expo-constants";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

/**
 * Fetch travel time from Google Maps API.
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @param {string} mode - "walking", "driving", "transit", "bicycling"
 * @returns {Promise<number|null>} Travel time in minutes or null if failed.
 */
export const getGoogleTravelTime = async (origin, destination, mode) => {
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_API_KEY}`;

    if (mode === "driving") {
        url += `&departure_time=now&traffic_model=best_guess`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Ensure `routes` exist and contain valid data
        if (data.routes && data.routes.length > 0 && data.routes[0].legs.length > 0) {
            const leg = data.routes[0].legs[0];

            // Use duration_in_traffic for driving if available
            const durationInSeconds = leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value;
            return Math.round(durationInSeconds / 60); // Convert to minutes
        }
    } catch (error) {
        console.error(`Error fetching ${mode} time:`, error);
    }

    return null; // Return null if request fails or no routes are found
};

/**
 * Fetch travel times for multiple modes (driving, transit, walking, bicycling).
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @param {Array} modes - Travel modes (default: ["walking", "driving", "transit", "bicycling"])
 * @returns {Promise<Array>} List of travel modes with their estimated times.
 */
export const getTravelTimes = async (origin, destination, modes = ["walking", "driving", "transit", "bicycling"]) => {
    try {
        const travelTimePromises = modes.map(async (mode) => {
            let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_API_KEY}`;

            if (mode === "driving") {
                url += `&departure_time=now&traffic_model=best_guess`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.routes.length > 0) {
                    return {
                        mode,
                        duration: Math.round(data.routes[0].legs[0].duration.value / 60), // Convert seconds to minutes
                    };
                }
            } catch (error) {
                console.error(`Error fetching ${mode} time:`, error);
            }

            return { mode, duration: null }; // Null indicates failure
        });

        return await Promise.all(travelTimePromises);
    } catch (error) {
        console.error("Error fetching travel times:", error);
        return [];
    }
};

/**
 * Fetch alternative routes from Google Maps API.
 * @param {Object} origin - { latitude, longitude }
 * @param {Object} destination - { latitude, longitude }
 * @param {Array<string>} modes - Transport modes ["driving", "walking", "transit", "bicycling"]
 * @returns {Promise<Object>} Object containing transport modes with up to 3 route options each.
 */
export const getAlternativeRoutes = async (
    origin,
    destination,
    modes = ["walking", "driving", "transit", "bicycling"],
    maxRoutes = 3 //default is 3
) => {
    const routePromises = modes.map(async (mode) => {
        let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&alternatives=true&key=${GOOGLE_API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.routes?.length) {
                return { mode, routes: [] };
            }

            return {
                mode,
                routes: data.routes.slice(0, maxRoutes).map((route) => ({
                    duration: Math.round(route.legs?.[0]?.duration?.value / 60) || 0,
                    distance: route.legs?.[0]?.distance?.text || "Unknown",
                    summary: route.summary || "No summary",
                    coordinates: decodePolyline(route.overview_polyline?.points || ""),
                    steps: route.legs?.[0]?.steps?.map((step) => ({
                        instruction: step.html_instructions?.replace(/<[^>]+>/g, "") || "No instruction",
                        distance: step.distance?.text || "Unknown",
                        duration: Math.round(step.duration?.value / 60) || 0,
                    })) || [],
                })),
            };
        } catch (error) {
            console.error(`Error fetching routes for mode ${mode}:`, error);
            return { mode, routes: [] };
        }
    });

    const results = await Promise.all(routePromises);
    return Object.fromEntries(results.map((r) => [r?.mode, r?.routes || []]));
};

/**
 * Decode polyline to coordinates.
 * @param {string} encodedPolyline - Encoded polyline from Google API
 * @returns {Array} Array of coordinates [longitude, latitude] for rendering
 */
const decodePolyline = (encodedPolyline) => {
    const polyline = require("@mapbox/polyline");
    return polyline.decode(encodedPolyline).map(([lat, lng]) => [lng, lat]);
};

