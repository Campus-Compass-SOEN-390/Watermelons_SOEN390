import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function SmartNavigationInfoPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/')}
          accessibilityRole="button"
          testID="homeButton"
        >
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/screens/SettingsPage')}
          accessibilityRole="button"
          testID="settingsButton"
        >
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Smart Navigation</Text>

        <View style={styles.videoWrapper}>
          <Video
            source={require('../../assets/videos/SmartNavigation.mp4')}
            style={styles.video}
            resizeMode="contain"
            isLooping
            shouldPlay
            useNativeControls={false}
            accessibilityRole="image" // Treat video as visual media
          />
        </View>

        <Text style={styles.description}>
          Get directions to your next event on campus in seconds.
        </Text>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          testID="backButton"
        >
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Smart Navigation</Text>
        <TouchableOpacity
          onPress={() => router.push('/screens/MapFeaturesInfoPage')}
          accessibilityRole="button"
          testID="nextButton"
        >
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
