import React from "react";
import Mapbox from "@rnmapbox/maps";

const IndoorMap = ({ selectedBuilding, selectedFloor }) => {
  console.log("Rendering IndoorMap with:");
  console.log("Selected Building:", selectedBuilding);
  console.log("Selected Floor:", selectedFloor);

  return (
    <Mapbox.VectorSource
      id="indoor-map"
      url="mapbox://7anine.cm7qjtnoy2d3o1qmmngcrv0jl-8fuqg"
      minZoomLevel={18}
    >
      {/* Room Fill Layer (Only for Polygon geometries) */}
      <Mapbox.FillLayer
        id="room-fill-layer"
        sourceID="indoor-map"
        sourceLayerID="h8test"
        style={{
          fillColor: "red",
          fillOpacity: 0.2,
        }}
        filter={
          selectedBuilding?.name
            ? [
                "all",
                ["==", ["get", "building"], selectedBuilding.name],
                ["==", ["get", "floor"], Number(selectedFloor)],
                ["==", ["geometry-type"], "Polygon"], 
                ["==", ["get", "type"], "Rooms"]
              ]
            : [
                "all",
                ["==", ["get", "floor"], 1],
                ["==", ["geometry-type"], "Polygon"], 
                ["==", ["get", "type"], "Rooms"]
              ]
        }
      />

      {/* Room Outline */}
      <Mapbox.LineLayer
        id="room-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8test"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={
          selectedBuilding?.name
            ? [
                "all",
                ["==", ["get", "building"], selectedBuilding.name],
                ["==", ["get", "floor"], Number(selectedFloor)],
                ["==", ["geometry-type"], "Polygon"], 
                ["==", ["get", "type"], "Rooms"]
              ]
            : [
                "all",
                ["==", ["get", "floor"], 1],
                ["==", ["geometry-type"], "Polygon"], 
                ["==", ["get", "type"], "Rooms"]
              ]
        }
      />

      {/* Pathways (Only for LineString geometries) */}
      <Mapbox.LineLayer
        id="path-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8test"
        style={{
          lineColor: "black",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={
          selectedBuilding?.name
            ? [
                "all",
                ["==", ["get", "building"], selectedBuilding.name],
                ["==", ["get", "floor"], Number(selectedFloor)],
                ["==", ["geometry-type"], "LineString"], 
                ["==", ["get", "type"], "Paths"]
              ]
            : [
                "all",
                ["==", ["get", "floor"], 1],
                ["==", ["geometry-type"], "LineString"], 
                ["==", ["get", "type"], "Paths"]
              ]
        }
      />

      {/* Walls (Only for LineString geometries) */}
      <Mapbox.LineLayer
        id="wall-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8test"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={
          selectedBuilding?.name
            ? [
                "all",
                ["==", ["get", "building"], selectedBuilding.name],
                ["==", ["get", "floor"], Number(selectedFloor)],
                ["==", ["geometry-type"], "LineString"], 
                ["==", ["get", "type"], "Walls"]
              ]
            : [
                "all",
                ["==", ["get", "floor"], 1],
                ["==", ["geometry-type"], "LineString"], 
                ["==", ["get", "type"], "Walls"]
              ]
        }
      />

      {/* Labels for Doors & Points of Interest (Only for Point geometries) */}
      <Mapbox.SymbolLayer
        id="door-text-layer"
        sourceID="indoor-map"
        sourceLayerID="h8test"
        style={{
          textField: ["get", "name"], 
          textSize: 14,
          textColor: "black",
          textHaloColor: "white",
          textHaloWidth: 1,
        }}
        filter={
          selectedBuilding?.name
            ? [
                "all",
                ["==", ["get", "building"], selectedBuilding.name], 
                ["==", ["get", "floor"], Number(selectedFloor)],  
                ["==", ["geometry-type"], "Point"], 
                ["any", 
                  ["==", ["get", "type"], "Door"], 
                  ["==", ["get", "type"], "Point of Interest"]
                ] 
              ]
            : [
                "all",
                ["==", ["get", "floor"], 1],
                ["==", ["geometry-type"], "Point"], 
                ["any", 
                  ["==", ["get", "type"], "Door"], 
                  ["==", ["get", "type"], "Point of Interest"]
                ]
              ]
        }
      />
    </Mapbox.VectorSource>
  );
};

export default IndoorMap;
