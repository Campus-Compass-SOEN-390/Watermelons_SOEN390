import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import Constants from 'expo-constants';
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/StartAndDestinationPointsStyles";
import useLocation from "../hooks/useLocation";
import Icon from 'react-native-vector-icons/Foundation'; 
import { useNavigation } from "@react-navigation/native";

interface Props {
    setOriginLocation: (location: { latitude: number; longitude: number }) => void;
    setDestinationLocation: (location: { latitude: number; longitude: number }) => void;
    setTravelMode: (mode: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT') => void;
    renderMap: boolean; 
    setRenderMap: (show: boolean) => void; 
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const StartAndDestinationPoints: React.FC<Props> = ({ setOriginLocation, setDestinationLocation, setTravelMode, renderMap, setRenderMap }) => {
    const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
    const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showTransportation, setShowTransportation] = useState(false);
    const { location } = useLocation();
    const [originText, setOriginText] = useState(""); 
    const originRef = useRef<any>(null);
    const [isOriginSet, setIsOriginSet] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false); 
    const defaultTravel = 'TRANSIT';

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
    
    const [showMyLocButton, setShowMyLocButton] = useState(true);

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
                                setOriginText(data.description); // Set the input text to the selected place
                                originRef.current?.setAddressText(data.description); // Allows persistance of the selected origin location 
                                setShowTransportation(false);
                                
                            }
                        }}
                        textInputProps={{
                            value: originText, // This will show "My Location" or the selected place
                            onChangeText: setOriginText,
                            onFocus: () => {setIsInputFocused(true); setShowMyLocButton(true);},
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
                                    }
                                    setOrigin(myLocation);
                                    setOriginLocation(myLocation);
                                    setIsOriginSet(true);
                                    setShowTransportation(false);
                               
                                // Verify current location properly fetched (tested on expo app -> successful!)
                                const coords = ({
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                });
                                console.log("Selected My Location:", coords);

                                    setOriginText("My Location"); // Set the input text to "My Location"
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
                            <Text style={myLocationStyles.myLocationText}>  My Location</Text>
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
                            }
                        }}
                        textInputProps={{
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
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode(defaultTravel);
                            }
                        }}   
                    >
                        <Text style={styles.buttonText}>Get Directions</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowFooter(true);
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('TRANSIT');
                                     navigation.setOptions({
                                    tabBarStyle: { display: 'none' },  
                                });
                            }
                        }}
                    >
                        <MaterialIcons name="directions-car" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowFooter(true);
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('TRANSIT');
                                navigation.setOptions({
                                    tabBarStyle: { display: 'none' },  
                                });
                            }
                        }}
                    >
                        <MaterialIcons name="directions-bus" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowFooter(true);
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('WALKING');
                                navigation.setOptions({
                                    tabBarStyle: { display: 'none' },  
                                });

                            }
                        }}
                    >
                        <MaterialIcons name="directions-walk" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowFooter(true);
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('BICYCLING');
                                navigation.setOptions({
                                    tabBarStyle: { display: 'none' },  
                                });
                            }
                        }}
                    >
                        <MaterialIcons name="directions-bike" size={24} color="black" />
                    </TouchableOpacity>
                    </View>
                )}
            </View>
                {/* Footer */}
                {showFooter && (
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.goButton} onPress={handleGoClick}>
                        <Text style={styles.footerButtonText}>GO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepsButton} onPress={handleStepsClick}>
                        <Text style={styles.footerButtonText}>Steps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton} onPress={handleAddFavorite}>
                        <Text style={styles.footerButtonText}>Add favorite</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Steps Modal */}
            {showSteps && (
                <Modal visible={showSteps} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Directions</Text>
                            <Text style={styles.modalText}>1. Start from {origin?.latitude}, {origin?.longitude}</Text>
                            <Text style={styles.modalText}>2. Head towards {destination?.latitude}, {destination?.longitude}</Text>
                            {/* More steps can be added based on the route */}
                            <TouchableOpacity style={styles.closeButton} onPress={handleCloseSteps}>
                                <Text style={styles.closeButtonText}>Close</Text>
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
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        marginTop: 5,
        position: "absolute",
        top: 45, 
        left: -15,
        elevation: 40,
        shadowColor: "black",
        zIndex: 11,
        width: 390, 
        height: 44,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,

        // to accomodate for the icon position
        flexDirection: 'row',
    },
    myLocationText: {
        fontSize: 16,
        color: "black", // Change to white for better visibility
        fontWeight: "bold",
    },
    
});