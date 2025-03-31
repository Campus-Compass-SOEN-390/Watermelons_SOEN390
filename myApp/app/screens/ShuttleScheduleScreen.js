import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchShuttleScheduleByDay } from '../api/shuttleSchedule';
import moment from 'moment';
import { useButtonInteraction } from '../hooks/useButtonInteraction';
import RNUxcam from "react-native-ux-cam";

export default function ShuttleScheduleScreen() {
    const navigation = useNavigation();
    const { handleButtonPress } = useButtonInteraction();
    const [schedule, setSchedule] = useState(null);
    const [error, setError] = useState(null);
    const [nextBus, setNextBus] = useState(null);
    const [campus, setCampus] = useState('SGW');

    // Add UXCam screen tagging
    useEffect(() => {
        RNUxcam.tagScreenName("ShuttleScheduleScreen");
    }, []);

    // Load schedule data
    useEffect(() => {
        const loadSchedule = async () => {
            const today = moment().format('dddd');
            console.log(`Fetching schedule for ${today}...`);

            if (today === "Saturday" || today === "Sunday") {
                console.warn("No schedule available on weekends.");
                setError("❌ No shuttle service on weekends.");
                return;
            }

            try {
                const data = await fetchShuttleScheduleByDay(today);
                if (!data) {
                    throw new Error("No schedule data available.");
                }
                console.log("Schedule data loaded:", data);
                setSchedule(data);
            } catch (err) {
                console.error("API Fetch Error:", err.message);
                setError("❌ Unable to load shuttle schedule. Please try again later.");
            }
        };

        loadSchedule();
    }, []);

    // Calculate next available bus
    useEffect(() => {
        if (!schedule) return;

        const currentTime = moment();
        let nextAvailableBus = null;

        for (const time of schedule[campus]) {
            if (moment(time, 'HH:mm').isAfter(currentTime)) {
                nextAvailableBus = time;
                break;
            }
        }

        setNextBus(nextAvailableBus);
    }, [schedule, campus]);

    const handleBack = () => {
        handleButtonPress(null, 'Going back');
        RNUxcam.logEvent("Shuttle Back Button Pressed");
        navigation.goBack();
    };

    const handleWarningPress = () => {
        const todayDate = moment().format('YYYY-MM-DD');
        handleButtonPress(null, 'Checking bus status');
        RNUxcam.logEvent("Shuttle Warning Button Pressed");
        
        if (todayDate === '2025-02-28') {
            Alert.alert("Bus Delay Warning", "⚠️ No service on February 28, 2025. Buses may be delayed.");
        } else {
            Alert.alert("Bus Status", "✅ No expected bus delays.");
        }
    };

    const handleCampusToggle = () => {
        const newCampus = campus === 'SGW' ? 'LOY' : 'SGW';
        handleButtonPress(null, `Switching to ${newCampus} campus schedule`);
        RNUxcam.logEvent(`Switch to ${newCampus} Schedule Button Pressed`);
        setCampus(newCampus);
    };

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backText}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Shuttle Bus Schedule</Text>
                </View>
                <Text style={styles.error}>
                    {error.includes("weekends") 
                        ? "🚍 No shuttle service on weekends. See you Monday!" 
                        : error}
                </Text>
            </View>
        );
    }

    if (!schedule) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backText}>✖</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Shuttle Bus Schedule</Text>

                <TouchableOpacity onPress={handleWarningPress} style={styles.warningButton}>
                    <Text style={styles.warningIcon}>⚠</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.switchButton}
                onPress={handleCampusToggle}
            >
                <Text style={styles.switchText}>{campus === 'SGW' ? 'SGW ➜ LOY' : 'LOY ➜ SGW'}</Text>
            </TouchableOpacity>

            <ScrollView style={styles.scheduleContainer}>
                <Text style={styles.scheduleHeader}>Schedule in effect Monday to Friday</Text>

                <View style={styles.table}>
                    <Text style={styles.tableHeader}>AM</Text>
                    <View style={styles.verticalDivider}></View>
                    <Text style={styles.tableHeader}>PM</Text>
                </View>

                {splitSchedule(schedule[campus]).map(({ am, pm }, index) => (
                    <View key={`${am}-${pm}-${index}`} style={styles.tableRow}>
                        <Text style={[styles.tableText, am === nextBus && styles.highlight]}>
                            {am || ''}
                        </Text>
                        <View style={styles.verticalDividerDashed}></View>
                        <Text style={[styles.tableText, pm === nextBus && styles.highlight]}>
                            {pm || ''}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const splitSchedule = (times) => {
    const amTimes = times.filter(time => moment(time, 'HH:mm').hour() < 12);
    const pmTimes = times.filter(time => moment(time, 'HH:mm').hour() >= 12);

    const maxLength = Math.max(amTimes.length, pmTimes.length);
    return Array.from({ length: maxLength }, (_, i) => ({
        am: amTimes[i] || '',
        pm: pmTimes[i] || ''
    }));
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#800020',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    warningButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#800020',
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningIcon: {
        fontSize: 20,
        color: 'white',
    },
    switchButton: {
        alignSelf: 'center',
        backgroundColor: '#800020',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    switchText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    scheduleContainer: {
        marginTop: 10,
    },
    scheduleHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    table: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5,
    },
    tableText: {
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
    },
    highlight: {
        fontWeight: 'bold',
        color: 'green',
    },
    verticalDividerDashed: {
        width: 1,
        backgroundColor: 'black',
        height: '100%',
        marginHorizontal: 10,
        borderStyle: 'dashed',
    },
});