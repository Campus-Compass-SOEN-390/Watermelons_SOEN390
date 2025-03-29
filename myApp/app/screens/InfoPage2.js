import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/SettingsPage')}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Google Calendar</Text>

        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/calenderConnection.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.description}>
          Import your events from Google Calendar seamlessly. Benefit from the history feature to easily access recently viewed calendars!
        </Text>
      </ScrollView>


      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Google Calendar</Text>
        <TouchableOpacity onPress={() => router.push('/screens/InfoPage3')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
