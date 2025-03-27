import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { homepageStyles as styles } from '../styles/HomePageStyles.js';
import { triggerVibration, triggerSound, triggerSpeech } from '../utils/feedback';
import { useFeedback } from '../context/FeedbackContext.js';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
    const router = useRouter();
    const { feedbackEnabled } = useFeedback();

    const handleButtonPress = (route, buttonText) => {
        if (feedbackEnabled) {
            triggerVibration();
            triggerSound();
            triggerSpeech(buttonText);
        }
        router.push(route);
    };

    return (
        <View style={{flex:1}}>
            <Image style={styles.logo}
                source={require('../../assets/images/logo.png')}
                resizeMode="contain"
                testID="logo"
            />
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Getting around campus</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="sgwButton"
                        onPress={() => handleButtonPress('/(tabs)/map?type=sgw', 'SGW Campus')}
                    >
                        <Text style={styles.buttonText}>SGW Campus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="loyolaButton"
                        onPress={() => handleButtonPress('/(tabs)/map?type=loy', 'Loyola Campus')}
                    >
                        <Text style={styles.buttonText}>Loyola Campus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="shuttleScheduleButton"
                        onPress={() => handleButtonPress('/screens/ShuttleScheduleScreen', 'Shuttle Bus Schedule')}
                    >
                        <Text style={styles.buttonText}>Shuttle Bus Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => handleButtonPress('(tabs)/interest-points', 'Interest Points')}
                        testID="interestButton"
                    >
                        <Text style={styles.buttonText}>Interest Points</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>View My Calendar</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.googleButton}
                        testID="calendarfetchbutton"
                        onPress={() => handleButtonPress('screens/CalendarFetching', 'Connect Calendars')}
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
        </View>
    );
}