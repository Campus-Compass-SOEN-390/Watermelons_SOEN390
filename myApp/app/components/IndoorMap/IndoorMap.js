import React, { useState, useEffect } from "react";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import PropTypes from "prop-types";
import finalMapData from "../../../assets/floorplans/finalMap.json";

const IndoorMap = ({ selectedBuilding, selectedFloor }) => {
  const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    Mapbox.setAccessToken(Constants.expoConfig?.extra?.mapbox);
    setGeoJsonData(finalMapData);
  }, []);

  if (!geoJsonData.features.length) {
    return <Mapbox.ShapeSource id="indoor-map" testID="indoor-map" shape={{ type: "FeatureCollection", features: [] }} />;
  }  

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
    <Mapbox.ShapeSource id="indoor-map" testID="indoor-map" shape={filteredGeoJson}>
      {/* Room Fill Layer */}
      <Mapbox.FillLayer
        id="room-fill-layer"
        testID="room-fill-layer"
        sourceID="indoor-map"
        style={{
          fillColor: "#922338",
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
        testID="room-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "#922338",
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

      {/* Pathways */}
      <Mapbox.LineLayer
        id="path-line-layer"
        testID="path-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "black",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={[
          "any",
          ["==", ["get", "type"], "Paths"],
        ]}
        minZoomLevel={18}
      />

      {/* Walls */}
      <Mapbox.LineLayer
        id="wall-line-layer"
        testID="wall-line-layer"
        sourceID="indoor-map"
        style={{
          lineColor: "#922338",
          lineWidth: 2,
          lineOpacity: 1.0,
        }}
        filter={[
          "any",
          ["==", ["get", "type"], "Walls"],
        ]}
        minZoomLevel={18}
      />

      {/* Labels for Doors */}
      <Mapbox.SymbolLayer
        id="door-text-layer"
        testID="door-text-layer"
        sourceID="indoor-map"
        style={{
          textField: ["coalesce", ["get", "id"], "Unnamed"],
          textSize: 14,
          textColor: "black",
          textHaloColor: "white",
          textHaloWidth: 1,
        }}
        filter={[
          "any",
          ["==", ["get", "type"], "Door"],
          ["==", ["get", "type"], "Doors"],
        ]}
        minZoomLevel={18}
      />

      {/* Labels for POIs */}
      <Mapbox.SymbolLayer
        id="poi-elevator-layer"
        testID="poi-elevator-layer"
        sourceID="indoor-map"
        style={{
          iconImage: require("../../../assets/images/elevator.png"),
          iconSize: 0.3
        }}
        filter={[
          "==", ["get", "name"], "Elevator"
        ]}
        minZoomLevel={18}
      />

      <Mapbox.SymbolLayer
        id="poi-stairs-layer"
        testID="poi-stairs-layer"
        sourceID="indoor-map"
        style={{
          iconImage: require("../../../assets/images/stairs.png"), // Icon for Stairs POIs
          iconSize: 0.3
        }}
        filter={[
          "==", ["get", "name"], "Stairs" 
        ]}
        minZoomLevel={18}
      />

      <Mapbox.SymbolLayer
        id="poi-bathroom-layer"
        testID="poi-bathroom-layer"
        sourceID="indoor-map"
        style={{
          iconImage: require("../../../assets/images/bathrooms.png"), // Icon for Bathroom POIs
          iconSize: 0.3
        }}
        filter={[
          "==", ["get", "name"], "Bathroom" 
        ]}
        minZoomLevel={18}
      />

        <Mapbox.SymbolLayer
          id="poi-escalator-layer"
          testID="poi-escalator-layer"
          sourceID="indoor-map"
          style={{
            iconImage: require("../../../assets/images/escalator.png"), // Icon for Bathroom POIs
            iconSize: 0.3
          }}
          filter={[
            "==", ["get", "name"], "Escalators" 
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
  selectedFloor: PropTypes.number,
};

export default IndoorMap;
