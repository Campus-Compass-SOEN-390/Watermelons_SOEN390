import React, { useContext } from "react";
import {
  Switch,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useFeedback } from "../context/FeedbackContext";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { createSettingsPageStyles } from "../styles/SettingsPageStyles";
import { useButtonInteraction } from "../hooks/useButtonInteraction";

export default function Settings() {
  // Get feedback context
  const {
    vibrationEnabled,
    soundEnabled,
    speechEnabled,
    toggleVibration,
    toggleSound,
    toggleSpeech,
  } = useFeedback();

  // Get theme context
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Get button interaction handler
  const { handleButtonPress } = useButtonInteraction();

  // Use theme-aware styles
  const themedStyles = createSettingsPageStyles({
    theme: {
      darkBg: "#333333",
      darkText: "#FFFFFF",
    },
    isDarkMode,
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      }}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={themedStyles.container}>
          <Text style={themedStyles.title}>Settings</Text>

          {/* Dark Mode Toggle - Primary place to toggle theme */}
          <View style={themedStyles.settingRow}>
            <Ionicons
              name={isDarkMode ? "sunny" : "moon-outline"}
              size={24}
              color={isDarkMode ? "#FFFFFF" : "black"}
            />
            <Text style={themedStyles.settingLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={() => {
                handleButtonPress(
                  null,
                  isDarkMode
                    ? "Switching to light mode"
                    : "Switching to dark mode"
                );
                toggleTheme();
              }}
              trackColor={{ false: "#b0b0b0", true: "#922338" }}
              thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
              style={themedStyles.switch}
              testID="dark-mode-toggle"
            />
          </View>

          <View style={themedStyles.settingRow}>
            <Image
              style={[
                themedStyles.vibration_image,
                isDarkMode && { tintColor: "#FFFFFF" },
              ]}
              source={require("../../assets/images/vibration_icon.png")}
              resizeMode="contain"
            />
            <Text style={themedStyles.settingLabel}>Vibration Feedback</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={() => {
                handleButtonPress(
                  null,
                  vibrationEnabled
                    ? "Disabling vibration"
                    : "Enabling vibration"
                );
                toggleVibration();
              }}
              trackColor={{ false: "#b0b0b0", true: "#922338" }}
              thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
              style={themedStyles.switch}
              testID="vibration-toggle"
            />
          </View>

          <View style={themedStyles.settingRow}>
            <Ionicons
              name={
                soundEnabled ? "volume-high-outline" : "volume-mute-outline"
              }
              size={24}
              color={isDarkMode ? "#FFFFFF" : "black"}
            />
            <Text style={themedStyles.settingLabel}>Sound Feedback</Text>
            <Switch
              value={soundEnabled}
              onValueChange={() => {
                handleButtonPress(
                  null,
                  soundEnabled ? "Disabling sound" : "Enabling sound"
                );
                toggleSound();
              }}
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
              color={isDarkMode ? "#FFFFFF" : "black"}
            />
            <Text style={themedStyles.settingLabel}>Speech Feedback</Text>
            <Switch
              value={speechEnabled}
              onValueChange={() => {
                handleButtonPress(
                  null,
                  speechEnabled ? "Disabling speech" : "Enabling speech"
                );
                toggleSpeech();
              }}
              trackColor={{ false: "#b0b0b0", true: "#922338" }}
              thumbColor={isDarkMode ? "#f4f3f4" : "grey"}
              style={themedStyles.switch}
              testID="speech-toggle"
            />
          </View>

          {/* App information section could be added here */}
        </View>
      </SafeAreaView>
    </View>
  );
}
