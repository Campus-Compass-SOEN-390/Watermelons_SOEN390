import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
//import OutdoorMap from "../(tabs)/outdoor-map";
import styles from "../styles/OutdoorMapStyles"; 
import { useLocalSearchParams } from "expo-router";

const OutdoorMapSwitcher = () => {
  const params = useLocalSearchParams();
  // State to track current campus; default based on params, for example.
  const [isSGW, setIsSGW] = useState(params.campus === "SGW");

  // Function to handle campus switch
  const handleSwitchCampus = () => {
    setIsSGW((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.titleForMap}>
        Current Campus: {isSGW ? "SGW" : "Loyola"}
      </Text>
      {/* Render the unified OutdoorMap, passing the campus prop */}
      {/*<OutdoorMap campus={isSGW ? "SGW" : "LOY"} />*/}

      <View style={styles.switchButtonContainer}>
        <TouchableOpacity style={styles.switchButton} onPress={handleSwitchCampus}>
          <Text style={styles.switchButtonText}>Switch Campus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutdoorMapSwitcher;
