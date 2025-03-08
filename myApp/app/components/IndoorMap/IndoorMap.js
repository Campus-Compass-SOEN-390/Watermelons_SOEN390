import React from "react";
import Mapbox from "@rnmapbox/maps";

const IndoorMap = () => {
  return (
    <Mapbox.VectorSource
      id="indoor-map"
      url="mapbox://7anine.cm7qjtnoy2d3o1qmmngcrv0jl-6thbv"
      minZoomLevel={18}
    >
      <Mapbox.FillLayer
        id="room-fill-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          fillColor: "red",
          fillOpacity: 0.2,
        }}
        filter={["==", ["geometry-type"], "Polygon"]}
      />

      <Mapbox.LineLayer
        id="room-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={["==", ["geometry-type"], "Polygon"]}
      />

      <Mapbox.LineLayer
        id="path-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          lineColor: "black",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={["==", ["get", "type"], "Paths"]}
      />

      <Mapbox.LineLayer
        id="wall-line-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          lineColor: "red",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={["==", ["get", "type"], "Walls"]}
      />

      <Mapbox.SymbolLayer
        id="points-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          iconImage: "marker",
          iconSize: 1.0,
          iconAllowOverlap: true,
        }}
        filter={["==", ["geometry-type"], "Point"]}
      />

      <Mapbox.SymbolLayer
        id="text-layer"
        sourceID="indoor-map"
        sourceLayerID="h8"
        style={{
          textField: ["get", "name"],
          textSize: 14,
          textColor: "black",
          textHaloColor: "white",
          textHaloWidth: 1,
          textAllowOverlap: true,
        }}
        filter={["==", ["geometry-type"], "Point"]}
      />
    </Mapbox.VectorSource>
  );
};

export default IndoorMap;
