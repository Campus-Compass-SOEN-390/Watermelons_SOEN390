import React, { useState, useEffect } from "react";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import PropTypes from "prop-types";
import finalMapData from "../../../assets/floorplans/finalMap.json";
import styles from "../../styles/IndoorMapStyles";
import POILayer from "./POILayerComponent";

const IndoorMap = ({ selectedBuilding, selectedFloor, mapKey }) => {
  const [geoJsonData, setGeoJsonData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    Mapbox.setAccessToken(Constants.expoConfig?.extra?.mapbox);
    setGeoJsonData(finalMapData);
  }, []);

  if (!geoJsonData.features.length) {
    return null; // Return null instead of an empty source
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
    <Mapbox.ShapeSource
      id="indoor-map"
      testID="indoor-map"
      shape={filteredGeoJson}
    >
      {/* Room Fill Layer */}
      <Mapbox.FillLayer
        id="room-fill-layer"
        testID="room-fill-layer"
        sourceID="indoor-map"
        style={styles.fillLayer}
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
        style={styles.roomLayer}
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
        style={styles.linePath}
        filter={["any", ["==", ["get", "type"], "Paths"]]}
        minZoomLevel={18}
      />

      {/* Walls */}
      <Mapbox.LineLayer
        id="wall-line-layer"
        testID="wall-line-layer"
        sourceID="indoor-map"
        style={styles.lineWall}
        filter={["any", ["==", ["get", "type"], "Walls"]]}
        minZoomLevel={18}
      />

      {/* Labels for Doors */}
      <Mapbox.SymbolLayer
        id="door-text-layer"
        testID="door-text-layer"
        sourceID="indoor-map"
        style={styles.labelPOIText}
        filter={[
          "any",
          ["==", ["get", "type"], "Door"],
          ["==", ["get", "type"], "Doors"],
        ]}
        minZoomLevel={18}
      />

      {/* Labels for POIs - pass unique keys using mapKey */}
      <POILayer
        key={`elevator-${mapKey}`}
        id="poi-elevator-layer"
        image={require("../../../assets/images/elevator.png")}
        name="Elevator"
        testID="poi-elevator-layer"
      />
      <POILayer
        key={`stairs-${mapKey}`}
        id="poi-stairs-layer"
        image={require("../../../assets/images/stairs.png")}
        name="Stairs"
        testID="poi-stairs-layer"
      />
      <POILayer
        key={`escalator-${mapKey}`}
        id="poi-escalator-layer"
        image={require("../../../assets/images/escalator.png")}
        name="Escalators"
        testID="poi-escalator-layer"
      />
      <POILayer
        key={`bathroom-${mapKey}`}
        id="poi-bathroom-layer"
        image={require("../../../assets/images/bathrooms.png")}
        name="Bathroom"
        testID="poi-bathroom-layer"
      />
    </Mapbox.ShapeSource>
  );
};

IndoorMap.propTypes = {
  selectedBuilding: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  selectedFloor: PropTypes.number,
  mapKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default IndoorMap;
