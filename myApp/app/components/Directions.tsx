import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import buildings from "../api/buildingData";
import Mapbox from "@rnmapbox/maps";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";
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

    const getBuildingCode = (room: string) => {
        const match = room.match(/^[A-Za-z]+/);
        return match ? match[0] : null;
      };
    
    const buildingCoordinates: Record<string, { latitude: number; longitude: number }> = {
        "VL": { latitude: 45.459026, longitude: -73.638606 }, // Vanier Library
        "H": { latitude: 45.497092, longitude: -73.578800 }, // Hall Building
        "EV": { latitude: 45.495376, longitude: -73.577997}, // Engineering and Visual Arts
        "MB": { latitude: 45.495304, longitude: -73.579044 },  // John Molson Building
        "CC": {latitude: 45.458422, longitude: -73.640747}
    };
    
    {/*const findSetNode = (nodeText: string) => {
        const buildingCode = getBuildingCode(nodeText)
        if (buildingCode == "H"){
            return "Hall-principal-entrance"
        }
        if (buildingCode == "MB"){
            return "MB1-entrance"
        }
        if (buildingCode == "CC"){
            return "CC1-entrance"
        }
    }

    const findEntrance = (nodeText: string) => {
        const buildingCode = getBuildingCode(nodeText)
        if (buildingCode == "H"){
            return buildingCoordinates["H"];
        }
        if (buildingCode == "MB"){
            return buildingCoordinates["MB"];
        }
        if (buildingCode == "CC"){
            return buildingCoordinates["CC"];
        }
        return null;
    }*/}

    const findBuildingInfo = (nodeText: string): { setNode: string | null; entranceOrExit: { latitude: number; longitude: number } | null } => {
        const buildingCode = getBuildingCode(nodeText);
    
        if (!buildingCode) return { setNode: null, entranceOrExit: null }; // Return null values if no valid building code is found
    
        const setNodeMap: Record<string, string> = {
            "H": "Hall-principal-entrance",
            "MB": "MB1-entrance",
            "CC": "CC1-entrance",
        };
    
        return {
            setNode: setNodeMap[buildingCode] || null,
            entranceOrExit: buildingCoordinates[buildingCode] || null,
        };
    };
    

    console.log("Hey chat, we got:", navType)
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
        //const newEndNode = findSetNode(startNode);
        const { setNode: newEndNode } = findBuildingInfo(startNode);
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
                    origin={origin}
                    destination={destination}
                    mapRef={mapRef}
                    travelMode={travelMode}
                />
            </View>
        )
    }
    if (navType == "outdoor-indoor"){
        //const newStartNode = findSetNode(endNode);
        //const entrance = findEntrance(endNode);
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
        //const newEndNode = findSetNode(startNode);
        //const newStartNode = findSetNode(endNode);
        const { setNode: newEndNode, entranceOrExit: start} = findBuildingInfo(startNode);
        const { setNode: newStartNode, entranceOrExit: end} = findBuildingInfo(endNode);
        console.log("newEndNode, start:", newEndNode, start);
        console.log("newStartNode, end:", newStartNode, end);
        console.log("currentFloor", currentFloor);
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
                    endNode={newEndNode}
                    currentFloor={Number(currentFloor)}
                    isDisabled={isDisabled}
                    pathId={"indoor1"}
                />
                <ShortestPathMap
                    graph={graph}
                    nodeCoordinates={nodeCoordinates}
                    startNode={newStartNode}
                    endNode={endNode}
                    currentFloor={Number(currentFloor)}
                    isDisabled={isDisabled}
                    pathId={"indoor2"}
                />
            </View>
        )
    }
}