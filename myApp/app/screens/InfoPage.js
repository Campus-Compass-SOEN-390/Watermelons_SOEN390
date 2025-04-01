import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage() {
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

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Centered Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityRole="image"
          />
        </View>

        <Text style={styles.welcome}>
          Welcome to CampusCompass: Your compass for your journey across Concordia Campuses!
        </Text>

        <View style={styles.content}>
          <Text style={styles.featureTitle}>Features:</Text>
          <View style={styles.bullets}>
            <Text style={styles.bullet}>
              <Text style={styles.bold}>• Google Calendar Integration</Text> – Import your events seamlessly.
            </Text>
            <Text style={styles.bullet}>
              <Text style={styles.bold}>• Smart Navigation</Text> – Get directions to your next event.
            </Text>
            <Text style={styles.bullet}>
              <Text style={styles.bold}>• Interactive Campus Map:</Text>
            </Text>
            <Text style={styles.subBullet}>
              • Distinguish <Text style={styles.bold}>Concordia buildings</Text> on both campuses.
            </Text>
            <Text style={styles.subBullet}>
              • <Text style={styles.bold}>Click</Text> on a building for more information.
            </Text>
            <Text style={styles.subBullet}>
              • Get <Text style={styles.bold}>accessibility-friendly</Text> directions.
            </Text>
            <Text style={styles.subBullet}>
              • Explore nearby <Text style={styles.bold}>points of interest</Text> with a distance filter.
            </Text>
            <Text style={styles.subBullet}>
              • Identify <Text style={styles.bold}>key locations</Text> on the map.
            </Text>
            <Text style={styles.bullet}>
              <Text style={styles.bold}>• Shuttle Bus Updates</Text> – Access schedules and get real-time delay or rescheduling alerts.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {}}
          accessibilityRole="button"
          testID="dummyButton"
        >
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Campus Compass Features</Text>
        <TouchableOpacity
          onPress={() => router.push('/screens/CalenderInfoPage')}
          accessibilityRole="button"
          testID="nextButton"
        >
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
