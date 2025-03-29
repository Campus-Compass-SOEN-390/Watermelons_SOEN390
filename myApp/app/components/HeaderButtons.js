import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

export default function HeaderButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext); // Get theme context

  const isHome = pathname === "/";
  const isSettings = pathname === "/screens/SettingsPage";

  return (
    <View style={[styles.topNav, { backgroundColor: theme.background }]}>
      {/* Left Slot (Home or Back or Placeholder) */}
      <View
        style={
          isHome
            ? styles.placeholder
            : [
                styles.headerButtons,
                { backgroundColor: theme.buttonBackground },
              ]
        }
      >
        {(() => {
          if (isSettings) {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
              </TouchableOpacity>
            );
          } else if (!isHome) {
            return (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="home" size={24} color={theme.iconColor} />
              </TouchableOpacity>
            );
          }
          return null;
        })()}
      </View>

      <View style={{ flex: 1 }} />

      {/* Right Slot (Theme Toggle and Settings) */}
      <View style={styles.rightButtons}>
        {/* Theme toggle button */}
        <TouchableOpacity
          style={[
            styles.headerButtons,
            { backgroundColor: theme.buttonBackground, marginRight: 8 },
          ]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={22}
            color={theme.iconColor}
          />
        </TouchableOpacity>

        {/* Settings button (only shown when not on Settings page) */}
        {!isSettings && (
          <TouchableOpacity
            style={[
              styles.headerButtons,
              { backgroundColor: theme.buttonBackground },
            ]}
            onPress={() => router.push("/screens/SettingsPage")}
          >
            <Ionicons name="settings" size={24} color={theme.iconColor} />
          </TouchableOpacity>
        )}
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // This will be overridden by theme
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  invisible: {
    opacity: 0,
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
});
