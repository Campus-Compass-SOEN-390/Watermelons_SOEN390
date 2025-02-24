import React, { useEffect } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, Region } from 'react-native-maps';
import Constants from "expo-constants"

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.apiKey;

interface Props {
  origin: Region;
  destination: Region;
  mapRef: React.RefObject<MapView>;
  travelMode?: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT';
}

const edgePaddingValue = 10;
const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue
}
const MapDirections: React.FC<Props> = ({ origin, destination, mapRef, travelMode = 'TRANSIT' }) => {
  useEffect(() => {
    if (origin && destination && mapRef.current) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: edgePadding,
        animated: true,
      });
    }
  }, [origin, destination, mapRef]);

  if (!origin || !destination) return null;

  return (
    <MapViewDirections
      origin={origin}
      destination={destination}
      apikey={GOOGLE_MAPS_API_KEY}
      strokeWidth={5}
      strokeColor="black"
      mode={travelMode}
    />
  );
};

export default MapDirections;
