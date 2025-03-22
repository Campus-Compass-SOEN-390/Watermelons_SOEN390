import { Text, View, TouchableOpacity, ScrollView , Alert} from "react-native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from '../styles/GoogleScheduleStyles';
import { useRouter } from 'expo-router';
import LayoutWrapper from "../components/LayoutWrapper";
import * as FileSystem from 'expo-file-system';
import HeaderButtons from "../components/HeaderButtons";
import Head from "next/head";

export default function CalendarSchedulePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDayIndex = selectedDate.getDay(); // Sunday = 0

  const [schedule, setSchedule] = useState([]);
  const [nextClass, setNextClass] = useState(null);

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

  useEffect(() => {
    findNextClassInfo();
  }, [schedule]);

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
  const findNextClass = () => {
    const now = new Date();
    const currentTime = now.getTime();
    
    console.log("Current time:", now.toLocaleString());
    
    // Get all classes for today and future dates
    const upcomingClasses = schedule.filter(item => {
      const classDate = new Date(item.date);
      const [startTime] = item.time.split(' - ');
      const [hours, minutes] = startTime.split(':');
      const classTime = new Date(classDate);
      classTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      console.log("Checking class:", {
        course: item.course,
        date: classDate.toLocaleDateString(),
        time: startTime,
        classTimestamp: classTime.getTime(),
        currentTimestamp: currentTime,
        isUpcoming: classTime.getTime() >= currentTime
      });
      
      if (classDate < now && classDate.getDate() !== now.getDate()) {
        return false;
      }
      
      return classTime.getTime() >= currentTime;
    });
    
    console.log("Found upcoming classes:", upcomingClasses);
  
    upcomingClasses.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const [startTimeA] = a.time.split(' - ');
      const [startTimeB] = b.time.split(' - ');
      const [hoursA, minutesA] = startTimeA.split(':');
      const [hoursB, minutesB] = startTimeB.split(':');
      
      // Set the hours and minutes for comparison
      dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);
      dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);
      
      console.log("Comparing times:", {
        classA: { course: a.course, time: dateA.toLocaleString() },
        classB: { course: b.course, time: dateB.toLocaleString() }
      });
      
      return dateA.getTime() - dateB.getTime();
    });
      
  
    if (upcomingClasses.length > 0) {
      console.log("Selected next class:", {
        course: upcomingClasses[0].course,
        location: upcomingClasses[0].location,
        time: upcomingClasses[0].time,
        date: upcomingClasses[0].date
      });
      handleGetDirections(upcomingClasses[0].location);
    } else {
      console.log("No upcoming classes found");
      Alert.alert("No Upcoming Classes", "There are no upcoming classes on your schedule. Please add classes or select a different schedule.");
    }
  };

  const findNextClassInfo = () => {
    const now = new Date();
    const currentTime = now.getTime();
    
    const upcomingClasses = schedule.filter(item => {
      const classDate = new Date(item.date);
      const [startTime] = item.time.split(' - ');
      const [hours, minutes] = startTime.split(':');
      const classTime = new Date(classDate);
      classTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      if (classDate < now && classDate.getDate() !== now.getDate()) {
        return false;
      }
      
      return classTime.getTime() >= currentTime;
    });

    upcomingClasses.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const [startTimeA] = a.time.split(' - ');
      const [startTimeB] = b.time.split(' - ');
      const [hoursA, minutesA] = startTimeA.split(':');
      const [hoursB, minutesB] = startTimeB.split(':');
      
      dateA.setHours(parseInt(hoursA), parseInt(minutesA), 0, 0);
      dateB.setHours(parseInt(hoursB), parseInt(minutesB), 0, 0);
      
      return dateA.getTime() - dateB.getTime();
    });

    setNextClass(upcomingClasses[0] || null);
  };

  return (
    <LayoutWrapper>
      {/* Top Navigation */}
      <HeaderButtons/>
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
      <View style={styles.nextClassContainer}>
        {nextClass && (
          <>
            <Text style={styles.nextClassInfoText}>
              {`Your next class is: ${nextClass.course}, ${
                new Date(nextClass.date).toDateString() === new Date().toDateString()
                  ? 'today'
                  : new Date(nextClass.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })
              } ${nextClass.time} at ${nextClass.location}`}
            </Text>
            <TouchableOpacity
              style={styles.nextClassDirections}
              onPress={findNextClass}
              testID="get-directions-button"
            >
              <MaterialIcons name="directions" size={24} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.nextClassButtonText}>
                Get directions to next class
              </Text>
            </TouchableOpacity>
          </>
        )}
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
          testID="prev-day-button"
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
          testID="today-button"
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
          testID="next-day-button"
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