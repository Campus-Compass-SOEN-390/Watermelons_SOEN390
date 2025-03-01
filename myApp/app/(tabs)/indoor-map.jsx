import React, { useEffect, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View, StyleSheet } from 'react-native';

const IndoorMap = () => {
  const tilesetId = '7anine.cm7qjtnoy2d3o1qmmngcrv0jl-1v0jt'; // Replace with actual tileset ID
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch('https://api.mapbox.com/datasets/v1/7anine/7anine.cm7qjtnoy2d3o1qmmngcrv0jl-1v0jt?access_token=pk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN28yZ3V1ejA3Mnoya3B3OHFuZWJvZ2sifQ.6SOCiju5AqaC_cBBW7eOEw')
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error('Error fetching GeoJSON:', error));
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Light}>
        <MapboxGL.Camera centerCoordinate={[-73.578, 45.495]} zoomLevel={18} />
        <MapboxGL.RasterSource id="floor-map" tileUrlTemplates={[`mapbox://tileset/${tilesetId}`]} tileSize={256}>
          <MapboxGL.RasterLayer id="floor-layer" style={{ opacity: 0.8 }} />
        </MapboxGL.RasterSource>

        {geoJsonData && (
          <MapboxGL.ShapeSource id="indoor-geojson" shape={geoJsonData}>
            <MapboxGL.FillLayer
              id="walls"
              style={{ fillColor: 'red', fillOpacity: 0.5 }}
              filter={['==', 'type', 'bloc']}
            />
            <MapboxGL.FillLayer
              id="paths"
              style={{ fillColor: 'green', fillOpacity: 0.3 }}
              filter={['!=', 'type', 'bloc']}
            />
            <MapboxGL.SymbolLayer
              id="tags"
              style={{ iconImage: 'marker-15', iconSize: 1 }}
              filter={['==', 'type', 'tag']}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default IndoorMap;
