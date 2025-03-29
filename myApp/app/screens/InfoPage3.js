import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage3() {
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
        <Text style={styles.title}>Smart Navigation</Text>

        <View style={styles.videoWrapper}>
          <Video
            source={require('../../assets/videos/Smart_Navigation.mp4')} // Place your video in assets/videos
            style={styles.video}
            resizeMode="contain" 
            isLooping
            shouldPlay
            useNativeControls={false}       
          />
        </View>

        <Text style={styles.description}>
          Get directions to your next event on campus in seconds.
        </Text>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Smart Navigation</Text>
        <TouchableOpacity onPress={() => router.push('/screens/InfoPage4')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
