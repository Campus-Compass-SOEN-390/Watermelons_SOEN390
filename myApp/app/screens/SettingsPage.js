import React, { useState, useContext } from "react";
import { Switch, Text, View, Image, Platform, StatusBar } from "react-native";
import { useFeedback } from "../context/FeedbackContext";
import { ThemeContext } from "../context/ThemeContext";
import HeaderButtons from "../components/HeaderButtons";
import { Ionicons } from "@expo/vector-icons";
import { createSettingsPageStyles } from "../styles/SettingsPageStyles";

export default function Settings() {
  // Get theme context
  const { isDarkMode } = useContext(ThemeContext);

  // Create theme-aware styles
  const themedStyles = createSettingsPageStyles({
    theme: {
      darkBg: "#333333",
      darkText: "#FFFFFF",
    },
    isDarkMode,
  });

  const {
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech,
  } = useFeedback();

  const [blackMode, setBlackMode] = useState(false);

  // Get icon color based on theme
  const iconColor = isDarkMode ? "#FFFFFF" : "#000000";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      }}
    >
      {/* Status bar */}
      <StatusBar barStyle="light-content" />

      <View style={themedStyles.container}>
        <Text style={themedStyles.title}>Settings</Text>

        <View style={themedStyles.settingRow}>
          <Ionicons name="invert-mode-outline" size={24} color={iconColor} />
          <Text style={themedStyles.settingLabel}>Black & White Mode</Text>
          <Switch
            value={blackMode}
            onValueChange={() => setBlackMode((prevState) => !prevState)}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
            style={themedStyles.switch}
            testID="black-mode-toggle"
          />
        </View>

        <View style={themedStyles.settingRow}>
          <Image
            style={themedStyles.vibration_image}
            source={require("../../assets/images/vibration_icon.png")}
            resizeMode="contain"
          />
          <Text style={themedStyles.settingLabel}>Vibration Feedback</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
            style={themedStyles.switch}
            testID="vibration-toggle"
          />
        </View>

        <View style={themedStyles.settingRow}>
          <Ionicons
            name={soundEnabled ? "volume-high-outline" : "volume-mute-outline"}
            size={24}
            color={iconColor}
          />
          <Text style={themedStyles.settingLabel}>Sound Feedback</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
            style={themedStyles.switch}
            testID="sound-toggle"
          />
        </View>

        <View style={themedStyles.settingRow}>
          <Ionicons
            name={speechEnabled ? "mic-outline" : "mic-off-outline"}
            size={24}
            color={iconColor}
          />
          <Text style={themedStyles.settingLabel}>Speech Feedback</Text>
          <Switch
            value={speechEnabled}
            onValueChange={toggleSpeech}
            trackColor={{ false: "#b0b0b0", true: "#922338" }}
            thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
            style={themedStyles.switch}
            testID="speech-toggle"
          />
        </View>
      </View>
    </View>
  );
}
