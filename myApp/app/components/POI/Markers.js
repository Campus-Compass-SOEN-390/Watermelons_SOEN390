// src/components/Markers.js
import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/InterestPointsStyles";

export const CoffeeMarker = () => (
  <MaterialCommunityIcons name="coffee" size={24} color="black" />
);

export const RestaurantMarker = () => (
  <MaterialCommunityIcons
    name="silverware-fork-knife"
    size={24}
    color="orange"
  />
);

export const ActivityMarker = () => (
  <MaterialCommunityIcons name="run" size={20} color="green" />
);
