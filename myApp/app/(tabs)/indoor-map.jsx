import React, { useState } from "react";
import { View, Text, Alert, TouchableWithoutFeedback } from "react-native";
import Svg, { Rect, Circle, Line, Text as SvgText } from "react-native-svg";

// Define obstacles (buildings) on a grid
const gridSize = 20; // Defines how small each grid cell is
const gridWidth = 25; // 500px / 20px grid
const gridHeight = 25; // 500px / 20px grid

// Buildings (Marked as obstacles)
const obstacles = new Set([
  ...generateObstacle(0, 0, 10, 7), // Room 1
  ...generateObstacle(11, 0, 20, 7), // Room 2
  ...generateObstacle(0, 12, 10, 7), // Room 3
]);

export default function IndoorMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const handleMapPress = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    // Calculate grid coordinates based on the SVG dimensions
    const gridX = Math.floor(locationX / gridSize);
    const gridY = Math.floor(locationY / gridSize);

    if (!currentLocation) {
      // First tap sets the start location
      setCurrentLocation([gridX, gridY]);
      Alert.alert("Location Selected", "Now, tap again to set the destination.");
    } else {
      // Every subsequent tap updates the destination and recalculates the path
      setDestination([gridX, gridY]);
      calculatePath(currentLocation, [gridX, gridY]);
      Alert.alert("Destination Updated", "Your new destination has been marked!");
    }

    console.log("Tapped at:", locationX, locationY, "Mapped to grid:", gridX, gridY);
  };

  // A* Pathfinding Algorithm
  function calculatePath(start, end) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = { [`${start}`]: 0 };
    const fScore = { [`${start}`]: heuristic(start, end) };

    while (openSet.length > 0) {
      // Sort by fScore to get the lowest
      openSet.sort((a, b) => fScore[`${a}`] - fScore[`${b}`]);
      const current = openSet.shift();

      if (current[0] === end[0] && current[1] === end[1]) {
        reconstructPath(cameFrom, current);
        return;
      }

      for (const neighbor of getNeighbors(current)) {
        if (obstacles.has(`${neighbor[0]},${neighbor[1]}`)) continue; // Skip obstacles

        const tentativeGScore = gScore[`${current}`] + 1;
        if (tentativeGScore < (gScore[`${neighbor}`] || Infinity)) {
          cameFrom[`${neighbor}`] = current;
          gScore[`${neighbor}`] = tentativeGScore;
          fScore[`${neighbor}`] = gScore[`${neighbor}`] + heuristic(neighbor, end);
          if (!openSet.some((n) => n[0] === neighbor[0] && n[1] === neighbor[1])) {
            openSet.push(neighbor);
          }
        }
      }
    }
    setPath([]); // No valid path found
  }

  function reconstructPath(cameFrom, current) {
    let path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.push(current);
    }
    setPath(path.reverse());
  }

  function getNeighbors([x, y]) {
    const moves = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    return moves.filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < gridWidth && ny < gridHeight);
  }

  function heuristic([x1, y1], [x2, y2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  return (
    <TouchableWithoutFeedback onPress={handleMapPress}>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>Tap on the map to set locations</Text>
        <Svg
          width="100%"
          height="80%"
          viewBox="0 0 500 500"
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSvgDimensions({ width, height });
          }}
        >
          {/* Room 1 */}
          <Rect x="10" y="10" width="200" height="150" fill="lightblue" stroke="black" strokeWidth="3" />
          <SvgText x="60" y="80" fontSize="20" fill="black">Room 1</SvgText>

          {/* Room 2 */}
          <Rect x="220" y="10" width="200" height="150" fill="lightgreen" stroke="black" strokeWidth="3" />
          <SvgText x="270" y="80" fontSize="20" fill="black">Room 2</SvgText>

          {/* Room 3 */}
          <Rect x="10" y="230" width="200" height="150" fill="lightyellow" stroke="black" strokeWidth="3" />
          <SvgText x="60" y="300" fontSize="20" fill="black">Room 3</SvgText>

          {/* Start Marker */}
          {currentLocation && (
            <Circle
              cx={currentLocation[0] * gridSize + gridSize / 2} // Center the dot in the grid cell
              cy={currentLocation[1] * gridSize + gridSize / 2} // Center the dot in the grid cell
              r="8"
              fill="green"
            />
          )}

          {/* Destination Marker */}
          {destination && (
            <Circle
              cx={destination[0] * gridSize + gridSize / 2} // Center the dot in the grid cell
              cy={destination[1] * gridSize + gridSize / 2} // Center the dot in the grid cell
              r="8"
              fill="yellow"
            />
          )}

          {/* Path Lines */}
          {path.map((point, index) => (
            index > 0 && (
              <Line
                key={index}
                x1={path[index - 1][0] * gridSize + gridSize / 2} // Center the line
                y1={path[index - 1][1] * gridSize + gridSize / 2} // Center the line
                x2={point[0] * gridSize + gridSize / 2} // Center the line
                y2={point[1] * gridSize + gridSize / 2} // Center the line
                stroke="red"
                strokeWidth="3"
              />
            )
          ))}
        </Svg>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Helper function to generate obstacle coordinates
function generateObstacle(x, y, width, height) {
  const coords = [];
  for (let i = x; i < x + width; i++) {
    for (let j = y; j < y + height; j++) {
      coords.push(`${i},${j}`);
    }
  }
  return coords;
}