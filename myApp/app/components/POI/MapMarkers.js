import React from "react";
import Mapbox from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native";
import { getRandomBytes } from 'expo-crypto';


// Update MapMarkers to handle coordinates correctly and make markers clickable
export default function MapMarkers({ data, MarkerComponent, onMarkerPress }) {
  console.log("MapMarkers data:", data[0]);
  return data.map((point) => {
    const lat = point?.geometry?.location?.lat;
    const lng = point?.geometry?.location?.lng;
    if (!lat || !lng) return null;

    // Generate a unique key/id using place_id or fallback to a random id
    // Secure random ID generator -- sonarqube imporvement
    const generateSecureId = () => {
      const randomBytes = getRandomBytes(8); // 8 bytes = 16 hex chars
      return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    };

      // Usage:
      const pointId = point.place_id || `marker-${generateSecureId()}`;

    return (
      <Mapbox.MarkerView
        key={pointId}
        id={pointId}
        coordinate={[lng, lat]}
        title={point.name || "Location"}
        onPress={() => onMarkerPress?.(point)}
      >
        <TouchableOpacity onPress={() => onMarkerPress?.(point)}>
          <MarkerComponent />
        </TouchableOpacity>
      </Mapbox.MarkerView>
    );
  });
}
