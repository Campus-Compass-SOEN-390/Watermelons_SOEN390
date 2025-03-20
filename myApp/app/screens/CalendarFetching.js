import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { calendarFetchingStyles as styles } from "../styles/CalendarFetchingStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import LayoutWrapper from "../components/LayoutWrapper.js";




export default function CalendarFetching() {
  const navigation = useNavigation();
  const router = useRouter();

  const [calendarId, setCalendarId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  // Allows the storage of calendar id history for future selection
  const [storedCalendarIds, setStoredCalendarIds] = useState([]);


  const API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

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

          // Keeps track of each calendar's events
          const csvContent = convertEventsToCSV(data.items, data.summary);
          const fileUri = FileSystem.documentDirectory + "calendar_events.csv";

          // All events are stored in a CSV file
          await FileSystem.writeAsStringAsync(fileUri, csvContent);
          console.log("CSV saved to:", fileUri);

          // Save calendar id if not already in store
          try {

            if (!calendarId || !data.summary) return;
            // Display as unlabelled calendar if no name found for it
            const newEntry = { id: calendarId, name: data.summary || "Unlabelled Calendar" };
            const existingEntries = [...storedCalendarIds];

            // Check if the entry already exists
            const isDuplicate = existingEntries.some(entry => entry.id === calendarId);

            // Ensure new entry is not a duplicate by verifying the ID not the calendar name
            if (!isDuplicate) {
              const updatedCalendarIds = [newEntry, ...existingEntries];
              setStoredCalendarIds(updatedCalendarIds);
              await AsyncStorage.setItem("calendarIds", JSON.stringify(updatedCalendarIds));
            }
          } catch (err) {
            console.error("Failed to save calendar ID and name", err);
          }

          setShowSuccessScreen(true);
        } else {
          setEvents([]);
          Alert.alert("No Events", "No upcoming events found.");
        }
      }

      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      Alert.alert("Error", "Something went wrong while fetching the events.");
    }

    setLoading(false);
  }, [calendarId, API_KEY]);

  // Redirect user to events page upon successful entry of a calendar id
  useEffect(() => {
    if (showSuccessScreen) {
      const timer = setTimeout(() => {
        router.push("../screens/CalendarSchedulePage");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessScreen, navigation]);

  // Allows the display of calendar history
  useEffect(() => {
    const loadStoredCalendarIds = async () => {
      try {
        const stored = await AsyncStorage.getItem('calendarIds');
        if (stored) {
          setStoredCalendarIds(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading stored calendar IDs", error);
      }
    };

    loadStoredCalendarIds();
  }, []);

  if (showSuccessScreen) {
    return (
      <View style={styles.successContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
          resizeMode="contain"
          testID="logo"
        />
        <Text style={styles.successTitle}>
          Successful Connection to Google Calendar ID: {calendarId}
        </Text>
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        <Text style={styles.successSubtitle}>Redirecting to Events Page...</Text>
      </View>
    );
  }



  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20}>
      <LayoutWrapper>
      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.headerButtons}>
          <Ionicons name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/SettingsPage')} style={styles.headerButtons}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>
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
              {storedCalendarIds.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.subtitle}>Calendars History:</Text>
                  {storedCalendarIds.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyItem}
                      onPress={() => setCalendarId(item.id)}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="timer-outline" size={20} color="#888" style={{ marginRight: 6 }} />
                        <Text style={styles.historyText}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

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
                style={styles.clearHistoryButton}
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem("calendarIds"); // clear ID from storage
                    setStoredCalendarIds([]); // immediately clear from UI, no more history is displayed on screen
                  } catch (err) {
                    console.error("Failed to clear calendar history", err);
                  }
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#888" style={{ marginRight: 6 }} />
                <Text style={styles.clearHistoryText}>Clear History</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </ScrollView>
      </LayoutWrapper>
    </KeyboardAvoidingView>
  );
}

// Helper function to store events in a CSV file
const convertEventsToCSV = (events) => {
  const headers = ["Title", "Start", "End", "Location", "CalendarID"];

  const rows = events.map(event => [
    event.summary || "No Title",
    event.start?.dateTime || event.start?.date || "",
    event.end?.dateTime || event.end?.date || "",
    event.location || "",
    event.htmlLink || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  return csvContent;

};