import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from '../styles/GoogleScheduleStyles';
import { useRouter } from 'expo-router';
import LayoutWrapper from "../components/LayoutWrapper";
import * as FileSystem from 'expo-file-system';

export default function CalendarSchedulePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDayIndex = selectedDate.getDay(); // Sunday = 0

  const [schedule, setSchedule] = useState([]);

  // Will allow to display event on proper date
  const filteredSchedule = schedule.filter(
    item => item.date === selectedDate.toDateString()
  );

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    const readCSV = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + "calendar_events.csv";
        const csvData = await FileSystem.readAsStringAsync(fileUri);
        const parsedData = parseCSV(csvData);
        setSchedule(parsedData);
      } catch (error) {
        console.error("Error reading CSV:", error);
      }
    };

    readCSV();
  }, []);


  // Parse CSV data for display
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1);

    return rows.map(row => {
      const values = row.split(",");
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || "";
      });

      const startDate = new Date(obj["Start"]);
      const endDate = new Date(obj["End"]);

      const formatTime = (datetime) => {
        const date = new Date(datetime);
        if (isNaN(date.getTime())) return datetime;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      };

      return {
        course: obj["Title"],
        location: obj["Location"],
        time: `${formatTime(startDate)} - ${formatTime(endDate)}`,
        date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toDateString(),
      };
    });
  };
  const handleGetDirections = (location) => {
    console.log("Getting directions to:", location);    
      
    // Navigate to map with destination parameter
    router.push({
      pathname: '/(tabs)/map',
      params: {
        destinationString: location  // Pass the location string (H967)
      }
    });
  };

  return (
    <LayoutWrapper>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.headerButtons}>
          <Ionicons name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/SettingsPage')} style={styles.headerButtons}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Days Navigation */}
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text
            key={index}
            style={[
              styles.dayText,
              index === selectedDayIndex && styles.highlightedDay,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Schedule Header */}
      <Text style={styles.scheduleTitle}>Schedule</Text>

      {/* Schedule Cards */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      {filteredSchedule.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.courseText}>{item.course}</Text>
            <Text>{item.location}</Text>
            <Text>{item.time}</Text>
          </View>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={() => handleGetDirections(item.location)}
          >
            <MaterialIcons name="directions" size={28} color="white" />
          </TouchableOpacity>
        </View>
      ))}
      </ScrollView>

      {/* Bottom Navigation Buttons */}
      <View style={styles.todayButtonContainer}>
        <TouchableOpacity
          style={styles.todayNavButton}
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.setDate(selectedDate.getDate() - 1))
            )
          }
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.todayLabelWrapper}
          onPress={() => setSelectedDate(new Date())}
        >
          <Text style={styles.todayText}>
            {selectedDate.toDateString() !== new Date().toDateString()
              ? selectedDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : "Today"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.todayNavButton}
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.setDate(selectedDate.getDate() + 1))
            )
          }
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </LayoutWrapper>
  );
}