import { useEffect, React } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { homepageStyles as styles } from '../styles/HomePageStyles.js';
import { useButtonInteraction } from '../hooks/useButtonInteraction';
import RNUxcam from "react-native-ux-cam";

export default function HomePage() {
    const { handleButtonPress } = useButtonInteraction();

    useEffect(() => {
        RNUxcam.tagScreenName("HomePage");
    }, []);

    return (
        <View style={{flex:1}}>
            <Image 
                style={styles.logo}
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
                        onPress={() => {
                            RNUxcam.logEvent("SGW Campus Button Pressed");
                            handleButtonPress('/(tabs)/map?type=sgw', 'SGW Campus');
                        }}
                    >
                        <Text style={styles.buttonText}>SGW Campus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="loyolaButton"
                        onPress={() => {
                            RNUxcam.logEvent("Loyola Campus Button Pressed");
                            handleButtonPress('/(tabs)/map?type=loy', 'Loyola Campus');
                        }}
                    >
                        <Text style={styles.buttonText}>Loyola Campus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        testID="shuttleScheduleButton"
                        onPress={() => {
                            handleButtonPress('/screens/ShuttleScheduleScreen', 'Shuttle Bus Schedule');
                        }}
                    >
                        <Text style={styles.buttonText}>Shuttle Bus Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => {
                            RNUxcam.logEvent("Interest point Button Pressed");
                            handleButtonPress('(tabs)/interest-points', 'Interest Points');
                        }}
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
                        onPress={() => {
                            RNUxcam.logEvent("Google Calendar Button Pressed");
                            handleButtonPress('screens/CalendarFetching', 'Connect Calendars');
                        }}
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
