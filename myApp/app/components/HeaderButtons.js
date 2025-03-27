import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function HeaderButtons() {
    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === "/";
    const isSettings = pathname === "/screens/SettingsPage";

    return (
        <View style={styles.topNav}>
            {/* Left Slot (Home or Back or Placeholder) */}
            <View style={isHome ? styles.placeholder : styles.headerButtons}>
                {isSettings ? (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                ) : isHome ? null : (
                    <TouchableOpacity onPress={() => router.push("/")}>
                        <Ionicons name="home" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ flex: 1 }} />

            {/* Right Slot (Settings or Placeholder) */}
            {!isSettings && (
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => router.push("/screens/SettingsPage")}>
                        <Ionicons name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topNav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    headerButtons: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    invisible: {
        opacity: 0,
        pointerEvents: 'none',
    }
});
