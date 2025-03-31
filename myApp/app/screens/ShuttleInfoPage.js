import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { infoPageStyles as styles } from '../styles/InfoPageStyles';

export default function ShuttleBusPage() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const showBusAlert = () => {
    Alert.alert(
      'Bus Status',
      '✅ No expected bus delays.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/screens/SettingsPage')}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Shuttle Bus</Text>
        <Text style={styles.description}>Next one on schedule</Text>

        {/* Two Images Side-by-Side */}
        <View style={styles.horizontalImageRow}>
          <TouchableOpacity style={styles.squareImageWrapper} onPress={() => setModalVisible(true)}>
            <Image
              source={require('../../assets/images/shuttleButton.png')}
              style={styles.squareImage}
            />
          </TouchableOpacity>
          <View style={styles.squareImageWrapper}>
            <Image
              source={require('../../assets/images/shuttlePopUp.png')}
              style={styles.squareImage}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          View bus schedules and real-time updates on delays or changes
        </Text>

        <Text style={styles.subtitle}>Shuttle Bus Schedule and Alerts</Text>

          <View style={styles.horizontalImageRow}>
            <View style={styles.squareImageWrapper}>
              <Image
                source={require('../../assets/images/shuttleSchedule.png')}
                style={styles.squareImage}
              />
            </View>
            <View style={styles.squareImageWrapper}>
              <Image
                source={require('../../assets/images/shuttleAlert.png')}
                style={styles.squareImage}
              />
            </View>
          </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageName}>Shuttle Bus</Text>
        <TouchableOpacity onPress={() => router.push('/screens/SettingsInfoPage')}>
          <Ionicons name="chevron-forward-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal with Schedule */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Image
              source={require('../../assets/images/shuttleSchedule.png')}
              style={modalStyles.modalImage}
            />
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 450,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#800020',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
