import React, { useEffect, useState } from "react";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import PropTypes from 'prop-types';

const IndoorMap = ({ selectedBuilding, selectedFloor }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const MAPBOX_ACCESS_TOKEN = Constants.expoConfig?.extra?.mapbox;
  const DATASET_ID = "cm7qjtnoy2d3o1qmmngcrv0jl";

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/datasets/v1/7anine/${DATASET_ID}/features?access_token=${MAPBOX_ACCESS_TOKEN}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      }
    };

    fetchGeoJson();
  }, []);

  if (!geoJsonData) return null;

  // Filter features: selected floor for the selected building + first floors of other buildings
  const filteredGeoJson = {
    type: "FeatureCollection",
    features: geoJsonData.features.filter((feature) => {
      const featureBuilding = feature.properties.building;
      const featureFloor = feature.properties.floor;

      // Always show first floors of all buildings
      if (!selectedBuilding) return featureFloor === 1;

      return (
        (featureBuilding === selectedBuilding.name &&
          featureFloor === Number(selectedFloor)) || // Selected building & floor
        (featureBuilding !== selectedBuilding.name && featureFloor === 1) // Other buildings' first floor
      );
    }),
  };

  return (
    <Mapbox.ShapeSource id="indoor-map" shape={filteredGeoJson}>
      {/* Room Fill Layer (Polygon & MultiPolygon) */}
      <Mapbox.FillLayer
        id="room-fill-layer"
        sourceID="indoor-map"
        style={{
          fillColor: "red",
          fillOpacity: 0.2,
        }}
        filter={[
          "any",
          ["==", ["geometry-type"], "Polygon"],
          ["==", ["geometry-type"], "MultiPolygon"],
        ]}
        minZoomLevel={18}
      />

      {/* Room Outline */}
      <Mapbox.LineLayer
        id="room-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={[
          "any",
          ["==", ["geometry-type"], "Polygon"],
          ["==", ["geometry-type"], "MultiPolygon"],
        ]}
        minZoomLevel={18}
      />

      {/* Pathways (LineString & MultiLineString) */}
      <Mapbox.LineLayer
        id="path-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "black",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={[
          "any",
          ["==", ["geometry-type"], "LineString"],
          ["==", ["geometry-type"], "MultiLineString"],
          ["==", ["get", "type"], "Paths"],
        ]}
        minZoomLevel={18}
      />

      {/* Walls (LineString & MultiLineString) */}
      <Mapbox.LineLayer
        id="wall-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={[
          "any",
          ["==", ["geometry-type"], "LineString"],
          ["==", ["geometry-type"], "MultiLineString"],
          ["==", ["get", "type"], "Walls"],
        ]}
        minZoomLevel={18}
      />

      {/* Labels for Doors & Points of Interest (Only for Points) */}
      <Mapbox.SymbolLayer
  id="door-text-layer"
  sourceID="indoor-map"
  style={{
    textField: ["coalesce", ["get", "name"], "Unnamed"], // Fallback for missing names
    textSize: 14,
    textColor: "black",
    textHaloColor: "white",
    textHaloWidth: 1,
  }}
  filter={[
    "all",
    ["==", ["geometry-type"], "Point"], 
    ["==", ["get", "floor"], Number(selectedFloor)] 
  ]}
  minZoomLevel={18}
/>


    </Mapbox.ShapeSource>
  );
};
IndoorMap.propTypes = {
  selectedBuilding: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  selectedFloor: PropTypes.string
};

export default IndoorMap;
