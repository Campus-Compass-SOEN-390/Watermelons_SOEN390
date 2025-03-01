import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/StartAndDestinationPointsStyles";
import useLocation from "../hooks/useLocation";
import Icon from "react-native-vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";

interface Props {
  setOriginLocation: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  setDestinationLocation: (location: {
    latitude: number;
    longitude: number;
  }) => void;
  setTravelMode: (
    mode: "DRIVING" | "BICYCLING" | "WALKING" | "TRANSIT"
  ) => void;
  renderMap: boolean;
  setRenderMap: (show: boolean) => void;
  updateText: number;
  buildingTextOrigin: string;
  buildingTextDestination: string;
  originLocation: { latitude: number; longitude: number };
  destinationLocation: { latitude: number; longitude: number };
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const StartAndDestinationPoints: React.FC<Props> = ({
  updateText,
  buildingTextDestination,
  buildingTextOrigin,
  originLocation,
  destinationLocation,
  setOriginLocation,
  setDestinationLocation,
  setTravelMode,
  renderMap,
  setRenderMap,
}) => {
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showTransportation, setShowTransportation] = useState(false);
  const { location } = useLocation();
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const originRef = useRef<any>(null);
  const [isOriginSet, setIsOriginSet] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const defaultTravel = "TRANSIT";
  const [showMyLocButton, setShowMyLocButton] = useState(true);
  const [showTravelMode, setShowTravelMode] = useState("");
  const [selectedMode, setSelectedMode] = useState<
    "DRIVING" | "BICYCLING" | "WALKING" | "TRANSIT"
  >(defaultTravel);
  const [localUpdateText, setLocalUpdateText] = useState(0);
  const [locationSet, setLocationSet] = useState(0);

  const [showFooter, setShowFooter] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const navigation = useNavigation();
  // Handle "GO" button click
  const handleGoClick = () => {
    console.log("Navigating...");
  };

  // Handle "Steps" button click (show modal)
  const handleStepsClick = () => {
    setShowSteps(true);
  };

  // Close steps modal
  const handleCloseSteps = () => {
    setShowSteps(false);
  };

  // Handle "Add Favorite" button click
  const handleAddFavorite = () => {
    console.log("Adding to Favorites...");
  };

  //This useEffect only executes when updatedText changes, aka directions come from a building Popup
  useEffect(() => {
    setLocalUpdateText(updateText);
    setShowTransportation(false); //Hide the transportation methods until Get Directions is pressed again
    if (buildingTextOrigin) {
      setOrigin(originLocation);
      setOriginText(buildingTextOrigin);
    }
    if (buildingTextDestination) {
      setDestination(destinationLocation);
      setDestinationText(buildingTextDestination);
    }
  }, [updateText]);

  //This use effect only executes if user hasn't changed origin and destination from when they were set by the building popup
  useEffect(() => {
    if (
      buildingTextDestination &&
      buildingTextOrigin &&
      localUpdateText == updateText
    ) {
      setOriginText(buildingTextOrigin);
      setDestinationText(buildingTextDestination);
    }
  }, [origin, destination, showTransportation, showTravelMode]);

  //Sets destination text to "" and destination to null anytime location changes
  useEffect(() => {
    setDestinationText("");
    setDestination(null);
  }, [locationSet]);

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
                setOrigin(location);
                setOriginLocation(location);
                setIsOriginSet(true);
                setDestinationText("");
                setDestination(null);
                setLocalUpdateText(0);
                setOriginText(data.description);
                originRef.current?.setAddressText(data.description); // Allows persistance of the selected origin location
                setShowTransportation(false);
                setLocationSet(locationSet + 1);
              }
            }}
            textInputProps={{
              value: originText, // This will show "My Location" or the selected place
              onChangeText: setOriginText,
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
                  const myLocation = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  };
                  setOrigin(myLocation);
                  setOriginLocation(myLocation);
                  setIsOriginSet(true);
                  setShowTransportation(false);
                  setOriginText("My Location");
                  setDestinationText("");
                  setDestination(null);
                  setLocalUpdateText(0);
                  setLocationSet(locationSet + 1);

                  // Verify current location properly fetched (tested on expo app -> successful!)
                  const coords = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  };
                  console.log("Selected My Location:", coords);

                  setOriginText("My Location"); // Set the input text to "My Location"
                  setDestinationText("");
                  setDestination(null);
                  originRef.current?.setAddressText("My Location");
                  setShowMyLocButton(false);
                  setIsInputFocused(false);
                  setLocalUpdateText(0);
                  setLocationSet(locationSet + 1);
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
                setDestination(location);
                setDestinationLocation(location);
                setShowTransportation(false);
                setDestinationText(data.description);
                setLocalUpdateText(0);
              }
            }}
            textInputProps={{
              value: destinationText,
              onChangeText: setDestinationText,
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
              console.log("Get Directions Pressed", origin, destination);
              console.log("Text origin: yyy ", originText);
              console.log("building text origin:", buildingTextOrigin);
              console.log("Destination: yyy ", destinationText);
              if (origin && destination) {
                setShowTransportation(true);
                setRenderMap(true);
                setTravelMode(defaultTravel);
                setShowTravelMode(defaultTravel);
                setShowTransportation(true);
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
                    setShowFooter(true);
                    setRenderMap(true);
                    setTravelMode(mode);
                    setSelectedMode(mode);
                    setShowTravelMode(mode);
                    setShowTransportation(true);
                    navigation.setOptions({
                      tabBarStyle: { display: "none" },
                    });
                  }
                }}
                style={[
                  styles.transportButton,
                  selectedMode === mode && styles.selectedButton,
                ]}
              >
                <MaterialIcons
                  name={icon}
                  size={24}
                  color={selectedMode === mode ? "white" : "black"}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
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
