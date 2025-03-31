import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchShuttleScheduleByDay } from "../api/shuttleSchedule";
import moment from "moment";
import RNUxcam from "react-native-ux-cam";
import { ThemeContext } from "../context/ThemeContext";
import { createShuttleScheduleStyles } from "../styles/ShuttleScheduleStyles";
import HeaderButtons from "../components/HeaderButtons";

export default function ShuttleScheduleScreen() {
  // Get theme context - this ensures the same context is used across the app
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Create theme-aware styles
  const styles = createShuttleScheduleStyles({
    theme: {
      darkBg: "#333333",
      darkText: "#FFFFFF",
      darkSecondaryText: "rgba(255, 255, 255, 0.7)",
    },
    isDarkMode,
  });

  const navigation = useNavigation();
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [nextBus, setNextBus] = useState(null);
  const [campus, setCampus] = useState("SGW"); // Toggle between SGW and LOY

  // Add this useEffect hook for UXCam screen tagging
  useEffect(() => {
    // Tag this screen in UXCam
    RNUxcam.tagScreenName("ShuttleScheduleScreen");
  }, []);

  useEffect(() => {
    const loadSchedule = async () => {
      const today = moment().format("dddd");
      console.log(`Fetching schedule for ${today}...`);

      // 🚨 Prevent fetching for weekends
      if (today === "Saturday" || today === "Sunday") {
        console.warn("No schedule available on weekends.");
        setError("❌ No shuttle service on weekends.");
        return;
      }

      try {
        const data = await fetchShuttleScheduleByDay(today);
        if (!data) {
          throw new Error("No schedule data available.");
        }

        console.log("Schedule data loaded:", data);
        setSchedule(data);
      } catch (err) {
        console.error("API Fetch Error:", err.message);
        setError("❌ Unable to load shuttle schedule. Please try again later.");
      }
    };

    loadSchedule();
  }, []);

  // Compute next available bus based on selected campus without re-fetching
  useEffect(() => {
    if (!schedule) return;

    const currentTime = moment();
    let nextAvailableBus = null;

    for (const time of schedule[campus]) {
      if (moment(time, "HH:mm").isAfter(currentTime)) {
        nextAvailableBus = time;
        break;
      }
    }

    setNextBus(nextAvailableBus);
  }, [schedule, campus]); // Runs when schedule is loaded OR campus changes

  // Function to handle warning button click
  const handleWarningPress = () => {
    const todayDate = moment().format("YYYY-MM-DD");

    if (todayDate === "2025-02-28") {
      Alert.alert(
        "Bus Delay Warning",
        "⚠️ No service on February 28, 2025. Buses may be delayed."
      );
    } else {
      Alert.alert("Bus Status", "✅ No expected bus delays.");
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        {/* Add HeaderButtons component to include theme toggle */}
        <HeaderButtons />
        {/* 🔹 Keep Header with Back Button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shuttle Bus Schedule</Text>
        </View>
        {/* 🔹 Display Weekend or Error Message */}
        <Text style={styles.error}>
          {error.includes("weekends")
            ? "🚍 No shuttle service on weekends. See you Monday!"
            : error}
        </Text>
      </SafeAreaView>
    );
  }

  // 🔹 Check if schedule is null (LOADING STATE)
  if (!schedule) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        {/* Add HeaderButtons component to include theme toggle */}
        <HeaderButtons />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.tableText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {/* Add HeaderButtons component to include theme toggle */}
      <HeaderButtons />
      {/* Header with Back Button & Warning Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shuttle Bus Schedule</Text>

        {/* Warning Button */}
        <TouchableOpacity
          onPress={() => {
            RNUxcam.logEvent("Shuttle Home Button Pressed");
            handleWarningPress();
          }}
          style={styles.warningButton}
        >
          <Text style={styles.warningIcon}>⚠</Text>
        </TouchableOpacity>
      </View>
      {/* Campus Toggle Button */}
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setCampus(campus === "SGW" ? "LOY" : "SGW")}
      >
        <Text style={styles.switchText}>
          {campus === "SGW" ? "SGW ➜ LOY" : "LOY ➜ SGW"}
        </Text>
      </TouchableOpacity>
      {/* Schedule Table with Vertical Divider */}
      <ScrollView style={styles.scheduleContainer}>
        <Text style={styles.scheduleHeader}>
          Schedule in effect Monday to Friday
        </Text>

        <View style={styles.table}>
          <Text style={styles.tableHeader}>AM</Text>
          <View style={styles.verticalDivider}></View>
          <Text style={styles.tableHeader}>PM</Text>
        </View>

        {splitSchedule(schedule[campus]).map(({ am, pm }, index) => (
          <View key={`${am}-${pm}-${index}`} style={styles.tableRow}>
            <Text
              style={[styles.tableText, am === nextBus && styles.highlight]}
            >
              {am || ""}
            </Text>
            <View style={styles.verticalDividerDashed}></View>
            <Text
              style={[styles.tableText, pm === nextBus && styles.highlight]}
            >
              {pm || ""}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Function to split schedule into AM and PM
const splitSchedule = (times) => {
  const amTimes = times.filter((time) => moment(time, "HH:mm").hour() < 12);
  const pmTimes = times.filter((time) => moment(time, "HH:mm").hour() >= 12);

  const maxLength = Math.max(amTimes.length, pmTimes.length);
  return Array.from({ length: maxLength }, (_, i) => ({
    am: amTimes[i] || "",
    pm: pmTimes[i] || "",
  }));
};
