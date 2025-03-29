import React from "react";
import { Switch, Text, View, StyleSheet, Image } from 'react-native';
import { FeedbackProvider, useFeedback } from '../context/FeedbackContext';
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const {
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    blackAndWhiteEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech,
    toggleBlackAndWhite,
  } = useFeedback(previousState => !previousState);

  return (
    <LayoutWrapper>
      <HeaderButtons />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Feedback</Text>

        <View style={styles.settingRow}>
          <Ionicons name="invert-mode-outline" size={24} color={blackAndWhiteEnabled ? "green" : "black"} />
          <Text style={styles.settingLabel}>Black & White Mode</Text>
          <Switch
            value={blackAndWhiteEnabled}
            onValueChange={toggleBlackAndWhite}
            trackColor={{ false: '#b0b0b0', true: 'red' }}
            thumbColor={'grey'}
            style={styles.switch}
          />
        </View>

        <View style={styles.settingRow}>
          <Image style={styles.vibration_image}
            source={require('../../assets/images/vibration_icon.png')}
            resizeMode="contain"
          />
          <Text style={styles.settingLabel}>Vibration Feedback</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: '#b0b0b0', true: 'red' }}
            thumbColor={'grey'}
            style={styles.switch}
          />
        </View>

        <View style={styles.settingRow}>
          <Ionicons name={soundEnabled ? "volume-high-outline" : "volume-mute-outline"} size={24} color='black' />
          <Text style={styles.settingLabel}>Sound Feedback</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: '#b0b0b0', true: 'red' }}
            thumbColor={'grey'}
            style={styles.switch}
          />
        </View>

        <View style={styles.settingRow}>
          <Ionicons name={speechEnabled ? "mic-outline" : "mic-off-outline"} size={24} color='black' />
          <Text style={styles.settingLabel}>Speech Feedback</Text>
          <Switch
            value={speechEnabled}
            onValueChange={toggleSpeech}
            trackColor={{ false: '#b0b0b0', true: 'red' }}
            thumbColor={'grey'}
            style={styles.switch}
          />
        </View>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subtitle: {
    color: "#666",
    fontSize: 20,
    marginBottom: 10
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,  // Add shadow effect for elevation
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: "#333"
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    right: 10,
  },
  vibration_image: {
    width: 30,
    height: 30,
    marginRight: 12,
  }
});
