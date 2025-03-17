import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

export default function CalendarFetching() {
    const [calendarId, setCalendarId] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_KEY  = process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.apiKey;

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
            
            if (data.items) {
                setEvents(data.items);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching calendar events:", error);
        }

        setLoading(false);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Enter Google Calendar ID:
            </Text>
            <TextInput
                style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                }}
                placeholder="Paste Calendar ID here"
                value={calendarId}
                onChangeText={setCalendarId}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: "#007bff",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                }}
                onPress={fetchCalendarEvents}
                disabled={loading}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                    {loading ? "Fetching..." : "Fetch Events"}
                </Text>
            </TouchableOpacity>

            {/* Display Fetched Events */}
            {events.length > 0 && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Upcoming Events</Text>
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10, borderBottomWidth: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.summary}</Text>
                                <Text>{item.start?.dateTime || item.start?.date}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
