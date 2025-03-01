import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MapProvider, useMapContext } from '../contexts/MapContext';
import SharedMap from '../components/SharedMap';
import InterestPointsUI from '../components/InterestPointsUI';
import InterestPointsList from '../components/InterestPointsList';
import styles from '../styles/InterestPointsStyles';

// --- Custom Marker for OutdoorMap (Placeholder) ---
const ParkMarker = () => (
  <View style={{ backgroundColor: "white", padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="tree" size={24} color="green" />
  </View>
);

// --- InterestPoints Component ---
const InterestPoints = () => {
  const isListView = false;

  return (
    <MapProvider>
      <View style={styles.container}>
        {isListView ? <InterestPointsList /> : <SharedMap />}
        <InterestPointsUI />
      </View>
    </MapProvider>
  );
};

export default InterestPoints;