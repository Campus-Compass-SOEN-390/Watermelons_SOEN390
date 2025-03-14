import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { homepageStyles as styles } from '../styles/HomePageStyles.js'
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


GoogleSignin.configure({
  webClientId: "321256625453-8bbjeu3icp553q13d5fr7dv9ssbue5a0.apps.googleusercontent.com.apps.googleusercontent.com", // For Firebase auth, optional
  androidClientId: "321256625453-4brqk27son279249bf3k5t2uglvjr63b.apps.googleusercontent.com.apps.googleusercontent.com", // Use your Android Client ID
});

export default function HomePage() {
   
    const router = useRouter();
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: 'bxnjiho.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            console.log('Google Token:', authentication.accessToken);
        }
    }, [response]);

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
                    onPress={() => router.push('/(tabs)/map?type=loyola')}
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
                    >
                        <Text style={styles.buttonText}>Directions to my next class</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Text style={styles.title}>Link your account</Text>
                <View style={styles.buttonContainer}>
                     <TouchableOpacity 
                        style={styles.googleButton}
                        testID="googleButton"
                        onPress={() => promptAsync()}
                    >
                        <Image source={require('../../assets/images/google_logo.png')} style={styles.icon} />
                        <Text style={styles.googleButtonText}>Connect Google Calendar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}