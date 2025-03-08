import React from "react";
import Mapbox from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native";
import {View} from 'react-native';
// Update MapMarkers to handle coordinates correctly and make markers clickable
export default function MapMarkers({ data, MarkerComponent, onMarkerPress }) {
  console.log("MapMarkers data:", data[0]);
  return data.map((point) => {
    const lat = point?.geometry?.location?.lat;
    const lng = point?.geometry?.location?.lng;
    if (!lat || !lng) return null;

    // Generate a unique key/id using place_id or fallback to a random id
    const pointId =
      point.place_id || `marker-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Mapbox.MarkerView
        key={pointId}
        id={pointId}
        coordinate={[lng, lat]}
        title={point.name || "Location"}
        onPress={() => onMarkerPress && onMarkerPress(point)}
      >
        <TouchableOpacity onPress={() => onMarkerPress && onMarkerPress(point)}>
          <MarkerComponent />
        </TouchableOpacity>
      </Mapbox.MarkerView>
    );
  });
}
