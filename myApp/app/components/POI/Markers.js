// src/components/Markers.js
import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Custom marker components
const CoffeeMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="coffee" size={24} color="black" />
  </View>
);

const RestaurantMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="orange" />
  </View>
);

const ActivityMarker = () => (
  <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 5 }}>
    <MaterialCommunityIcons name="run" size={20} color="green" />
  </View>
);

export { CoffeeMarker, RestaurantMarker, ActivityMarker };