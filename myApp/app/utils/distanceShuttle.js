//This was inspired by https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/

/**
 * Find the nearest location.
 * @param {Object} userLocation - { latitude, longitude }
 * @param {Array} locations - List of { latitude, longitude }
 * @returns {Object} Nearest location
 */
export const findNearestLocation = (userLocation, locations) => {
  return locations.reduce((closest, location) => {
    return haversineDistance(userLocation, location) <
      haversineDistance(userLocation, closest)
      ? location
      : closest;
  }, locations[0]);
};

/**
 * Calculate real-world distance (Haversine Formula).
 * @param {Object} coord1 - { latitude, longitude }
 * @param {Object} coord2 - { latitude, longitude }
 * @returns {number} Distance in km
 */
export const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Mean Earth radius in km
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
