import React, { useEffect, useState, useRef } from "react";
import Mapbox from "@rnmapbox/maps";
import { View, Button } from "react-native";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";

const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapbox;
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
  //stores all routes rather than just 1
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection[]>([]);
  //To be used when options of routes are added
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const cameraRef = useRef<Mapbox.Camera | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (origin && destination && travelMode) {
          await fetchRoutes(travelMode, isMounted);
        }
      } catch (error) {
        console.log("Error in fetchData:", error);
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

  const fetchRoutes = async (mode: string, isMounted: boolean) => {
    if (!origin || !destination) return;

    console.log(`Fetching routes from Google Maps with mode: ${mode}`);

    //By setting alternatives to true in url, now get all routes rather than just 1
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&alternatives=true&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Google Maps API Response:", JSON.stringify(data, null, 2));
      if (!isMounted) return;
      if (data.routes && data.routes.length > 0) {
        //iterate and store all route options
        const routeOptions: GeoJSON.FeatureCollection[] = data.routes.map((route: any) => {
          const encodedPolyline = route.overview_polyline.points;
          const decodedCoordinates = polyline.decode(encodedPolyline);
          const geoJsonCoordinates = decodedCoordinates.map(([lat, lng]) => [lng, lat]);
          return {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: geoJsonCoordinates,
                },
                properties: {},
              },
            ],
          };
        });
        setRoutes(routeOptions);
      } else {
        console.warn("No routes found in Google Maps API response.");
      }
    } catch (error) {
      console.error("Error fetching Google Maps routes:", error);
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
