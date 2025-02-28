import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import Svg, { Circle, Text as SvgText, Line } from "react-native-svg";

export default function IndoorMap() {
  const [location, setLocation] = useState(null);  // Store the location coordinates
  const [destination, setDestination] = useState(null);  // Store the destination coordinates
  const [isLocationSelected, setIsLocationSelected] = useState(false);  // Flag to track if location has been selected
  const [isDestinationSelected, setIsDestinationSelected] = useState(false);  // Flag to track if destination has been selected
  const [path, setPath] = useState(null);  // Store the calculated path (line coordinates)

  // Function to handle the user selecting their location
  const handleLocationSelect = (event) => {
    const { locationX, locationY } = event.nativeEvent;  // Get coordinates of the touch
    setLocation({ x: locationX, y: locationY });  // Store the location
    setIsLocationSelected(true);  // Set flag to true
    Alert.alert("Location Selected", "Now, click anywhere on the image to select your destination.");
  };

  // Function to handle the user selecting their destination
  const handleDestinationSelect = (event) => {
    const { locationX, locationY } = event.nativeEvent;  // Get coordinates of the touch
    setDestination({ x: locationX, y: locationY });  // Store the destination
    setIsDestinationSelected(true);  // Set flag to true
    calculateShortestPath(location, { x: locationX, y: locationY });  // Calculate the path
    Alert.alert("Destination Selected", "Your destination has been marked!");
  };

  // Function to calculate the shortest path (Manhattan distance for simplicity)
  const calculateShortestPath = (start, end) => {
    if (start && end) {
      // Calculate Manhattan distance (for grid-based pathfinding)
      const path = {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      };
      setPath(path);  // Store the calculated path
    }
  };

  // Initial prompt for location
  if (!isLocationSelected && !isDestinationSelected) {
    Alert.alert("Select Your Location", "Click anywhere on the image to select your location.");
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        This is the Indoor Map Page
      </Text>

      {/* Container for the floor plan */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Image of the floor plan with 50% opacity (half transparent) */}
        <Image
          source={require("../ScreenshotH8.png")} // Use your local image path
          style={[styles.floorPlanImage, { opacity: 0.5 }]} // Add opacity here
          resizeMode="contain" // Ensures the image scales down to fit within the available space without stretching
        />

        {/* Render SVG elements (interactive layers) over the image */}
        <TouchableOpacity 
          style={{ flex: 1, width: "100%" }}
          onPress={isLocationSelected ? handleDestinationSelect : handleLocationSelect}  // Different handlers for location and destination
        >
          {/* SVG markers and path */}
          <Svg
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Green marker for location */}
            {location && (
              <>
                <Circle cx={location.x} cy={location.y} r="10" fill="green" />
                <SvgText x={location.x + 10} y={location.y - 10} fontSize="15" fill="black">
                  Location
                </SvgText>
              </>
            )}

            {/* Yellow marker for destination */}
            {destination && (
              <>
                <Circle cx={destination.x} cy={destination.y} r="10" fill="yellow" />
                <SvgText x={destination.x + 10} y={destination.y - 10} fontSize="15" fill="black">
                  Destination
                </SvgText>
              </>
            )}

            {/* Path (Line) between location and destination */}
            {path && (
              <Line
                x1={path.x1}
                y1={path.y1}
                x2={path.x2}
                y2={path.y2}
                stroke="blue"
                strokeWidth="3"
                strokeDasharray="5,5"  // Dashed line for visual effect
              />
            )}
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the floor plan image
const styles = StyleSheet.create({
  floorPlanImage: {
    width: "100%",         // Make sure the image width doesn't exceed the container
    height: undefined,     // Let the height adjust based on the aspect ratio
    aspectRatio: 1,        // Keep the aspect ratio of the image (you can adjust this based on your image)
    position: "absolute",  // Ensure the image is on top and aligned correctly
    top: 0,
    left: 0,
  },
});
