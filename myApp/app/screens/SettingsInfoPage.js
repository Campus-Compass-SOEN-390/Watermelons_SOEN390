import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function SettingsInfoPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')} accessibilityRole="button">
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/SettingsPage')} accessibilityRole="button">
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>


      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings Page</Text>

        {/* Image of Settings */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/settings.png')}
            style={styles.image}
            accessibilityRole="image"
            accessible={true}
            testID="settings-image"
          />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Adjust settings according to your preferences and to make the most out of the app!
        </Text>
        <Text style={styles.description}>
          Describe the usability of each feature on the settings page (can be found in release 1 document)
        </Text>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Settings</Text>
        <Ionicons name="chevron-forward-circle" size={32} color="transparent" />
      </View>
    </View>
  );
}
