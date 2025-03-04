import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import styles from "../styles/IndoorMapStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Mapbox from '@rnmapbox/maps';
import Constants from "expo-constants";


const MAPBOX_API = Constants.expoConfig?.extra?.mapbox;
Mapbox.setAccessToken(MAPBOX_API);

export default function IndoorMap() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Indoor Map */}
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Light} >
          <Mapbox.Camera centerCoordinate={[-73.578, 45.495]} zoomLevel={12} />
        </Mapbox.MapView>
      </View>
      {/* Floor Navigation Buttons */}
      <View style={styles.floorButtonContainer}>
        <TouchableOpacity 
          style={styles.button}
          testID="floor-up"
        >
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.text}>1</Text>
        <TouchableOpacity 
          style={styles.button}
          testID="floor-down"
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Buildings Navigation Button */}
      <View
        style={[
          styles.buildingsContainer,
          isExpanded && styles.expandedBuildingsContainer,
        ]}
      >
        {/* Location-City Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsExpanded(!isExpanded)}
          testID="buildings-button"
        >
          <MaterialIcons name="location-city" size={24} color="black" />
        </TouchableOpacity>

        {/* Expanded Buttons */}
        {isExpanded && (
          <View style={styles.expandedButtonsContainer}>
            <TouchableOpacity style={styles.expandedButton}>
              <Text style={styles.text}>Building A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expandedButton}>
              <Text style={styles.text}>Building B</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expandedButton}>
              <Text style={styles.text}>Building C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.expandedButton}>
              <Text style={styles.text}>Building D</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Switch Campus Button */}
      <View style={styles.switchCampusButton}>
        <TouchableOpacity
          disabled={isExpanded}
          style={isExpanded ? styles.disabledButton : null}
        >
          <Text style={styles.text}>Switch Campus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
