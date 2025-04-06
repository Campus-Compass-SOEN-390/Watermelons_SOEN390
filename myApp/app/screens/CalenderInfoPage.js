import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function CalenderInfoPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Google Calendar</Text>

        <View style={styles.imageWrapper}>
          <Image
            testID="calendar-image"
            source={require('../../assets/images/calenderConnection.png')}
            style={styles.image}
            resizeMode="contain"
            accessibilityRole="image"
          />
        </View>

        <Text style={styles.description}>
          Import your events from Google Calendar seamlessly. Benefit from the history feature to easily access recently viewed calendars!
        </Text>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityRole="button"
          testID="back-button"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>

        <Text style={styles.pageName}>Google Calendar</Text>

        <TouchableOpacity
          accessibilityRole="button"
          testID="next-button"
          onPress={() => router.push('/screens/SmartNavigationInfoPage')}
        >
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
