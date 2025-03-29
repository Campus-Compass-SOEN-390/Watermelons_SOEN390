import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { homepageStyles as styles } from '../styles/HomePageStyles.js';
import HeaderButtons from "../components/HeaderButtons";
import { Ionicons } from '@expo/vector-icons';


export default function HomePage() {
    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            {/* Top navigation with Settings button */}
            <HeaderButtons />

            {/* Logo */}
            <Image
                style={styles.logo}
                source={require('../../assets/images/logo.png')}
                resizeMode="contain"
                testID="logo"
            />

            {/* Getting around campus section */}
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Getting around campus</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="sgwButton"
                        onPress={() => router.push('/(tabs)/map?type=sgw')}
                    >
                        <Text style={styles.buttonText}>SGW Campus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="loyolaButton"
                        onPress={() => router.push('/(tabs)/map?type=loy')}
                    >
                        <Text style={styles.buttonText}>Loyola Campus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="shuttleScheduleButton"
                        onPress={() => router.push('/screens/ShuttleScheduleScreen')}
                    >
                        <Text style={styles.buttonText}>Shuttle Bus Schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('(tabs)/interest-points')}
                        testID="interestButton"
                    >
                        <Text style={styles.buttonText}>Interest Points</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Calendar section */}
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>View My Calendar</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.googleButton}
                        testID="calendarfetchbutton"
                        onPress={() => router.push('screens/CalendarFetching')}
                    >
                        <Image
                            source={require('../../assets/images/google_logo.png')}
                            style={styles.icon}
                            testID="googleIcon"
                        />
                        <Text style={styles.buttonText}>Connect Calendars</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info button in bottom right corner */}
            <TouchableOpacity
                style={styles.infoButton}
                onPress={() => router.push('/screens/InfoPage')}
                testID="infoButton"
            >
                <Ionicons name="information-circle-outline" size={30} color="white" />
            </TouchableOpacity>

        </View>
    );
}
