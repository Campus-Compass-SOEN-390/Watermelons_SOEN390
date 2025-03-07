import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { dijkstra } from "./ShortestPath";
import Graph from "./Graphs/Graph";
import nodeCoordinates from "./Coordinates/nodeCoordinates";

// Set your Mapbox access token
Mapbox.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN");

const ShortestPathMap = ({ startNode, endNode, nodeCoordinates }) => {
  const [pathCoordinates, setPathCoordinates] = useState([]);

  useEffect(() => {
    if (!startNode || !endNode || !nodeCoordinates) return;

    // Find shortest path using Dijkstra's algorithm
    const shortestPathNodes = dijkstra(hallwayGraph, startNode, endNode);

    if (shortestPathNodes) {
      const coordinates = shortestPathNodes.map((node) => nodeCoordinates[node]);
      setPathCoordinates(coordinates);
    }
  }, [startNode, endNode, nodeCoordinates]);

  if (pathCoordinates.length < 2) return null;

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
    <View style={{ flex: 1 }}>
      <Mapbox.MapView style={{ flex: 1 }}>
        <Mapbox.Camera zoomLevel={18} centerCoordinate={pathCoordinates[0]} />
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
      </Mapbox.MapView>
    </View>
  );
};

export default ShortestPathMap;
