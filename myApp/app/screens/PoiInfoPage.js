import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function PoiInfoPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>

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
            accessibilityRole="image"
          />
        </View>

        <Text style={styles.description}>
          Explore nearby points of interest and filter them by distance.
        </Text>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          testID="backButton"
        >
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Points Of Interest</Text>
        <TouchableOpacity
          onPress={() => router.push('/screens/AccessibilityInfoPage')}
          accessibilityRole="button"
          testID="nextButton"
        >
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
