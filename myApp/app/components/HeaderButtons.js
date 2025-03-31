import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";

export default function HeaderButtons() {
  const router = useRouter();
  const pathname = usePathname();

  // Get theme context properly
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const isHome = pathname === "/";
  const isSettings = pathname === "/screens/SettingsPage";

  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    headerButtons: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme.navButtonBackground ||
        (isDarkMode ? "rgba(80, 80, 80, 0.5)" : "rgba(255, 255, 255, 0.2)"),
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
  });

  return (
    <View style={styles.topNav}>
      {/* Left Slot (Home or Back or Placeholder) */}
      <View style={isHome ? styles.placeholder : dynamicStyles.headerButtons}>
        {isSettings ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.iconColor || "#FFFFFF"}
            />
          </TouchableOpacity>
        ) : isHome ? null : (
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons
              name="home"
              size={24}
              color={theme.iconColor || "#FFFFFF"}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1 }} />

      {/* Right Slot (Theme Toggle and Settings) */}
      <View style={styles.rightButtons}>
        {/* Theme toggle button */}
        <TouchableOpacity
          style={[dynamicStyles.headerButtons, { marginRight: 8 }]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={22}
            color={theme.iconColor || "#FFFFFF"}
          />
        </TouchableOpacity>

        {/* Settings button (only shown when not on Settings page) */}
        {!isSettings && (
          <TouchableOpacity
            style={dynamicStyles.headerButtons}
            onPress={() => router.push("/screens/SettingsPage")}
          >
            <Ionicons
              name="settings"
              size={24}
              color={theme.iconColor || "#FFFFFF"}
            />
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
