import React, { useEffect, useState } from "react";
import Mapbox from "@rnmapbox/maps";
import { dijkstra } from "./ShortestPath";
import Constants from "expo-constants";
import PropTypes from 'prop-types';

// Set your Mapbox access token
Mapbox.setAccessToken(Constants.expoConfig?.extra?.mapbox);

//Algorithm only renders the floor that you are currently on. Splits paths into different floors.
const ShortestPathMap = ({ graph, nodeCoordinates, startNode, endNode, currentFloor, isDisabled, pathId }) => {
  const [floorPaths, setFloorPaths] = useState({}); // Store paths for multiple floors
  const entranceNodes = ["Hall1-principal-entrance", "CC1-entrance", "MB1-entrance"];

  useEffect(() => {
    if (!startNode || !endNode || !nodeCoordinates) return;

    // Find shortest path using Dijkstra's algorithm
    const shortestPathNodes = dijkstra(graph, startNode, endNode, isDisabled);

    if (shortestPathNodes) {
      const pathsByFloor = {}; // Store paths for each floor

      shortestPathNodes.forEach((node) => {
        const nodeData = nodeCoordinates[node];
        if (!nodeData) return;
      
        const { floor, coordinates } = nodeData;
      
        if (!pathsByFloor[floor]) {
          pathsByFloor[floor] = [];
        }
      
        pathsByFloor[floor].push({ id: node, coordinates });
      });      

      setFloorPaths(pathsByFloor);
    }
  }, [startNode, endNode]);

  // Get path coordinates for the current floor
const currentPath = floorPaths[currentFloor] || [];
if (currentPath.length < 2) return null;

const features = [];

for (let i = 0; i < currentPath.length - 1; i++) {
  const from = currentPath[i];
  const to = currentPath[i + 1];

  const fromIsEntrance = entranceNodes.some((entrance) => from.id.includes(entrance));
  const toIsEntrance = entranceNodes.some((entrance) => to.id.includes(entrance));

  // Skip drawing if both are entrances
  if (fromIsEntrance && toIsEntrance) continue;

  features.push({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [from.coordinates, to.coordinates],
    },
    properties: {},
  });
}

const geoJsonPath = {
  type: "FeatureCollection",
  features,
};


  return (
    <Mapbox.ShapeSource id="shortestPath" shape={geoJsonPath}>
      <Mapbox.LineLayer
        id={`pathLayer-${pathId}`}
        style={{
          lineColor: "blue",
          lineWidth: 4,
          lineJoin: "round",
          lineCap: "round",
        }}
        minZoomLevel={18}
      />
    </Mapbox.ShapeSource>
  );
};

ShortestPathMap.propTypes = {
  graph: PropTypes.object.isRequired,
  nodeCoordinates: PropTypes.object.isRequired,
  startNode: PropTypes.string,
  endNode: PropTypes.string,
  currentFloor: PropTypes.number,
  isDisabled: PropTypes.bool,
  pathId: PropTypes.string,
};

export default ShortestPathMap;
