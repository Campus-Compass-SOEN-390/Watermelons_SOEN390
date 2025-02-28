import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import 'react-native-get-random-values';
import Constants from 'expo-constants';
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/StartAndDestinationPointsStyles";
import useLocation from "../hooks/useLocation";
import Icon from 'react-native-vector-icons/Foundation'; 

interface Props {
    buildingTextOrigin: string;
    buildingTextDestination: string;
    originLocation: {latitude: number; longitude: number}
    destinationLocation: {latitude: number; longitude: number}
    setOriginLocation: (location: { latitude: number; longitude: number }) => void;
    setDestinationLocation: (location: { latitude: number; longitude: number }) => void;
    setTravelMode: (mode: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT') => void;
    renderMap: boolean; 
    setRenderMap: (show: boolean) => void;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;


const StartAndDestinationPoints: React.FC<Props> = ({ buildingTextDestination, buildingTextOrigin, originLocation, destinationLocation, setOriginLocation, setDestinationLocation, setTravelMode, renderMap, setRenderMap}) => {
    const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
    const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showTransportation, setShowTransportation] = useState(false);
    const { location } = useLocation();
    const [originText, setOriginText] = useState(""); 
    const [destinationText, setDestinationText] = useState("");
    const originRef = useRef<any>(null);
    const [isOriginSet, setIsOriginSet] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false); 
    const defaultTravel = 'TRANSIT';
    const [showMyLocButton, setShowMyLocButton] = useState(true);
    const [showTravelMode, setShowTravelMode] = useState("");
    const [useBuildingText, setUseBuildingText] = useState("")

    useEffect(() => {
        console.log("originText updated to: xxx ", originText, "building info: xxx", buildingTextOrigin);
        console.log("destinationText updated to: xxx ", destinationText, "building info:", buildingTextDestination);
    }, [originText, destinationText]);

    useEffect(() => {
        setUseBuildingText(buildingTextDestination)
        setOrigin(originLocation);
        setDestination(destinationLocation);
        if(buildingTextDestination) {
            setDestinationText(buildingTextDestination);
        }
        if(buildingTextOrigin) {
            setOriginText(buildingTextOrigin);
        }
    }, [buildingTextOrigin, buildingTextDestination]);

    useEffect(() => {
        setOrigin(originLocation);
        setDestination(destinationLocation);
        if(useBuildingText) {
            setDestinationText(buildingTextDestination);
        }
        if(useBuildingText) {
            setOriginText(buildingTextOrigin);
        }
    }, [showTransportation, showTravelMode])

    useEffect(()=>{
        if(buildingTextDestination && buildingTextOrigin) {
            setOriginText(buildingTextOrigin);
            setDestinationText(buildingTextDestination);
        }
    }, [origin, destination])

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
                                setUseBuildingText("")
                                setOriginText(data.description);
                                originRef.current?.setAddressText(data.description); // Allows persistance of the selected origin location 
                                setShowTransportation(false);
                                setDestinationText("");
                                
                            }
                        }}
                        textInputProps={{
                            value: originText, // This will show "My Location" or the selected place
                            onChangeText:setOriginText,
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
                                    setUseBuildingText("");
                                    setOrigin(myLocation);
                                    setOriginLocation(myLocation);
                                    setIsOriginSet(true);
                                    setShowTransportation(false);
                                    setOriginText("My Location");

                               
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
                                setUseBuildingText("");
                                setDestinationText(data.description);
                                
                            }
                        }}
                        textInputProps={{
                            value: destinationText,
                            onChangeText:setDestinationText,
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
                            console.log("Text origin: yyy ", originText)
                            console.log("building text origin:", buildingTextOrigin)
                            console.log("Destination: yyy " ,destinationText)
                            if (origin && destination) {
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode(defaultTravel);
                                setShowTravelMode(defaultTravel);
                            }
                            if(buildingTextDestination) {
                                setDestinationText(buildingTextDestination);
                            }
                            if(buildingTextOrigin) {
                                setOriginText(buildingTextOrigin);
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
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('DRIVING');
                                setShowTravelMode('DRIVING');
                            }
                            if(buildingTextDestination) {
                                setDestinationText(buildingTextDestination);
                            }
                            if(buildingTextOrigin) {
                                setOriginText(buildingTextOrigin);
                            }
                        }}
                    >
                        <MaterialIcons name="directions-car" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('TRANSIT');
                                setShowTravelMode('TRANSIT');
                            }
                            if(buildingTextDestination) {
                                setDestinationText(buildingTextDestination);
                            }
                            if(buildingTextOrigin) {
                                setOriginText(buildingTextOrigin);
                            }
                        }}
                    >
                        <MaterialIcons name="directions-bus" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('WALKING');
                                setShowTravelMode('WALKING');
                            }
                            if(buildingTextDestination) {
                                setDestinationText(buildingTextDestination);
                            }
                            if(buildingTextOrigin) {
                                setOriginText(buildingTextOrigin);
                            }
                        }}
                    >
                        <MaterialIcons name="directions-walk" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (origin && destination) {
                                setShowTransportation(true);
                                setRenderMap(true);
                                setTravelMode('BICYCLING');
                                setShowTravelMode('BICYCLING');
                            }
                            if(buildingTextDestination) {
                                setDestinationText(buildingTextDestination);
                            }
                            if(buildingTextOrigin) {
                                setOriginText(buildingTextOrigin);
                            }
                        }}
                    >
                        <MaterialIcons name="directions-bike" size={24} color="black" />
                    </TouchableOpacity>
                    </View>
                )}
            </View>

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