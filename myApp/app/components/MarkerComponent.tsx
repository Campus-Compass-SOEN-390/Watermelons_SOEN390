import React from "react";
import Mapbox from "@rnmapbox/maps";

interface MarkerProps {
  id: string;
  coordinate: [number, number];
  icon: any;
  size?: number;
}

export const MapboxMarker: React.FC<MarkerProps> = ({ id, coordinate, icon, size = 0.1 }) => {
  return (
    <Mapbox.ShapeSource
      id={id}
      shape={{
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinate,
        },
        properties: {},
      }}
    >
      <Mapbox.SymbolLayer
        id={id}
        style={{
          iconImage: icon,
          iconSize: size,
          iconAllowOverlap: true,
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default MapboxMarker;
