import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";
import { getAlternativeRoutes } from "../api/googleMapsApi"; 
import { estimateShuttleFromButton } from "./shuttleUtils";
import { haversineDistance } from "./distanceShuttle";

const sgwStop = {
    latitude: SGWtoLoyola.geometry.coordinates[0][1],
    longitude: SGWtoLoyola.geometry.coordinates[0][0],
};

const loyolaStop = {
    latitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][1],
    longitude: SGWtoLoyola.geometry.coordinates.slice(-1)[0][0],
};

/**
 * Check if a location is within a campus (SGW or Loyola).
 */
const isLocationInCampus = (location, campusRegion) => {
    return (
        location.latitude >= campusRegion.latitude - campusRegion.latitudeDelta &&
        location.latitude <= campusRegion.latitude + campusRegion.latitudeDelta &&
        location.longitude >= campusRegion.longitude - campusRegion.longitudeDelta &&
        location.longitude <= campusRegion.longitude + campusRegion.longitudeDelta
    );
};


/**
 * Add Shuttle as a Travel Option if Destination is SGW or Loyola
 */
export const addShuttleOption = async (origin, destination) => {
    // Step 1: Check if destination is SGW or Loyola. If not, return empty.
    if (!isLocationInCampus(destination, loyolaRegion) && !isLocationInCampus(destination, sgwRegion)) {
        return []; // No shuttle option if not going to Loyola or SGW
    }

    // Step 2: Find the nearest shuttle stop (SGW → Loyola or Loyola → SGW)
    const isGoingToLoyola = isLocationInCampus(destination, loyolaRegion);
    const shuttleStop = isGoingToLoyola ? sgwStop : loyolaStop; // Correct shuttle stop

    // Step 3: Fetch fastest travel modes to the shuttle stop
    const travelModes = ["walking", "driving", "transit", "bicycling"];
    const travelToShuttleOptions = await getAlternativeRoutes(origin, shuttleStop, travelModes, 1); // Fetch only 1 best route per mode

    if (!travelToShuttleOptions || Object.keys(travelToShuttleOptions).length === 0) {
        return []; // No valid travel options to shuttle stop
    }

    // Step 4: Get shuttle time from SGW to Loyola (or Loyola to SGW)
    const shuttleInfo = await estimateShuttleFromButton(isGoingToLoyola ? "SGW" : "LOY");
    if (!shuttleInfo || shuttleInfo.error) {
        return []; // No shuttle available
    }

    // Step 5: Calculate real shuttle distance dynamically
    const shuttleDistance = haversineDistance(sgwStop, loyolaStop);

    // Step 6: Modify each travel mode by adding shuttle time
    const shuttleOptions = Object.entries(travelToShuttleOptions).map(([mode, routes]) => {
        const bestRoute = routes[0]; // fastest route
    
        // Current absolute time (in minutes since midnight)
        const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    
        // Estimated arrival at shuttle stop (absolute minutes since midnight)
        const arrivalMinutes = currentMinutes + bestRoute.duration;
    
        // Wait time = shuttle's next departure minus your arrival time
        const actualWaitTime = Math.max(0, shuttleInfo.nextShuttleTime - arrivalMinutes);
    
        return {
            mode: `${mode} + Shuttle`,
            duration: bestRoute.duration + actualWaitTime + shuttleInfo.shuttleRideTime, 
            summary: `${bestRoute.summary} → Shuttle`,
            distance: `${bestRoute.distance} + ${shuttleDistance.toFixed(1)} km`,
            coordinates: bestRoute.coordinates,
            steps: [
                ...bestRoute.steps,
                {
                    instruction: `Wait for shuttle at ${isGoingToLoyola ? "SGW" : "Loyola"}`,
                    distance: "0 km",
                    duration: actualWaitTime
                },
                {
                    instruction: `Take the shuttle to ${isGoingToLoyola ? "Loyola" : "SGW"}`,
                    distance: `${shuttleDistance.toFixed(1)} km`,
                    duration: shuttleInfo.shuttleRideTime
                }
            ],
            details: shuttleInfo
        };
    });
    
    return shuttleOptions;
};