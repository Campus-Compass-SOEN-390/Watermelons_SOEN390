import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';           
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage5() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/SettingsPage')}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Campus Map Features</Text>
        <Text style={styles.description}>Points of Interest</Text>

        {/* Video Section */}
        <View style={styles.videoWrapper2}>
          <Video
            source={require('../../assets/videos/POI.mp4')} 
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay
          />
        </View>

        <Text style={styles.description}>
          Explore nearby points of interest and filter them by distance.
        </Text>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Points Of Interest</Text>
        <TouchableOpacity onPress={() => router.push('/screens/AccessibilityInfoPage')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


