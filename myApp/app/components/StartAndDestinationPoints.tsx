import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import Constants from 'expo-constants';
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/StartAndDestinationPointsStyles";

interface Props {
    setOriginLocation: (location: { latitude: number; longitude: number }) => void;
    setDestinationLocation: (location: { latitude: number; longitude: number }) => void;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;
console.log(GOOGLE_PLACES_API_KEY);

const StartAndDestinationPoints: React.FC<Props> = ({ setOriginLocation, setDestinationLocation }) => {
    const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
    const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showTransportation, setShowTransportation] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* From Input with Google Places Autocomplete */}
                <View style={styles.inputRow}>
                    <Text style={styles.label}>From</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Type or select location"
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
                            }
                        }}
                        styles={{
                            textInput: styles.input,
                            listView: styles.dropdown,
                            row: styles.dropdownItem,
                        }}
                    />
                </View>

                {/* To Input with Google Places Autocomplete */}
                <View style={styles.inputRow}>
                    <Text style={styles.label}>To</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Type or select location"
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
                            }
                        }}
                        styles={{
                            textInput: styles.input,
                            listView: styles.dropdown,
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
                                setShowTransportation(true);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Get Directions</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity>
                        <MaterialIcons name="directions-car" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="directions-bus" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="directions-walk" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="directions-bike" size={24} color="black" />
                    </TouchableOpacity>
                    </View>
                )}
                
            </View>

        </View>
    );
};

export default StartAndDestinationPoints;
