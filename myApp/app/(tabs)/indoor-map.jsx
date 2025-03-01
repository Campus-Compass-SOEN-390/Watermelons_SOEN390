import React, { useState } from "react";
import { Text, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Svg, { Rect, Text as SvgText } from "react-native-svg"; 

MapboxGL.setAccessToken("YOUR_MAPBOX_ACCESS_TOKEN");

const IndoorMap = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [path, setPath] = useState(null);

  const handleTap = (event) => {
    if (!startLocation) {
      setStartLocation(event.geometry.coordinates);
    } else if (!endLocation) {
      setEndLocation(event.geometry.coordinates);
    }
  };

  const getRoute = async (start, end) => {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=true&geometries=geojson&access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw`;

    try {
      const response = await fetch(directionsUrl);
      const data = await response.json();
      const route = data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        properties: {},
      }));

      setPath(route);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        This is the Indoor Map Page
      </Text>

      {/* Mapbox Map */}
      <MapboxGL.MapView style={{ flex: 1 }} onPress={handleTap}>
        <MapboxGL.Camera zoomLevel={18} centerCoordinate={[-73.5673, 45.5017]} />
        
        <MapboxGL.ShapeSource id="floorPlan" url="mapbox://your-tileset-id">
          <MapboxGL.FillLayer id="floorPlanLayer" style={{ fillColor: "rgba(0, 150, 255, 0.3)" }} />
        </MapboxGL.ShapeSource>

        {path && (
          <MapboxGL.ShapeSource id="pathSource" shape={{ type: "FeatureCollection", features: path }}>
            <MapboxGL.LineLayer id="pathLayer" style={{ lineColor: "green", lineWidth: 4 }} />
          </MapboxGL.ShapeSource>
        )}

        {startLocation && (
          <MapboxGL.PointAnnotation id="startMarker" coordinate={startLocation}>
            <View style={{ backgroundColor: "green", width: 10, height: 10, borderRadius: 5 }} />
          </MapboxGL.PointAnnotation>
        )}

        {endLocation && (
          <MapboxGL.PointAnnotation id="endMarker" coordinate={endLocation}>
            <View style={{ backgroundColor: "yellow", width: 10, height: 10, borderRadius: 5 }} />
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      {/* Optional SVG Overlay */}
      <Svg width="100%" height="100%" viewBox="0 0 500 500">
        <Rect x="10" y="10" width="200" height="150" fill="lightblue" stroke="black" strokeWidth="3" />
        <SvgText x="60" y="80" fontSize="20" fill="black">Room 1</SvgText>
      </Svg>
    </View>
  );
};

export default IndoorMap;
