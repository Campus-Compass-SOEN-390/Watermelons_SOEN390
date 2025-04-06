import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function AccessibilityInfoPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Campus Map Features</Text>
        <Text style={styles.description}>Accessibility-Friendly Routes</Text>

        {/* Screenshot(s) Section */}
        <View style={imageRow.container}>
          <Image
            source={require('../../assets/images/accessibility_before.png')}
            style={imageRow.image}
            accessibilityRole="image"
            accessible={true}
            testID="accessibility-before-image"
          />
          <Image
            source={require('../../assets/images/accessibility_after.png')}
            style={imageRow.image}
            accessibilityRole="image"
            accessible={true}
            testID="accessibility-after-image"
          />
        </View>

        <Text style={styles.description}>
          On the left is the standard route. On the right is the route 
          after toggling the accessibility button, showing an 
          accessibility-friendly path for your convenience.
        </Text>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()} testID="backButton">
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Accessibility</Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/screens/ShuttleInfoPage')}
          testID="nextPageButton"
        >
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Inline or local style for the image row
const imageRow = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: '50%',
    aspectRatio: 9 / 16,
    borderRadius: 10,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
