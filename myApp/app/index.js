import { LogBox, View } from "react-native";
import React, { useEffect } from "react";
import HomePage from "./screens/HomePage";
import "react-native-get-random-values";
import RNUxcam from "react-native-ux-cam";
import Constants from "expo-constants";

// Remove this import since it's redundant and may cause confusion
// import { startWithKey } from "react-native-ux-cam";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function Index() {
  useEffect(() => {
    try {
      // Access UXCam API key from environment variables
      const UXCAM_API_KEY = Constants.expoConfig?.extra?.uxcamApiKey;

      // Check if the key exists
      if (!UXCAM_API_KEY) {
        console.warn("UXCam API key not found in environment variables");
        return;
      }

      // Enable iOS screen recordings
      RNUxcam.optIntoSchematicRecordings();

      // Configure UXCam with all settings
      const configuration = {
        userAppKey: UXCAM_API_KEY,
        enableAutomaticScreenNameTagging: false,
        enableImprovedScreenCapture: true,
      };

      // Start UXCam with the configuration
      RNUxcam.startWithConfiguration(configuration);

      // Manually tag this screen
      RNUxcam.tagScreenName("HomePage");
    } catch (error) {
      console.log("UXCam initialization error:", error);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HomePage />
    </View>
  );
}
