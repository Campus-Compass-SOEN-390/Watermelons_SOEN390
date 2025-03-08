import React from "react";
import Mapbox from "@rnmapbox/maps";
import { RestaurantMarker, CoffeeMarker, ActivityMarker } from "./Markers";
import { Text } from "react-native";

// Update MapMarkers to handle coordinates correctly
export default function MapMarkers({ data, MarkerComponent }) {
  console.debug("marker", MarkerComponent);
  return data.map((point) => {
    const lat = point?.geometry?.location?.lat;
    const lng = point?.geometry?.location?.lng;
    if (!lat || !lng) return null;

    // Generate a unique key/id using place_id or fallback to a random id
    const pointId =
      point.place_id || `marker-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Mapbox.PointAnnotation
        key={pointId}
        id={pointId}
        coordinate={[lng, lat]}
        title={point.name || "Location"}
      >
        <Text>{MarkerComponent}</Text>
      </Mapbox.PointAnnotation>
    );
  });
}
