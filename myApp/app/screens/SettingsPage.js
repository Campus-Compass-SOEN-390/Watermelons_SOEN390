import React, { useState } from "react";
import { Switch, Text, View, Image } from 'react-native';
import { useFeedback } from '../context/FeedbackContext';
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";
import { Ionicons } from "@expo/vector-icons";
import styles from '../styles/SettingsPageStyles';

export default function Settings() {
  const {
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech,
  } = useFeedback();

  const [blackMode, setBlackMode] = useState(false);

  return (
    <LayoutWrapper>
      <HeaderButtons />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Feedback</Text>

        <View style={styles.settingRow}>
          <Ionicons name="invert-mode-outline" size={24} color='black' />
          <Text style={styles.settingLabel}>Black & White Mode</Text>
          <Switch
            value={blackMode}
            onValueChange={() => setBlackMode(prevState => !prevState)}
            trackColor={{ false: '#b0b0b0', true: 'red' }}
            thumbColor={'grey'}
            style={styles.switch}
            testID="black-mode-toggle"
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
            testID="vibration-toggle"
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
            testID="sound-toggle"
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
            testID="speech-toggle"
          />
        </View>
      </View>
    </LayoutWrapper>
  );
}