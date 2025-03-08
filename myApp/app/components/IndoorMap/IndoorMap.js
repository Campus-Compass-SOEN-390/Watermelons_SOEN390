import React, { useEffect, useState } from "react";
import Mapbox from "@rnmapbox/maps";

const IndoorMap = ({ selectedBuilding, selectedFloor }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw"; 
  const DATASET_ID = "cm7qjtnoy2d3o1qmmngcrv0jl"; 

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/datasets/v1/7anine/${DATASET_ID}/features?access_token=${MAPBOX_ACCESS_TOKEN}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      }
    };

    fetchGeoJson();
  }, []);

  if (!geoJsonData) return null; 

  // Filter features based on selected building & floor
  const filteredGeoJson = {
    type: "FeatureCollection",
    features: geoJsonData.features.filter((feature) => {
      const buildingMatch = selectedBuilding ? feature.properties.building === selectedBuilding.name : true;
      const floorMatch = selectedFloor !== null ? feature.properties.floor === Number(selectedFloor) : true;
      return buildingMatch && floorMatch;
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
        filter={["any", ["==", ["geometry-type"], "Polygon"], ["==", ["geometry-type"], "MultiPolygon"]]}
        minZoomLevel={18} // ✅ Apply minZoomLevel here
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
        filter={["any", ["==", ["geometry-type"], "Polygon"], ["==", ["geometry-type"], "MultiPolygon"]]}
        minZoomLevel={18} // ✅ Apply minZoomLevel here
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
        filter={["any", ["==", ["geometry-type"], "LineString"], ["==", ["geometry-type"], "MultiLineString"]]}
        minZoomLevel={18} // ✅ Apply minZoomLevel here
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
        filter={["any", ["==", ["geometry-type"], "LineString"], ["==", ["geometry-type"], "MultiLineString"]]}
        minZoomLevel={18} // ✅ Apply minZoomLevel here
      />

      {/* Labels for Doors & Points of Interest (Only for Points) */}
      <Mapbox.SymbolLayer
        id="door-text-layer"
        sourceID="indoor-map"
        style={{
          textField: ["coalesce", ["get", "name"], "Unnamed"], // Fallback if no name
          textSize: 14,
          textColor: "black",
          textHaloColor: "white",
          textHaloWidth: 1,
        }}
        filter={[
          "all",
          ["==", ["geometry-type"], "Point"],
          ["any", ["==", ["get", "type"], "Door"], ["==", ["get", "type"], "Point of Interest"]],
        ]}
        minZoomLevel={18} // ✅ Apply minZoomLevel here
      />
    </Mapbox.ShapeSource>
  );
};

export default IndoorMap;
