import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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
import HeaderButtons from "../components/HeaderButtons.js";
import MonthPicker from '../components/MonthPicker';



export default function CalendarFetching() {
  const navigation = useNavigation();
  const router = useRouter();

  const [calendarId, setCalendarId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  // Allows the storage of calendar id history for future selection
  const [storedCalendarIds, setStoredCalendarIds] = useState([]);
  const [monthsAhead, setMonthsAhead] = useState("1"); // default 1 month

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

  const fetchCalendarEvents = useCallback(async () => {
    if (!calendarId.trim()) {
      Alert.alert("Invalid", "Please enter a valid Calendar ID");
      return;
    }
  
    setLoading(true);
  
    const { timeMin, timeMax } = calculateTimeRange(monthsAhead);
    const url = buildCalendarApiUrl(calendarId, API_KEY, timeMin, timeMax);
  
    try {
      let response = await fetch(url);
      let data = await response.json();
  
      if (data.error) {
        Alert.alert("Error", `API Error: ${data.error.message}`);
      } else if (data.items) {
        setEvents(data.items);
        await handleCSVExport(data.items);
        await saveCalendarIdIfNeeded(calendarId, data.summary);
        setShowSuccessScreen(true);
      } else {
        setEvents([]);
        Alert.alert("No Events", "No upcoming events found.");
      }
  
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      Alert.alert("Error", "Something went wrong while fetching the events.");
    }
  
    setLoading(false);
  }, [calendarId, API_KEY]);
  
  // Helper Functions
  const calculateTimeRange = (monthsAhead = "1") => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + parseInt(monthsAhead));
  
    return { timeMin: oneMonthAgo.toISOString(), timeMax: futureDate.toISOString() };
  };
  
  const buildCalendarApiUrl = (calendarId, API_KEY, timeMin, timeMax) =>
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
  
  const handleCSVExport = async (items) => {
    const csvContent = convertEventsToCSV(items);
    const fileUri = FileSystem.documentDirectory + "calendar_events.csv";
    await FileSystem.writeAsStringAsync(fileUri, csvContent);
    console.log("CSV saved to:", fileUri);
  };
  
  const saveCalendarIdIfNeeded = async (calendarId, calendarSummary) => {
    if (!calendarId || !calendarSummary) return;
  
    const newEntry = { id: calendarId, name: calendarSummary || "Unlabelled Calendar" };
    const existingEntries = [...storedCalendarIds];
  
    if (!existingEntries.some(entry => entry.id === calendarId)) {
      const updatedCalendarIds = [newEntry, ...existingEntries];
      setStoredCalendarIds(updatedCalendarIds);
      await AsyncStorage.setItem("calendarIds", JSON.stringify(updatedCalendarIds));
    }
  };

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
        <HeaderButtons />
        {/* Events Scroll */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}
        >

          <View style={styles.container}>
            <View style={styles.redContainer}>
              <View style={styles.whiteContainer}>
                {/* Calendar ID Input */}
                <Text style={styles.title}>Enter your Google Calendar ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Paste Calendar ID here"
                  value={calendarId}
                  onChangeText={setCalendarId}
                  placeholderTextColor="#666"
                />

                {/* Calendar History */}
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.subtitle}>Calendars History:</Text>
                  <View style={{ height: 100, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 5 }}>
                    {storedCalendarIds.length === 0 ? (
                      <Text style={{ color: '#888', fontStyle: 'italic' }}>No history yet.</Text>
                    ) : (
                      <ScrollView>
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
                      </ScrollView>
                    )}
                  </View>
                </View>

                {/* Months Ahead Input */}
                <View style={{ marginTop: 10 }}>
                  <MonthPicker
                    monthsAhead={monthsAhead}
                    setMonthsAhead={setMonthsAhead}
                    styles={styles}
                  />
                </View>

                {/* Connect Button */}
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={fetchCalendarEvents}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Connecting..." : "Connect"}
                  </Text>
                </TouchableOpacity>

                {/* Clear History Button */}
                <TouchableOpacity
                  style={styles.clearHistoryButton}
                  onPress={async () => {
                    try {
                      await AsyncStorage.removeItem("calendarIds");
                      setStoredCalendarIds([]);
                    } catch (err) {
                      console.error("Failed to clear calendar history", err);
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={10} color="#888" style={{ marginRight: 6 }} />
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