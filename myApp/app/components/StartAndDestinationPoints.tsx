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
import { useLocationContext } from '../context/LocationContext';

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
    origin, 
    destination, 
    originText, 
    destinationText, 
    showTransportation, 
    renderMap,
    travelMode
  } = useLocationContext();
  const { location } = useLocation();
  const originRef = useRef<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showMyLocButton, setShowMyLocButton] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [routeSteps, setRouteSteps] = useState<Step[]>([]);

  //Handle "GO" button click
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
            instruction: step.html_instructions.replace(/<[^>]+>/g, ""), // Remove HTML tags
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

  // Handle "Add Favorite" button click
  const handleAddFavorite = () => {
    console.log("Adding to Favorites...");
  };

  useEffect(() => {
    try{
      updateOrigin(origin, originText);
      updateDestination(destination, destinationText);
    }
    catch{
      console.log("Crashed 5")
    }
  }, [origin, location, {/*originText, destinationText*/}, showTransportation, showSteps])

  useEffect(() => {
    try{
      updateShowTransportation(false);
    }
    catch{
      console.log("Crashed 4")
    }
  }, [origin, location])

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
              components: "country:ca", // restrict data within Canada
            }}
            onPress={(data, details = null) => {
              if (details) {
                const location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                updateOrigin(location, data.description)
                console.log("Hello went thru onPress");
                originRef.current?.setAddressText(data.description); // Allows persistance of the selected origin location
                updateShowTransportation(false);
              }
            }}
            textInputProps={{
              value: originText, // This will show "My Location" or the selected place
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
                  // Verify current location properly fetched (tested on expo app -> successful!)
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
              components: "country:ca", // restrict data within Canada
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
              onChangeText: (text) => updateDestination(destination, text),
              style: styles.input,
            }}
            styles={{
              listView: styles.dropdownTo,
              row: styles.dropdownItem,
            }}
          />
        </View>
        {/* Conditional Rendering */}
        {!showTransportation ? (
          /* Get Directions Button */
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (origin && destination) {
                updateShowTransportation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            {[
              { mode: "DRIVING" as const, icon: "directions-car" as const },
              { mode: "TRANSIT" as const, icon: "directions-bus" as const },
              { mode: "WALKING" as const, icon: "directions-walk" as const },
              { mode: "BICYCLING" as const, icon: "directions-bike" as const },
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
                ]}
              >
                <MaterialIcons
                  name={icon}
                  size={24}
                  color={travelMode === mode ? "white" : "black"}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* Footer */}
      {renderMap && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.goButton} onPress={handleGoClick}>
            <Text style={styles.footerButtonText}>GO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stepsButton}
            onPress={handleStepsClick}
          >
            <Text style={styles.footerButtonText}>Steps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleAddFavorite}
          >
            <Text style={styles.footerButtonText}>Add favorite</Text>
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

    // to accomodate for the icon position
    flexDirection: "row",
  },
  myLocationText: {
    fontSize: 16,
    color: "black", // Change to white for better visibility
    fontWeight: "bold",
  },
});
