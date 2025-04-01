import React, { useState } from "react";
import { Switch, Text, View, Image, Platform } from "react-native";
import { useFeedback } from "../context/FeedbackContext";
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/SettingsPageStyles";

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
      {/* Header buttons */}
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 10 : 5,
          marginBottom: 10,
          marginTop: 40,
        }}
      >
        <HeaderButtons />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingRow}>
          <Ionicons name="invert-mode-outline" size={24} color="black" />
          <Text style={styles.settingLabel}>Black & White Mode</Text>
          <Switch
            value={blackMode}
            onValueChange={() => setBlackMode((prevState) => !prevState)}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={"grey"}
            style={styles.switch}
            testID="black-mode-toggle"
          />
        </View>

        <View style={styles.settingRow}>
          <Image
            style={styles.vibration_image}
            source={require("../../assets/images/vibration_icon.png")}
            resizeMode="contain"
          />
          <Text style={styles.settingLabel}>Vibration Feedback</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={"grey"}
            style={styles.switch}
            testID="vibration-toggle"
          />
        </View>

        <View style={styles.settingRow}>
          <Ionicons
            name={soundEnabled ? "volume-high-outline" : "volume-mute-outline"}
            size={24}
            color="black"
          />
          <Text style={styles.settingLabel}>Sound Feedback</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={"grey"}
            style={styles.switch}
            testID="sound-toggle"
          />
        </View>

        <View style={styles.settingRow}>
          <Ionicons
            name={speechEnabled ? "mic-outline" : "mic-off-outline"}
            size={24}
            color="black"
          />
          <Text style={styles.settingLabel}>Speech Feedback</Text>
          <Switch
            value={speechEnabled}
            onValueChange={toggleSpeech}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={"grey"}
            style={styles.switch}
            testID="speech-toggle"
          />
        </View>
      </View>
    </LayoutWrapper>
  );
}
