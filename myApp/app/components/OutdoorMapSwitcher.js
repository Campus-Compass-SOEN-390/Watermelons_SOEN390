import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SGWOutdoorMap from "./SGWOutdoorMap";
import LoyolaOutdoorMap from "./LoyolaOutdoorMap";
import styles from "../styles/OutdoorMapStyles"; 
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';


const OutdoorMapSwitcher = () => {
  
  const params = useLocalSearchParams();

  // State to track the current campus
  const [isSGW, setIsSGW] = useState(params.campus === "SGW");



  // Function to handle campus switch
  const handleSwitchCampus = () => {
    setIsSGW((prev) => !prev);
  };
  

 
  return (
    <View style={{ flex: 1 }}>
      
      {/* Title to display the current campus */}
      <Text style={styles.titleForMap}>
      Current Campus: {isSGW ? "SGW" : "Loyola"}
      </Text>
      

      {isSGW ? <SGWOutdoorMap /> : <LoyolaOutdoorMap />}

  

      <View style={styles.switchButtonContainer}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleSwitchCampus}
        >
          <Text style={styles.switchButtonText}>Switch Campus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutdoorMapSwitcher;