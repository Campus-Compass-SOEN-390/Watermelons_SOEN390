import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GOOGLE_PLACES_API_KEY from '../(tabs)/interest-points';


interface Props {
    setOriginLocation: (location: { latitude: number; longitude: number }) => void;
    setDestinationLocation: (location: { latitude: number; longitude: number }) => void;
}

const StartAndDestinationPoints: React.FC<Props> = ({ setOriginLocation, setDestinationLocation }) => {
    return (
        
        <View style={styles.container}>
            <View style={styles.card}>
                {/* From Input with Google Places Autocomplete */}
                <View style={styles.inputRow}>
                    <Text style={styles.label}>From</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Type or select location"
                        fetchDetails={true}
                        minLength={2}
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

                        styles={{
                            textInput: styles.input,
                            listView: {
                                position: "absolute",
                                top: 45, // Ensures it appears below the input box
                                backgroundColor: "white",
                                zIndex: 100, // Keeps it on top
                                maxHeight: 200,
                            },
                            row: styles.dropdownItem,
                        }}
                        renderRow={(data) => (
                            <View style={{ padding: 10 }}>
                                <Text>{data.description}</Text>
                            </View>
                        )}
                     
                    />
                </View>

                {/* To Input with Google Places Autocomplete */}
                <View style={styles.inputRow}>
                    <Text style={styles.label}>To</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Type or select location"
                        fetchDetails={true}
                        minLength={2}
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

// Styles
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 140,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 2,
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 50,
        textAlign: 'right',
        position: "relative",
        right: 10,
        
   
    },
    input: {
        flex: 1,
        backgroundColor: '#eee',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        maxHeight: 150,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    button: {
        backgroundColor: '#eee',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 5,
        position: "absolute",
        top: 120,
        left: 10,
        elevation: 40,
        shadowColor: "black",
    },
    buttonText: {
        fontSize: 14,
        color: 'black',
        
    }
});


export default StartAndDestinationPoints;