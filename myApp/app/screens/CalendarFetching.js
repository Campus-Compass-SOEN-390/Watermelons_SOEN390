import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Image, Text, TextInput, TouchableOpacity, 
  FlatList, Alert, Modal, ActivityIndicator 
} from "react-native";
import Constants from "expo-constants";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { calendarFetchingStyles as styles } from "../styles/CalendarFetchingStyles.js";
import { useNavigation } from "@react-navigation/native";

export default function CalendarFetching() {
  const navigation = useNavigation();

  // Declare all state variables
  const [calendarId, setCalendarId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // **Add showSuccessScreen here**:
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

  // Fetch events
  const fetchCalendarEvents = useCallback(async () => {
    if (!calendarId.trim()) {
      Alert.alert("Invalid", "Please enter a valid Calendar ID");
      return;
    }

    setLoading(true);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}`;
    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.error) {
        Alert.alert("Error", `API Error: ${data.error.message}`);
      } else {
        if (data.items) {
          setEvents(data.items);
          // 3) Trigger success screen
          setShowSuccessScreen(true);
        } else {
          setEvents([]);
          Alert.alert("No Events", "No upcoming events found.");
        }
      }
      console.log("API Response:", data); // Debug
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      Alert.alert("Error", "Something went wrong while fetching the events.");
    }

    setLoading(false);
  }, [calendarId, API_KEY]);

  // Navigate after success
  useEffect(() => {
    if (showSuccessScreen) {
      const timer = setTimeout(() => {
        // Navigate to the desired screen after 5 seconds
        navigation.navigate("Events");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessScreen, navigation]);

  // 5) Conditional rendering for success screen
  if (showSuccessScreen) {
    return (
      <View style={styles.successContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          testID="logo"
        />
        <Text style={styles.successTitle}>
          Successful Connection to Google Calendar ID: {calendarId}
        </Text>
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        <Text style={styles.successSubtitle}>
          Redirecting to Events Page...
        </Text>
      </View>
    );
  }

  // Default screen rendering
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
         {/* Back Button positioned above the container */}
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.redContainer}>
            <View style={styles.whiteContainer}>
              <Text style={styles.title}>Enter your Google Calendar ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste Calendar ID here"
                value={calendarId}
                onChangeText={setCalendarId}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.connectButton}
                onPress={fetchCalendarEvents}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Connecting..." : "Connect"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
