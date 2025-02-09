import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { homepageStyles as styles } from '../styles/HomePageStyles.js'
import InterestPoints from '../(tabs)/interest-points.jsx';
export default function HomePage() {
    const router = useRouter()
    return (
        <View style ={{flex:1}}>
            <Image style={styles.logo}
                source={require('../../assets/images/logo.png')}
                resizeMode="contain"
            />
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Getting around campus</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.push('/(tabs)/outdoor-map?type=sgw')}
                    >
                    <Text style={styles.buttonText}>SGW Campus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.push('/(tabs)/outdoor-map?type=loyola')}
                    >
                        <Text style={styles.buttonText}>Loyola Campus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Browse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                    onPress={() => router.push('(tabs)/interest-points')}
                    >
                        <Text style={styles.buttonText}>Interest Points</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonOrange}>
                        <Text style={styles.buttonText}>Directions to my next class</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Link your account</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.googleButton}>
                        <Image
                            source={require('../../assets/images/google_logo.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.googleButtonText}>Connect Google Calendar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}