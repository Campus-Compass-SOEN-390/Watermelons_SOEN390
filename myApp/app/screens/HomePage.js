import React, { useEffect, useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { createHomePageStyles } from "../styles/HomePageStyles.js";
import RNUxcam from "react-native-ux-cam";
import { ThemeContext } from "../context/ThemeContext";
import { useButtonInteraction } from "../hooks/useButtonInteraction";
import HeaderButtons from "../components/HeaderButtons.js";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { handleButtonPress } = useButtonInteraction();

  // Create styles based on current theme
  const styles = createHomePageStyles(theme);

  const handleNavigationPress = (route, label) => {
    RNUxcam.logEvent(`${label} Button Pressed`);
    handleButtonPress(route, label);
    router.push(route);
  };
   
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <View style={styles.container}>
      {/* Use HeaderButtons component which includes theme toggle */}
      {/* Header buttons */}
      <View
        style={{
          marginBottom: 20,
          marginTop: 40,
        }}
      >
      </View>

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
            onPress={() =>
              handleNavigationPress("/(tabs)/map?type=sgw", "SGW Campus")
            }
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              SGW Campus
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            testID="loyolaButton"
            onPress={() =>
              handleNavigationPress("/(tabs)/map?type=loy", "Loyola Campus")
            }
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
            onPress={() =>
              handleNavigationPress(
                "/screens/ShuttleScheduleScreen",
                "Shuttle Bus Schedule"
              )
            }
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Shuttle Bus Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleNavigationPress("(tabs)/interest-points", "Interest Points")
            }
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
            onPress={() =>
              handleNavigationPress(
                "screens/CalendarFetching",
                "Connect Calendars"
              )
            }
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
    </SafeAreaView>
  );
}
