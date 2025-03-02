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
      "https://api.mapbox.com/datasets/v1/7anine/7anine.cm7qjtnoy2d3o1qmmngcrv0jl-1v0jt/features?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched GeoJSON Data:", JSON.stringify(data, null, 2)); // Debugging
        setGeoJsonData({ type: "FeatureCollection", features: data.features });
      })
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Light}>
        <Mapbox.Camera centerCoordinate={[-73.578, 45.495]} zoomLevel={12} />
        <Mapbox.RasterSource
          id="floor-map"
          tileUrlTemplates={[
            `https://api.mapbox.com/v4/7anine.cm7qjtnoy2d3o1qmmngcrv0jl-1v0jt/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw`,
          ]}
          tileSize={256}
        >
          <Mapbox.RasterLayer id="floor-layer" />
        </Mapbox.RasterSource>

        {geoJsonData?.type === "FeatureCollection" &&
          Array.isArray(geoJsonData.features) && (
            <Mapbox.ShapeSource id="indoor-geojson" shape={geoJsonData}>
              <Mapbox.FillLayer
                id="walls"
                style={{ fillColor: "red", fillOpacity: 0.5 }}
                filter={["==", "type", "bloc"]}
              />
              <Mapbox.FillLayer
                id="paths"
                style={{ fillColor: "green", fillOpacity: 0.3 }}
                filter={["!=", "type", "bloc"]}
              />
              <Mapbox.SymbolLayer
                id="tags"
                style={{ iconImage: "marker-15", iconSize: 1 }}
                filter={["==", "type", "tag"]}
              />
            </Mapbox.ShapeSource>
          )}
      </Mapbox.MapView>
    </View>
  );
};
};

export default IndoorMap;
export default IndoorMap;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full screen
  },
  map: {
    flex: 1, // Ensures MapView expands properly
  },
});

