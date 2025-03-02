import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken('pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw');

const IndoorMap = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Title</Text>
      <Mapbox.MapView style={styles.map} />
    </View>
  );
};

export default IndoorMap;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1, // Map takes the rest of the space
  },
});
