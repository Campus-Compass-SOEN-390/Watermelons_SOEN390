import React, { useEffect } from "react";
import { View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import ShortestPathMap from "./IndoorMap/ShortestPathMap";
import MapDirections from "./MapDirections";

interface Props {
  graph: any;
  nodeCoordinates: any;
  startNode: any;
  endNode: any;
  currentFloor: number ;
  isDisabled: boolean;
  origin: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<Mapbox.MapView>;
  travelMode?: "driving" | "cycling" | "walking" | "transit";
  navType?: "indoor" | "outdoor" | "indoor-outdoor" | "outdoor-indoor" | "indoor-outdoor-indoor";
}

export const Directions : React.FC<Props> = ({
  graph,
  nodeCoordinates, 
  startNode, 
  endNode,
  currentFloor,
  isDisabled,
  origin,
  destination,
  mapRef,
  travelMode,
  navType
}) => {

    useEffect(() => {

      }, [travelMode]);
      
    const getBuildingCode = (room: string) => {
        const match = room.match(/^[A-Za-z]+/);
        return match ? match[0] : null;
      };
    
    const buildingCoordinates: Record<string, { latitude: number; longitude: number }> = {
        "VL": { latitude: 45.459026, longitude: -73.638606 },
        "H": { latitude: 45.497092, longitude: -73.578800 },
        "EV": { latitude: 45.495376, longitude: -73.577997},
        "MB": { latitude: 45.495304, longitude: -73.579044 },
        "CC": {latitude: 45.458422, longitude: -73.640747}
    };

    const findBuildingInfo = (nodeText: string): { setNode: string | null; entranceOrExit: { latitude: number; longitude: number } | null } => {
        const buildingCode = getBuildingCode(nodeText);
    
        if (!buildingCode) return { setNode: null, entranceOrExit: null }; // Return null values if no valid building code is found
    
        const setNodeMap: Record<string, string> = {
            "H": "Hall1-principal-entrance",
            "MB": "MB1-entrance",
            "CC": "CC1-entrance",
        };
    
        return {
            setNode: setNodeMap[buildingCode] || null,
            entranceOrExit: buildingCoordinates[buildingCode] || null,
        };
    };
    
    console.log("Navigation type,", navType)
    if (navType == "indoor"){
        return (
        <ShortestPathMap
            graph={graph}
            nodeCoordinates={nodeCoordinates}
            startNode={startNode}
            endNode={endNode}
            currentFloor={Number(currentFloor)}
            isDisabled={isDisabled}
            pathId={"indoor"}
        />
        )
    }
    if (navType == "outdoor"){
        return (
            <MapDirections
                origin={origin}
                destination={destination}
                mapRef={mapRef}
                travelMode={travelMode}
            />
        );
    }
    if (navType == "indoor-outdoor"){
        const { setNode: newEndNode, entranceOrExit: start } = findBuildingInfo(startNode);
        console.log("This is the new end node", newEndNode);
        return (
            <View>
                <ShortestPathMap
                    graph={graph}
                    nodeCoordinates={nodeCoordinates}
                    startNode={startNode}
                    endNode={newEndNode}
                    currentFloor={Number(currentFloor)}
                    isDisabled={isDisabled}
                    pathId={"indoor"}
                />
                <MapDirections
                    origin={start}
                    destination={destination}
                    mapRef={mapRef}
                    travelMode={travelMode}
                />
            </View>
        )
    }
    if (navType == "outdoor-indoor"){
        const { setNode: newStartNode, entranceOrExit: entrance } = findBuildingInfo(endNode);
        console.log("This is the new start node", newStartNode);
        return (
            <View>
                <MapDirections
                    origin={origin}
                    destination={entrance}
                    mapRef={mapRef}
                    travelMode={travelMode}
                />
                <ShortestPathMap
                    graph={graph}
                    nodeCoordinates={nodeCoordinates}
                    startNode={newStartNode}
                    endNode={endNode}
                    currentFloor={Number(currentFloor)}
                    isDisabled={isDisabled}
                    pathId={"indoor"}
                />
            </View>
        )
    }
    if (navType == "indoor-outdoor-indoor"){
        const { entranceOrExit: start} = findBuildingInfo(startNode);
        const { entranceOrExit: end} = findBuildingInfo(endNode);
        return (
            <View>
                <MapDirections
                    origin={start}
                    destination={end}
                    mapRef={mapRef}
                    travelMode={travelMode}
                />
                <ShortestPathMap
                    graph={graph}
                    nodeCoordinates={nodeCoordinates}
                    startNode={startNode}
                    endNode={endNode}
                    currentFloor={Number(currentFloor)}
                    isDisabled={isDisabled}
                    pathId={"indoor1"}
                />
            </View>
        )
    }
}