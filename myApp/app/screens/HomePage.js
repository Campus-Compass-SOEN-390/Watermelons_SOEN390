import { useEffect, React, useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { homepageStyles as baseStyles } from "../styles/HomePageStyles.js";
import RNUxcam from "react-native-ux-cam";
import { ThemeContext } from "../context/ThemeContext";

export default function HomePage() {
  const router = useRouter();
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Add this useEffect hook for UXCam screen tagging
  useEffect(() => {
    // Tag this screen in UXCam
    RNUxcam.tagScreenName("HomePage");
  }, []);

  // Create theme-aware styles by merging base styles with theme-specific overrides
  const styles = {
    ...baseStyles,
    // Override specific styles based on theme
    buttonsContainer: {
      ...baseStyles.buttonsContainer,
      backgroundColor: theme.cardBackground,
    },
    title: {
      ...baseStyles.title,
      color: theme.text,
    },
    button: {
      ...baseStyles.button,
      backgroundColor: theme.buttonBackground,
    },
    buttonText: {
      ...baseStyles.buttonText,
      color: theme.buttonText,
    },
    googleButton: {
      ...baseStyles.googleButton,
      backgroundColor: theme.buttonBackground,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            <Text style={styles.buttonText}>SGW Campus</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            testID="loyolaButton"
            onPress={() => {
              RNUxcam.logEvent("Loyola Campus Button Pressed");
              router.push("/(tabs)/map?type=loy");
            }}
          >
            <Text style={styles.buttonText}>Loyola Campus</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            testID="shuttleScheduleButton"
            onPress={() => router.push("/screens/ShuttleScheduleScreen")}
          >
            <Text style={styles.buttonText}>Shuttle Bus Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              RNUxcam.logEvent("Interest point Button Pressed");
              router.push("(tabs)/interest-points");
            }}
            testID="interestButton"
          >
            <Text style={styles.buttonText}>Interest Points</Text>
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
            <Text style={styles.buttonText}>Connect Calendars</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
