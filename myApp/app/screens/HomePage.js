import { useEffect, React, useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { createHomePageStyles } from "../styles/HomePageStyles.js";
import RNUxcam from "react-native-ux-cam";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage() {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Create styles based on current theme
  const styles = createHomePageStyles(theme);

  // Add this useEffect hook for UXCam screen tagging
  useEffect(() => {
    // Tag this screen in UXCam
    RNUxcam.tagScreenName("HomePage");
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleTheme}
        testID="themeToggleButton"
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={22}
          color={theme.buttonText}
        />
      </TouchableOpacity>

      <Image
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
        resizeMode="contain"
        testID="logo"
      />
      <View style={styles.buttonsContainer}>
        <Text style={styles.title}>Getting around campus</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            testID="sgwButton"
            onPress={() => {
              RNUxcam.logEvent("SGW Campus Button Pressed");
              router.push("/(tabs)/map?type=sgw");
            }}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              SGW Campus
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            testID="loyolaButton"
            onPress={() => {
              RNUxcam.logEvent("Loyola Campus Button Pressed");
              router.push("/(tabs)/map?type=loy");
            }}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Loyola Campus
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            testID="shuttleScheduleButton"
            onPress={() => router.push("/screens/ShuttleScheduleScreen")}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Shuttle Bus Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              RNUxcam.logEvent("Interest point Button Pressed");
              router.push("(tabs)/interest-points");
            }}
            testID="interestButton"
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Interest Points
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Text style={styles.title}>View My Calendar</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            testID="calendarfetchbutton"
            onPress={() => {
              RNUxcam.logEvent("Google Calendar Button Pressed");
              router.push("screens/CalendarFetching");
            }}
          >
            <Image
              source={require("../../assets/images/google_logo.png")}
              style={styles.icon}
              testID="googleIcon"
            />
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Connect Calendars
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
