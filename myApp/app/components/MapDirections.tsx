import React, { useEffect, useState, useRef } from "react";
import Mapbox from "@rnmapbox/maps";
import { View, Button } from "react-native";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";
import { useLocationContext } from "../context/LocationContext";
import { getAlternativeRoutes } from "../api/googleMapsApi";

// const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapbox;
const MAPBOX_API_KEY = "sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw";
Mapbox.setAccessToken(MAPBOX_API_KEY);
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.apiKey;

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
  const { selectedRouteIndex } = useLocationContext(); 
  //stores all routes rather than just 1
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection[]>([]);
  //To be used when options of routes are added
  const cameraRef = useRef<Mapbox.Camera | null>(null);

  const prevOriginRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const prevDestinationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const prevTravelModeRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (!origin || !destination) return;
    
      try {
        console.log("Fetching alternative routes...");
        const alternativeRoutes = await getAlternativeRoutes(origin, destination, [travelMode || "walking"]);
    
        if (!isMounted) return;
    
        // Check if alternativeRoutes is an array
        if (Array.isArray(alternativeRoutes)) {
          // Extract the first mode's routes (assuming one mode at a time for now)
          const selectedModeRoutes = alternativeRoutes
            .filter((r) => r.mode === travelMode)
            .flatMap((r) => r.routes) || [];
    
          if (selectedModeRoutes.length > 0) {
            setRoutes(parseAlternativeRoutes(selectedModeRoutes));
          } else {
            console.warn("No alternative routes found.");
            setRoutes([]);
          }
        } else {
          console.error("Unexpected response structure:", alternativeRoutes);
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error fetching alternative routes:", error);
      }
    };
    
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [travelMode, origin, destination]);

  useEffect(() => {
    if (routes.length > 0 && routes[selectedRouteIndex]) {
      const coordinates = (routes[selectedRouteIndex].features[0].geometry as GeoJSON.LineString).coordinates;
      fitToRoute(coordinates);
    }
  }, [selectedRouteIndex, routes]);

  const fitToRoute = (coordinates: number[][]) => {
    if (cameraRef.current && coordinates.length > 1) {
      const lats = coordinates.map((coord) => coord[1]);
      const lngs = coordinates.map((coord) => coord[0]);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const zoom = Math.max(10, 15 - Math.max(latDiff, lngDiff) * 50);

      cameraRef.current.setCamera({
        centerCoordinate: center,
        zoomLevel: zoom,
        animationDuration: 1000,
      });
    }
  };

  const parseAlternativeRoutes = (routes: any[]): GeoJSON.FeatureCollection[] => {
    return routes.map((route) => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route.coordinates,
          },
          properties: {
            duration: route.duration,
            distance: route.distance,
            summary: route.summary,
          },
        },
      ],
    }));
  };
  

  if (!origin || !destination || routes.length === 0) return null;

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.Camera ref={cameraRef} />
      
      {/*Render all route options, alternatives are displayed more transparently*/}
      {routes.map((routeData, index) => (
        <Mapbox.ShapeSource key={`route-${index}`} id={`routeSource-${index}`} shape={routeData}>
          <Mapbox.LineLayer
            id={`routeLine-${index}`}
            style={{
              lineColor: index === selectedRouteIndex ? "black" : "gray",
              lineWidth: index === selectedRouteIndex ? 5 : 3,
              lineOpacity: index === selectedRouteIndex ? 1 : 0.5,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </Mapbox.ShapeSource>
      ))}
    </View>
  );
};

export default MapDirections;
