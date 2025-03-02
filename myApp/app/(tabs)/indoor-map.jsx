import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw"
);

const IndoorMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.mapbox.com/datasets/v1/7anine/cm7qjtnoy2d3o1qmmngcrv0jl/features?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched GeoJSON Data:", JSON.stringify(data, null, 2));
        if (data.features) {
          setGeoJsonData({
            type: "FeatureCollection",
            features: data.features,
          });
        } else {
          console.error("Invalid GeoJSON format:", data);
        }
      })
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Light}>
        <Mapbox.Camera centerCoordinate={[-73.578, 45.495]} zoomLevel={18} />

        {/* Render dataset (vector data) */}
        {geoJsonData?.type === "FeatureCollection" && (
          <Mapbox.ShapeSource id="indoor-geojson" shape={geoJsonData}>
            {/* Render Walls (Polygons) */}
            <Mapbox.FillLayer
              id="walls"
              style={{ fillColor: "gray", fillOpacity: 0.7 }}
              filter={["==", ["geometry-type"], "Polygon"]}
            />

            {/* Render Paths (Lines) */}
            <Mapbox.LineLayer
              id="paths"
              style={{ lineColor: "blue", lineWidth: 2 }}
              filter={["==", ["geometry-type"], "LineString"]}
            />

            {/* Render Labels (Points) */}
            <Mapbox.SymbolLayer
              id="labels"
              style={{
                textField: ["get", "name"],
                textSize: 14,
                textColor: "black",
              }}
              filter={["==", ["geometry-type"], "Point"]}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>
    </View>
  );
};

export default IndoorMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
