import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, React } from "react";
import { useRouter } from "expo-router";
import styles from "../styles/GoogleScheduleStyles";
import { Ionicons } from "@expo/vector-icons";
import LayoutWrapper from "../components/LayoutWrapper";
import HeaderButtons from "../components/HeaderButtons";

export default function Settings() {
  const router = useRouter();

  return (
    <LayoutWrapper>
      <View style={{ gap: 12 }}>
        <HeaderButtons />
        <Text style={{ fontSize: 16 }}>This is the Settings page</Text>
      </View>
    </LayoutWrapper>
  );
}
