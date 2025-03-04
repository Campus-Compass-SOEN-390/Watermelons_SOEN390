import React from "react";
import MapView from "react-native-maps";
import styles from "../../styles/UnifiedMapStyles";

const MapContainer = ({ mapRef, region, setRegion, showLocating, children }) => {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      region={region}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      showsUserLocation={true}
      showsPointsOfInterest={false}
      showsBuildings={false}
    >
      {children}
    </MapView>
  );
};

export default MapContainer;
