import React from "react";
import MapView from "../views/MapView";
import { useLocalSearchParams } from "expo-router";

export default function Map() {
  const params = useLocalSearchParams();
  return (<MapView {...params} />);
}
