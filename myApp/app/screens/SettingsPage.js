import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from 'expo-router';
import styles from '../styles/GoogleScheduleStyles';
import { Ionicons } from "@expo/vector-icons";
import LayoutWrapper from "../components/LayoutWrapper";

export default function Settings() {
  const router = useRouter();

  return (
    <View>
      <LayoutWrapper>  
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButtons}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      <Text>This is the Settings page</Text>
      </LayoutWrapper>
    </View>
  );
}

