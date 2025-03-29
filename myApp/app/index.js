import { LogBox, View, Platform } from "react-native";
import React, { useEffect } from "react";
import HomePage from "./screens/HomePage";
import "react-native-get-random-values";
import RNUxcam from "react-native-ux-cam";
import Constants from "expo-constants";
import { ThemeProvider } from "./context/ThemeContext";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Index() {
  useEffect(() => {
    try {
      // Access UXCam API key with fallback
      const UXCAM_API_KEY = Constants.expoConfig?.extra?.uxcamApiKey;

      if (!UXCAM_API_KEY) {
        console.error("UXCam API key not found in environment variables!");
        return;
      }

      console.log(
        `Initializing UXCam with key: ${UXCAM_API_KEY.substring(0, 5)}...`
      );

      // Safely call methods with error checking
      if (typeof RNUxcam.optIntoSchematicRecordings === "function") {
        RNUxcam.optIntoSchematicRecordings();
      }

      // Configure UXCam with correct key name
      const configuration = {
        appKey: UXCAM_API_KEY, // CORRECTED from userAppKey
        enableAutomaticScreenNameTagging: true,
        enableImprovedScreenCapture: true,
      };

      // Check if startWithConfiguration takes a callback
      if (RNUxcam.startWithConfiguration.length > 1) {
        // Version with callback
        RNUxcam.startWithConfiguration(configuration, (started) => {
          console.log(
            "UXCam start callback result:",
            started ? "SUCCESS" : "FAILED"
          );
        });
      } else {
        // Version without callback
        RNUxcam.startWithConfiguration(configuration);
        console.log("UXCam configuration applied (no callback available)");
      }

      // Log a test event
      if (typeof RNUxcam.logEvent === "function") {
        RNUxcam.logEvent("AppInitialized", {
          platform: Platform.OS,
          isSimulator: Platform.OS === "ios" && !Platform.isDevice,
          timestamp: new Date().toISOString(),
        });
      }

      // Check recording status after a short delay
      setTimeout(() => {
        try {
          if (typeof RNUxcam.isRecording === "function") {
            const recordingStatus = RNUxcam.isRecording();
            console.log("UXCam recording status:", recordingStatus);
          }
        } catch (error) {
          console.error("Error checking recording status:", error);
        }
      }, 2000);
    } catch (error) {
      console.error("UXCam initialization error:", error);
    }
  }, []);

  return (
    // Wrap your app with ThemeProvider
    <ThemeProvider>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HomePage />
      </View>
    </ThemeProvider>
  );
}
