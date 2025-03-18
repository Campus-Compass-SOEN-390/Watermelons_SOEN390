import React, { useEffect, useState } from "react";
import Mapbox from "@rnmapbox/maps";
import { dijkstra } from "./ShortestPath";
import PropTypes from 'prop-types';

// Set your Mapbox access token
Mapbox.setAccessToken("sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw");

//Algorithm only renders the floor that you are currently on. Splits paths into different floors.
const ShortestPathMap = ({ graph, nodeCoordinates, startNode, endNode, currentFloor, isDisabled }) => {
  const [floorPaths, setFloorPaths] = useState({}); // Store paths for multiple floors

  useEffect(() => {
    if (!startNode || !endNode || !nodeCoordinates) return;

    // Find shortest path using Dijkstra's algorithm
    const shortestPathNodes = dijkstra(graph, startNode, endNode, isDisabled);

    if (shortestPathNodes) {
      const pathsByFloor = {}; // Store paths for each floor

      shortestPathNodes.forEach((node) => {
        const nodeData = nodeCoordinates[node];

        if (!nodeData) {
          console.error(` ${node} is missing from nodeCoordinates!`);
          return;
        }

        const { floor, coordinates } = nodeData;

        if (!pathsByFloor[floor]) {
          pathsByFloor[floor] = [];
        }

        pathsByFloor[floor].push(coordinates);
      });

      setFloorPaths(pathsByFloor);
    }
  }, [startNode, endNode]);

  // Get path coordinates for the current floor
  const pathCoordinates = floorPaths[currentFloor] || [];

  if (pathCoordinates.length < 2) return null; // Don't render if path is invalid

  const geoJsonPath = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: pathCoordinates,
        },
        properties: {},
      },
    ],
  };

  return (
    <Mapbox.ShapeSource id="shortestPath" shape={geoJsonPath}>
      <Mapbox.LineLayer
        id="pathLayer"
        style={{
          lineColor: "blue",
          lineWidth: 4,
          lineJoin: "round",
          lineCap: "round",
        }}
      />
    </Mapbox.ShapeSource>
  );
};

ShortestPathMap.propTypes = {
  graph: PropTypes.object.isRequired,
  nodeCoordinates: PropTypes.object.isRequired,
  startNode: PropTypes.string,
  endNode: PropTypes.string,
  currentFloor: PropTypes.string,
};

export default ShortestPathMap;
