import React, { useState, useEffect } from "react";
import { 
  View, Image, Text, TextInput, TouchableOpacity, 
  FlatList, Alert, Modal, ActivityIndicator 
} from "react-native";
import Constants from "expo-constants";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { calendarFetchingStyles as styles } from "../styles/CalendarFetchingStyles.js";

// Import navigation hook
import { useNavigation } from "@react-navigation/native";

export default function CalendarFetching() {
  const navigation = useNavigation();

  const [calendarId, setCalendarId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // New: Track whether we should show the success screen
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // For demonstration, we’ll pull the API key from either .env or app config
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

  const fetchCalendarEvents = async () => {
    if (!calendarId.trim()) {
      Alert.alert("Invalid ID", "Please enter a valid Calendar ID");
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
          // Instead of alerting success, show the success screen
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
  };

  // When showSuccessScreen is true, wait 5 seconds, then navigate to Events Page
  useEffect(() => {
    if (showSuccessScreen) {
      const timer = setTimeout(() => {
        // Navigate to Events after 5 seconds
        navigation.navigate("");
      }, 5000);

      // Cleanup timer on unmount or if showSuccessScreen changes
      return () => clearTimeout(timer);
    }
  }, [showSuccessScreen]);

  // If we are showing the success screen, return that UI immediately
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>View Events</Text>
              </TouchableOpacity>

              {/* Modal for Events */}
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.eventsTitle}>Upcoming Events</Text>
                    <FlatList
                      data={events}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <View style={styles.eventItem}>
                          <Text style={styles.eventTitle}>{item.summary}</Text>
                          <Text style={styles.eventDate}>
                            {item.start?.dateTime || item.start?.date}
                          </Text>
                        </View>
                      )}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
