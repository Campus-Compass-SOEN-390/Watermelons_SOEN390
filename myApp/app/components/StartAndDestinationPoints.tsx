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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/StartAndDestinationPointsStyles";
import useLocation from "../hooks/useLocation";
import Icon from "react-native-vector-icons/Foundation";
import { useLocationContext } from "../context/LocationContext";
import { useIndoorMapContext } from "../context/IndoorMapContext";
import { parseClassroomLocation } from "../utils/IndoorMapUtils";
import { buildings } from "../api/buildingData";
import { getTravelTimes } from "../api/googleMapsApi";

interface Step {
  id: number;
  distance: string;
  instruction: string;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const StartAndDestinationPoints = () => {
  const {
    updateOrigin,
    updateDestination,
    updateShowTransportation,
    updateRenderMap,
    updateTravelMode,
    updateNavType,
    origin,
    destination,
    originText,
    destinationText,
    showTransportation,
    renderMap,
    travelMode,
    navType
  } = useLocationContext();
  const { selectedFloor, updateSelectedFloor, updateSelectedIndoorBuilding } =
    useIndoorMapContext();
  const { location } = useLocation();
  const originRef = useRef<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showMyLocButton, setShowMyLocButton] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [routeSteps, setRouteSteps] = useState<Step[]>([]);
  const [travelTimes, setTravelTimes] = useState<{
    [key: string]: number | null;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleNavType = (originText: string, destinationText: string) => {
    console.log("yo broski");
    if (!originText || !destinationText){
      console.log("Hey, youre done");
      return "";
    }
    const originBuilding = getBuildingCode(originText);
    const destinationBuilding = getBuildingCode(destinationText)
    console.log("originbuilding is", originBuilding);
    console.log("destinationbuilding is", destinationBuilding);
    console.log("buildingCoordinates");
    // Navigation type is indoor, same building navigation
    if (originBuilding == destinationBuilding && buildingCoordinates[String(originBuilding)] && buildingCoordinates[String(destinationBuilding)] ){
      updateNavType("indoor");
    }
    // indoor to outdoor navigation
    else if (originBuilding && buildingCoordinates[String(originBuilding)] && !buildingCoordinates[String(destinationBuilding)]){
      updateNavType("indoor-outdoor");
    }
    else if (destinationBuilding && buildingCoordinates[String(destinationBuilding)] && !buildingCoordinates[String(originBuilding)]){
      updateNavType("outdoor-indoor");
    }
    else if (originBuilding && destinationBuilding && buildingCoordinates[String(originBuilding)] && buildingCoordinates[String(destinationBuilding)] && (destinationBuilding != originBuilding)){
      updateNavType("indoor-outdoor-indoor");
    }
    else{
      updateNavType("outdoor")
    }

    console.log("we got this:", navType);
  }

  const getBuildingCode = (room: string) => {
    const match = room.match(/^[A-Za-z]+/);
    return match ? match[0] : null;
  };

  const buildingCoordinates: Record<string, { latitude: number; longitude: number }> = {
    "VL": { latitude: 45.459026, longitude: -73.638606 }, // Vanier Library
    "H": { latitude: 45.497092, longitude: -73.578800 }, // Hall Building
    "EV": { latitude: 45.495376, longitude: -73.577997}, // Engineering and Visual Arts
    "MB": { latitude: 45.495304, longitude: -73.579044 },  // John Molson Building
    "CC": { latitude: 45.458422, longitude: -73.640747 }
  };

  const handleDestinationInput = (text: string) => {
    const buildingCode = getBuildingCode(text);
    
    if (buildingCode && buildingCoordinates[buildingCode]) {
    const coords = buildingCoordinates[buildingCode];
    updateDestination(coords, text);
    //destination.current?.setAddressText(text);
    } 
    else {
    updateDestination(null, text);
    } 

  }

  // Fetch travel times when origin or destination changes
  useEffect(() => {
    if (origin && destination) {
      setLoading(true);
      handleNavType(originText, destinationText);
      getTravelTimes(origin, destination).then((times) => {
        const timesMap: { [key: string]: number | null } = {};
        times.forEach(({ mode, duration }) => {
          timesMap[mode] = duration;
        });
        setTravelTimes(timesMap);
        setLoading(false);
      });
    }
  }, [origin, destination]);

  // Handle "GO" button click
  const handleGoClick = () => {
    console.log("Navigating...");
  };

  // Handle "Steps" button click (show modal)
  const handleStepsClick = async () => {
    if (!origin || !destination) return;

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${travelMode.toLowerCase()}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const stepsArray = data.routes[0].legs[0].steps.map(
          (step: any, index: number) => ({
            id: index,
            instruction: step.html_instructions.replace(/<[^>]+>/g, ""),
            distance: step.distance.text,
          })
        );

        setRouteSteps(stepsArray);
        setShowSteps(true);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Close steps modal
  const handleCloseSteps = () => {
    setShowSteps(false);
  };

  useEffect(() => {
    try {
      handleNavType(originText, destinationText);
      updateOrigin(origin, originText);
      updateDestination(destination, destinationText);
    } catch {
      console.log("Crashed 5");
    }
  }, [
    origin,
    location,
    {
      /*originText, destinationText*/
    },
    showTransportation,
    showSteps, 
  ]);

  useEffect(() => {
    try {
      handleNavType(originText, destinationText);
      updateShowTransportation(false);
    } catch {
      console.log("Crashed 4");
    }
  }, [origin, location,]);

  const getTravelTimeText = (
    times: { [key: string]: number | null },
    mode: string
  ) => {
    return times[mode] ? `${times[mode]} min` : "N/A";
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* From Input with Google Places Autocomplete */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>From</Text>
          <GooglePlacesAutocomplete
            ref={originRef}
            placeholder="Type or select origin location"
            fetchDetails={true}
            minLength={0}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
              components: "country:ca",
            }}
            onPress={(data, details = null) => {
              if (details) {
                const location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                updateOrigin(location, data.description);
                console.log("Hello went thru onPress");
                originRef.current?.setAddressText(data.description);
                updateShowTransportation(false);
              }
            }}
            textInputProps={{
              value: originText,
              onChangeText: (text) => updateOrigin(origin, text),
              onFocus: () => {
                setIsInputFocused(true);
                setShowMyLocButton(true);
              },
              onBlur: () => setIsInputFocused(false),
              style: styles.input,
            }}
            styles={{
              listView: styles.dropdownFrom,
              row: styles.dropdownItem,
            }}
          />
          {/* My Location Button */}
          {isInputFocused && showMyLocButton && (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                if (location) {
                  updateShowTransportation(false);
                  const coords = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  };
                  console.log("Selected My Location:", coords);
                  updateOrigin(coords, "My Location");
                  originRef.current?.setAddressText("My Location");
                  setShowMyLocButton(false);
                  setIsInputFocused(false);
                } else {
                  console.log("User location not available.");
                }
              }}
              style={myLocationStyles.myLocationButton}
            >
              <Icon name="target-two" size={20} color="black" />
              <Text style={myLocationStyles.myLocationText}>My Location</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* To Input with Google Places Autocomplete */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>To</Text>
          <GooglePlacesAutocomplete
            placeholder="Type or select destination location"
            fetchDetails={true}
            minLength={0}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
              components: "country:ca",
            }}
            onPress={(data, details = null) => {
              if (details) {
                const location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                updateDestination(location, data.description);
                updateShowTransportation(false);
              }
            }}
            textInputProps={{
              value: destinationText,
              onChangeText: handleDestinationInput,
              //onChangeText: (text) => updateDestination(destination, text),
              style: styles.input,
            }}
            styles={{
              listView: styles.dropdownTo,
              row: styles.dropdownItem,
            }}
          />
        </View>
        {/* Conditional Rendering for Directions Options */}
        {!showTransportation ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (origin && destination) {
                const parsedLocation = parseClassroomLocation(originText);

                if (parsedLocation) {
                  const { buildingName, floor } = parsedLocation;

                  const matchedBuilding = buildings.find(
                    (b) => b.name === buildingName
                  );

                  if (matchedBuilding) {
                    updateSelectedIndoorBuilding(matchedBuilding);
                    updateSelectedFloor(Number(floor));
                  }
                }

                updateShowTransportation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            {[
              { mode: "driving" as const, icon: "directions-car" as const },
              { mode: "transit" as const, icon: "directions-bus" as const },
              { mode: "walking" as const, icon: "directions-walk" as const },
              { mode: "bicycling" as const, icon: "directions-bike" as const },
            ].map(({ mode, icon }) => (
              <TouchableOpacity
                key={mode}
                onPress={() => {
                  if (origin && destination) {
                    console.log("Get Directions Pressed");
                    updateRenderMap(true);
                    updateTravelMode(mode);
                    updateShowTransportation(true);
                  }
                }}
                style={[
                  styles.transportButton,
                  travelMode === mode && styles.selectedButton,
                  { flexDirection: "row", alignItems: "center"}, // Added row layout
                ]}
              >
                <MaterialIcons
                  name={icon}
                  size={20}
                  color={travelMode === mode ? "white" : "black"}
                />
                <Text style={{ fontSize: 12, marginTop: 5 }}>
                  {getTravelTimeText(travelTimes, mode)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* Footer with ETA and "X" Button */}
      {renderMap && (
        <View style={styles.footerContainer}>
          {/* ETA Display */}
          <Text style={styles.etaText}>
            ETA:{" "}
            {loading
              ? "Calculating..."
              : getTravelTimeText(travelTimes, travelMode)}
          </Text>
          <TouchableOpacity style={styles.goButton} onPress={handleGoClick}>
            <Text style={styles.footerButtonText}>GO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepsButton}
            onPress={handleStepsClick}
          >
            <Text style={styles.footerButtonText}>Steps</Text>
          </TouchableOpacity>
          {/* "X" Button as a red cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              updateShowTransportation(false);
              updateRenderMap(false);
              updateSelectedFloor(1);
              updateSelectedIndoorBuilding(null);
              updateOrigin(null, "");
              updateDestination(null, "");
            }}
          >
            <Text style={[styles.footerButtonText, { color: "red" }]}>X</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Steps Modal */}
      {showSteps && (
        <Modal visible={showSteps} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Step-by-Step Directions</Text>
              <ScrollView style={styles.stepsList}>
                {routeSteps.map((step) => (
                  <View key={step.id} style={styles.stepItem}>
                    <Text style={styles.stepText}>{step.instruction}</Text>
                    <Text style={styles.stepDistance}>{step.distance}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseSteps}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default StartAndDestinationPoints;

const myLocationStyles = StyleSheet.create({
  myLocationButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 5,
    position: "absolute",
    top: 45,
    left: -15,
    elevation: 40,
    shadowColor: "black",
    zIndex: 11,
    width: 390,
    height: 44,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  myLocationText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
});
