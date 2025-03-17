import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function CalendarFetching() {
    const [calendarId, setCalendarId] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_KEY = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;




    const fetchCalendarEvents = async () => {
        if (!calendarId.trim()) {
            alert("Please enter a valid Calendar ID");
            return;
        }

        setLoading(true);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.error) {
                // Show error alert if the API response contains an error
                Alert.alert("Error", `API Error: ${data.error.message}`);
            } else {
                // If events are found, set them in the state
                if (data.items) {
                    setEvents(data.items);
                    Alert.alert("Success", "Events fetched successfully!");
                } else {
                    setEvents([]);
                    Alert.alert("No Events", "No upcoming events found.");
                }
            }
            console.log("API Response:", data); // Log the full API response for debugging
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            Alert.alert("Error", "Something went wrong while fetching the events.");
        }

        setLoading(false);
    };

    return (
      <View style={styles.container}>
          <View style={styles.redContainer}>
              <View style={styles.whiteContainer}>
                  <Text style={styles.title}>
                      Enter your Google Calendar ID
                  </Text>
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

                  {events.length > 0 && (
                      <View style={styles.eventsContainer}>
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
                      </View>
                  )}
              </View>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      height:'90%',
      paddingTop:'40%',
      paddingBottom:'60%',
  },
  redContainer: {
      flex: 1,
      backgroundColor: '#922338',
      margin: 20,
      padding:10,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  whiteContainer: {
      backgroundColor: '#FFFFFF',
      width: '90%',
      height:'90%',
      padding: 20,
      borderRadius: 8,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
  },
  input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
  },
  connectButton: {
      backgroundColor: '#922338',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
      width:100,
      alignSelf:'center',
  },
  buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  eventsContainer: {
      marginTop: 20,
  },
  eventsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
  },
  eventItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
  },
  eventTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
  },
  eventDate: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
  },
});