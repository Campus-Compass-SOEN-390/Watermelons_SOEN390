import React, { useEffect, useState } from "react";
import Mapbox from "@rnmapbox/maps";
import { dijkstra } from "./ShortestPath";

// Set your Mapbox access token
Mapbox.setAccessToken("sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw");

const ShortestPathMap = ({ graph, nodeCoordinates, startNode, endNode }) => {
  const [pathCoordinates, setPathCoordinates] = useState([]);

  useEffect(() => {
    if (!startNode || !endNode || !nodeCoordinates) return;

    // Find shortest path using Dijkstra's algorithm
    const shortestPathNodes = dijkstra(graph, startNode, endNode);

    if (shortestPathNodes) {
      const coordinates = shortestPathNodes.map((node) => nodeCoordinates[node]);
      setPathCoordinates(coordinates);
    }
  }, [startNode, endNode]);

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

export default ShortestPathMap;
