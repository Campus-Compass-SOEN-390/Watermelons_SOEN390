import React from 'react';
import { View } from 'react-native';
import { MapProvider } from '../contexts/MapContext';
import SharedMap from '../components/SharedMap';
import OutdoorMapUI from '../components/OutdoorMapUI';
import StartAndDestinationPoints from '../components/StartAndDestinationPoints';
import styles from '../styles/OutdoorMapStyles';

const OutdoorMap = () => {
  return (
    <MapProvider>
      <View style={styles.container}>
        <StartAndDestinationPoints />
        <SharedMap />
        <OutdoorMapUI />
      </View>
    </MapProvider>
  );
};

export default OutdoorMap;