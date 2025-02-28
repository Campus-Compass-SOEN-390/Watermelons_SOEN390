import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
  exchangeCodeAsync,
} from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { homepageStyles as styles } from "../styles/HomePageStyles.js";

// Google's OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

// Choose the correct client ID based on platform (iOS and default)
const clientId = Platform.select({
  ios: "321256625453-m2n0g36rfup9e216egimeor6hnq1c9b3.apps.googleusercontent.com",
  default: "321256625453-8bbjeu3icp553q13d5fr7dv9ssbue5a0.apps.googleusercontent.com",
});

export default function HomePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);



  const redirectUri = "https://auth.expo.io/@oukhtys/myApp";
  console.log("Redirect URI:", redirectUri)

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: Platform.select({
        ios: "321256625453-m2n0g36rfup9e216egimeor6hnq1c9b3.apps.googleusercontent.com",
        default: "321256625453-8bbjeu3icp553q13d5fr7dv9ssbue5a0.apps.googleusercontent.com", //also needs android
      }),
      scopes: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
      redirectUri: "https://auth.expo.io/@oukhtys/myApp",  // Ensure this matches Google Cloud Console
      usePKCE: true,
    },
    discovery
  );

  // On mount, load any locally stored user info.
  useEffect(() => {
    async function loadLocalUser() {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
        console.log("Loaded user from local storage");
      }
    }
    loadLocalUser();
  }, []);

  // When a successful response comes in, exchange the code for an access token,
  // then fetch the user's info.
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      (async () => {
        try {
          const tokenResult = await exchangeCodeAsync(
            {
              code,
              clientId,
              redirectUri: "https://auth.expo.io/@oukhtys/myapp",
              extraParams: {
                code_verifier: request.codeVerifier || "",
              },
            },
            discovery
          );
          console.log("Token Response:", tokenResult);
          if (tokenResult.accessToken) {
            getUserInfo(tokenResult.accessToken);
          }
        } catch (error) {
          console.error("Error exchanging code:", error);
        }
      })();
    }
  }, [response]);

  // Fetch the user's information using the access token.
  const getUserInfo = async (token) => {
    try {
      const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await userInfoResponse.json();
      setUserInfo(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      console.log("User info fetched:", user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
            onPress={() => router.push("/(tabs)/outdoor-map?type=sgw")}
          >
            <Text style={styles.buttonText}>SGW Campus</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            testID="loyolaButton"
            onPress={() => router.push("/(tabs)/outdoor-map?type=loyola")}
          >
            <Text style={styles.buttonText}>Loyola Campus</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} testID="browseButton">
            <Text style={styles.buttonText}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("(tabs)/interest-points")}
            testID="interestButton"
          >
            <Text style={styles.buttonText}>Interest Points</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonOrange} testID="directionButton">
            <Text style={styles.buttonText}>Directions to my next class</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Text style={styles.title}>Link your account</Text>
        <View style={styles.buttonContainer}>
          {/* If no user info is available, show the sign-in button.
              Otherwise, display the user's profile details. */}
          {!userInfo ? (
            <TouchableOpacity
              style={styles.googleButton}
              testID="googleButton"
              onPress={() => promptAsync()}
            >
              <Image
                source={require("../../assets/images/google_logo.png")}
                style={styles.icon}
                testID="googleIcon"
              />
              <Text style={styles.googleButtonText}>
                Connect Google Calendar
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              {userInfo.picture && (
                <Image
                  source={{ uri: userInfo.picture }}
                  style={styles.image}
                />
              )}
              <Text style={styles.text}>Name: {userInfo.name}</Text>
              <Text style={styles.text}>Email: {userInfo.email}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
