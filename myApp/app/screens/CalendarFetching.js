import React, { useState, useEffect, useCallback, useContext } from "react";
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
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Constants from "expo-constants";
import { createCalendarFetchingStyles } from "../styles/CalendarFetchingStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import MonthPicker from "../components/MonthPicker";
import { ThemeContext } from "../context/ThemeContext";
import { useButtonInteraction } from "../hooks/useButtonInteraction";

export default function CalendarFetching() {
  // Get theme context
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Create theme-aware styles
  const styles = createCalendarFetchingStyles({
    theme: {
      darkBg: "#333333",
      darkCard: "#333333",
      darkText: "#FFFFFF",
      darkSecondaryText: "rgba(255, 255, 255, 0.7)",
      darkBorder: "#555555",
      darkInput: "rgba(51, 51, 51, 0.8)",
    },
    isDarkMode,
  });

  const navigation = useNavigation();
  const router = useRouter();
  const { handleButtonPress } = useButtonInteraction();

  const [calendarId, setCalendarId] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [storedCalendarIds, setStoredCalendarIds] = useState([]);
  const [monthsAhead, setMonthsAhead] = useState("1");

  const API_KEY =
    process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

  // Add this useEffect hook for UXCam screen tagging
  // useEffect(() => {
  //   // Tag this screen in UXCam
  //   RNUxcam.tagScreenName("Calendar Fetching");
  // }, []);

  const fetchCalendarEvents = useCallback(async () => {
    if (!calendarId.trim()) {
      Alert.alert("Invalid", "Please enter a valid Calendar ID");
      return;
    }

    setLoading(true);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const timeMin = oneMonthAgo.toISOString();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + parseInt(monthsAhead || "1"));
    const timeMax = futureDate.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.error) {
        Alert.alert("Error", `API Error: ${data.error.message}`);
      } else if (data.items) {
        setEvents(data.items);

        const csvContent = convertEventsToCSV(data.items);
        const fileUri = FileSystem.documentDirectory + "calendar_events.csv";

        await FileSystem.writeAsStringAsync(fileUri, csvContent);
        console.log("CSV saved to:", fileUri);

        try {
          if (!calendarId || !data.summary) return;

          const newEntry = {
            id: calendarId,
            name: data.summary || "Unlabelled Calendar",
          };
          const existingEntries = [...storedCalendarIds];

          const isDuplicate = existingEntries.some(
            (entry) => entry.id === calendarId
          );

          if (!isDuplicate) {
            const updatedCalendarIds = [newEntry, ...existingEntries];
            setStoredCalendarIds(updatedCalendarIds);
            await AsyncStorage.setItem(
              "calendarIds",
              JSON.stringify(updatedCalendarIds)
            );
          }
        } catch (err) {
          console.error("Failed to save calendar ID and name", err);
        }

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
  }, [calendarId, API_KEY, monthsAhead, storedCalendarIds]);

  useEffect(() => {
    if (showSuccessScreen) {
      const timer = setTimeout(() => {
        router.push("../screens/CalendarSchedulePage");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessScreen, navigation, router]);

  useEffect(() => {
    const loadStoredCalendarIds = async () => {
      try {
        const stored = await AsyncStorage.getItem("calendarIds");
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
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#fff" : "#922338"}
          style={{ marginVertical: 20 }}
        />
        <Text style={styles.successSubtitle}>
          Redirecting to Events Page...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      }}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Main Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          <View style={styles.container}>
            <View style={styles.redContainer}>
              <View style={styles.whiteContainer}>
                <Text style={styles.title}>Enter your Google Calendar ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Paste Calendar ID here"
                  value={calendarId}
                  onChangeText={setCalendarId}
                  placeholderTextColor={styles.placeholderTextColor.color}
                />

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.subtitle}>Calendars History:</Text>
                  <View style={styles.calendarHistoryContainer}>
                    {storedCalendarIds.length === 0 ? (
                      <Text style={styles.noHistoryText}>No history yet.</Text>
                    ) : (
                      <ScrollView>
                        {storedCalendarIds.map((item) => (
                          <TouchableOpacity
                            key={item.id} // Use unique identifier instead of index
                            style={styles.historyItem}
                            onPress={() => {
                              handleButtonPress(null, item.name);
                              setCalendarId(item.id);
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Ionicons
                                name="timer-outline"
                                size={20}
                                color={styles.iconColor}
                                style={{ marginRight: 6 }}
                              />
                              <Text style={styles.historyText}>
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </View>

                {/* Months Ahead Input */}
                <View style={{ marginTop: 10, marginBottom: 60 }}>
                  <MonthPicker
                    monthsAhead={monthsAhead}
                    setMonthsAhead={setMonthsAhead}
                    styles={styles}
                    isDarkMode={isDarkMode}
                    theme={theme}
                  />
                </View>

                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => {
                    handleButtonPress(null, "Connecting to Calendar");
                    fetchCalendarEvents();
                  }}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Connecting..." : "Connect"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearHistoryButton}
                  onPress={async () => {
                    handleButtonPress(null, "Clear History");
                    try {
                      await AsyncStorage.removeItem("calendarIds");
                      setStoredCalendarIds([]);
                    } catch (err) {
                      console.error("Failed to clear calendar history", err);
                    }
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={10}
                    color={styles.iconColor}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.clearHistoryText}>Clear History</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const convertEventsToCSV = (events) => {
  const headers = ["Title", "Start", "End", "Location", "CalendarID"];

  const rows = events.map((event) => [
    event.summary || "No Title",
    event.start?.dateTime || event.start?.date || "",
    event.end?.dateTime || event.end?.date || "",
    event.location || "",
    event.htmlLink || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
};
export { convertEventsToCSV };