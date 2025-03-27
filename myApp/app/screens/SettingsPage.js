import React from "react";
import { Switch, Text, View, StyleSheet } from 'react-native';
import { useFeedback } from '../context/FeedbackContext';
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";

export default function Settings() {
  const { 
    vibrationEnabled, 
    soundEnabled, 
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech
  } = useFeedback();

  return (
    <LayoutWrapper>
      <HeaderButtons />
      <View style={styles.container}>
        <Text style={styles.title}>Feedback Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={toggleVibration}
            testID="vibration-toggle"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            testID="sound-toggle"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Speech</Text>
          <Switch
            value={speechEnabled}
            onValueChange={toggleSpeech}
            testID="speech-toggle"
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  settingLabel: {
    fontSize: 16
  }
});

