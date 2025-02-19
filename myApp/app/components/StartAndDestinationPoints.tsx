import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Constants from 'expo-constants';
import useLocation from "../hooks/useLocation";
import styles from "../styles/StartAndDestinationPointsStyles";




interface Props {
    setOriginLocation: (location: { latitude: number; longitude: number }) => void;
    setDestinationLocation: (location: { latitude: number; longitude: number }) => void;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const StartAndDestinationPoints: React.FC<Props> = ({ setOriginLocation, setDestinationLocation }) => {

    const { location } = useLocation(); 
    
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
                                setOriginLocation(location);
                            }
                        }}

                        styles = {{
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
                        }}
                        onPress={(data, details = null) => {
                            if (details) {
                                const location = {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                };
                                setDestinationLocation(location);
                            }
                        }}
            
                        styles = {{
                            textInput: styles.input,
                            listView: styles.dropdown,
                            row: styles.dropdownItem,
                        }}
                    />
                </View>

                {/* Get Directions Button */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Get Directions</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



export default StartAndDestinationPoints;