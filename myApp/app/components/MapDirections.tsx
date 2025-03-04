import React, { useEffect, useState, useRef } from "react";
import Mapbox from "@rnmapbox/maps";
import { View } from "react-native";
import Constants from "expo-constants";

//const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapbox;
const MAPBOX_API_KEY = "sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw";
Mapbox.setAccessToken(MAPBOX_API_KEY);

console.log("MAPBOX API KEY:", MAPBOX_API_KEY);
if (!MAPBOX_API_KEY) {
  console.error("❌ ERROR: Missing Mapbox API Key!");
}

interface Props {
  origin: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<Mapbox.MapView>;
  travelMode?: "driving" | "cycling" | "walking" | "transit";
}

const MapDirections: React.FC<Props> = ({
  origin,
  destination,
  mapRef,
  travelMode = "driving",
}) => {
  const [route, setRoute] = useState<GeoJSON.FeatureCollection | null>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);

  useEffect(() => {
    if (origin && destination) {
      fetchRoute(travelMode);
    }
  }, [origin, destination, travelMode]);

  const fetchRoute = async (mode: string) => {
    if (!origin || !destination) return;

    let apiMode = mode;
    console.log(`🚀 Fetching route with mode: ${apiMode}`);
    console.log("Origin:", origin);
    console.log("Destination:", destination);

    let url = `https://api.mapbox.com/directions/v5/mapbox/${apiMode}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;

    console.log("Request URL:", url);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        console.warn(`🚨 No route found for mode: ${apiMode}. Response:`, data);
        if (mode !== "walking") {
          console.log("⏳ Falling back to walking mode...");
          await fetchRoute("walking");
        }
        return;
      }

      const geometry = data.routes[0].geometry;
      if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) {
        console.error("❌ Invalid geometry received:", geometry);
        return;
      }

      setRoute({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: geometry,
            properties: {},
          },
        ],
      });

      fitToRoute(geometry.coordinates);
    } catch (error) {
      console.error("❌ Error fetching route:", error);
    }
  };

  const fitToRoute = (coordinates: number[][]) => {
    if (cameraRef.current && coordinates.length > 1) {
      const lats = coordinates.map((coord) => coord[1]);
      const lngs = coordinates.map((coord) => coord[0]);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

      cameraRef.current.setCamera({
        centerCoordinate: center,
        zoomLevel: 12,
        animationDuration: 1000,
      });
    }
  };

  if (!origin || !destination || !route) return null;

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.Camera ref={cameraRef} />
      <Mapbox.ShapeSource id="routeSource" shape={route}>
        <Mapbox.LineLayer
          id="routeLine"
          style={{
            lineColor: "black",
            lineWidth: 5,
          }}
        />
      </Mapbox.ShapeSource>
    </View>
  );
};

export default MapDirections;
