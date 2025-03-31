import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function InfoPage4() {
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

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Campus Map Features</Text>
        <Text style={styles.description}>Interactive building pop up.</Text>

        <View style={imageRow.container}>
          <Image
            source={require('../../assets/images/buildings.png')}
            style={imageRow.image}
          />
          <Image
            source={require('../../assets/images/PopUp.png')}
            style={imageRow.image}
          />
        </View>

        {/* Extra info at the bottom */}
        <View style={styles.extraInfo}>
          <Text style={styles.subtitle}>How to Use the Interactive Map</Text>
          <Text style={styles.instructions}>
            1. Tap on any building to see its name, location, and more info.
          </Text>
          <Text style={styles.instructions}>
            2. Use "Get Directions" to open navigation from your current location.
          </Text>
          <Text style={styles.instructions}>
            3. Choose "Use as Starting Point" if you want to plan a route from that building.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Campus Map</Text>
        <TouchableOpacity onPress={() => router.push('/screens/PoiInfoPage')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Inline style just for this horizontal layout
const imageRow = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    flex: 1,
    aspectRatio: 9 / 16,
    borderRadius: 10,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
});
