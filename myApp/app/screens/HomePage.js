import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { homepageStyles as styles } from '../styles/HomePageStyles.js';

export default function HomePage() {
   
    const router = useRouter();

    return (
        <View style ={{flex:1}}>
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

                    <TouchableOpacity style={styles.button}
                    onPress={() => router.push('(tabs)/interest-points')}
                    testID="interestButton"
                    >
                        <Text style={styles.buttonText}>Interest Points</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                    style={styles.buttonOrange}
                    testID="directionButton"
                    onPress={() => router.push('screens/CalendarSchedulePage')}
                    >
                        <Text style={styles.buttonText}>Next on Schedule</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Link your account</Text>
                 <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                    style={styles.googleButton}
                    testID="calendarfetchbutton"
                    onPress={() => router.push('/screens/CalendarFetching')}
                    >
                         <Image
                            source={require('../../assets/images/google_logo.png')}
                            style={styles.icon}
                            testID="googleIcon"
                        />
                        <Text style={styles.buttonText}>Fetch Calendars</Text>
                    </TouchableOpacity>
                </View>
               
               
            </View>
        </View>
    );
}