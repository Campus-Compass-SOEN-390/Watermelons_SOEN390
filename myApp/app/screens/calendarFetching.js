import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert , Modal} from "react-native";
import Constants from "expo-constants";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { calendarFetchingStyles as styles } from '../styles/CalendarFetchingStyles.js';


export default function CalendarFetching() {
    const [calendarId, setCalendarId] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={20} 
  >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
             
     
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
                  <TouchableOpacity
                      style={styles.connectButton}
                      onPress={() => {
                          console.log("Opening modal");
                          setModalVisible(true);
                      }}
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
      </View>
      </ScrollView>
  </KeyboardAvoidingView>
  );
}

