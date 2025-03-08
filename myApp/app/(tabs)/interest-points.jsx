import React, { useState, useRef } from "react";
import { View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import POIOverlay from "../components/POI/POIOverlay";

const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);

export default function SimpleMap() {
  const mapRef = useRef(null);

  // Define the initial region for the map
  const initialRegion = {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Manage region state; this can be updated by the POIOverlay as needed.
  const [region, setRegion] = useState(initialRegion);

  // For demonstration purposes, we set the location to the same as the initial region center.
  // In a production app, you would integrate a hook or service to get the actual location.
  const location = {
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  };

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView style={{ flex: 1 }} styleURL={Mapbox.StyleURL.Light}>
        <Mapbox.Camera
          ref={mapRef}
          centerCoordinate={[initialRegion.longitude, initialRegion.latitude]}
          zoomLevel={15}
          animationMode="flyTo"
          animationDuration={1000}
        />
        <POIOverlay
          mapRef={mapRef}
          location={location}
          region={region}
          setRegion={setRegion}
        />
      </Mapbox.MapView>
    </View>
  );
}
