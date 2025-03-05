import React, { useEffect, useState, useRef } from "react";
import Mapbox from "@rnmapbox/maps";
import { View } from "react-native";
import Constants from "expo-constants";

const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API_KEY);

console.log("🚀 MAPBOX API KEY:", MAPBOX_API_KEY);
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
  travelMode,
}) => {
  const [route, setRoute] = useState<GeoJSON.FeatureCollection | null>(null);
  const cameraRef = useRef<Mapbox.Camera | null>(null);

  useEffect(() => {
    try{
      let isMounted = true;

      if (origin && destination && travelMode) {
        fetchRoute(travelMode, isMounted);
      }

      return () => {
        isMounted = false;
        console.log("🧹 Cleaning up...");
      };
    }
    catch{
      console.log("Crashed 7")
    }
  },[travelMode, origin, destination]);

  const fetchRoute = async (mode: string, isMounted: boolean) => {
    if (!origin || !destination) return;

    let apiMode = mode.toLowerCase(); // Ensure mode is in the correct format
    console.log(`🚀 Fetching route with mode: ${apiMode}`);

    let url = `https://api.mapbox.com/directions/v5/mapbox/${apiMode}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&steps=true&access_token=${MAPBOX_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!isMounted) return; // Prevent state update if unmounted

      if (data.routes && data.routes.length > 0) {
        const geometry = data.routes[0].geometry;
        if (geometry && geometry.coordinates && geometry.coordinates.length > 0) {
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
        } else {
          console.error("❌ Invalid geometry received:", geometry);
        }
      } else {
        console.warn(`🚨 No route found for mode: ${apiMode}.`);
        // Optionally handle fallback here or notify user
      }
    } catch (error) {
      console.error("❌ Error fetching route:", error);
      // Optionally handle errors more gracefully here
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
  if (!origin || !destination || !route) return null;

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.Camera ref={(ref) => (cameraRef.current = ref)} />
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