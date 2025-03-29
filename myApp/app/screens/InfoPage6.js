import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage6() {
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
        <Text style={styles.description}>Accessibility-Friendly Routes</Text>

        {/* Screenshot(s) Section */}
        <View style={imageRow.container}>
          <Image
            source={require('../../assets/images/accessibility_button.png')}
            style={imageRow.image}
          />
          {/* <Image
            source={require('../../assets/images/accessibility_route.png')}
            style={imageRow.image}
          /> */}
        </View>

        <Text style={styles.description}>
          Get accessibility-friendly routes for your convenience.
        </Text>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Accessibility</Text>
        <TouchableOpacity onPress={() => router.push('/screens/InfoPage7')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Inline or local style for the image row (similar to InfoPage4)
const imageRow = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: 370,
    height: 364,
    borderRadius: 10,
    marginHorizontal: 5,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

