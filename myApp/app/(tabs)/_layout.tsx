import { Tabs } from "expo-router";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../styles/LayoutStyles";
import { LocationProvider } from "../context/LocationContext";
import { IndoorMapProvider } from "../context/IndoorMapContext";
import React from "react";
import HeaderButtons from "../components/HeaderButtons";

interface TabBarIconProps {
  route: any;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused }) => {
  let iconName;
  switch (route.name) {
    case "map":
      iconName = focused ? "map" : "map-outline";
      break;
    case "interest-points":
      iconName = focused ? "pin" : "pin-outline";
      break;
    case "upcoming-class":
      iconName = focused ? "calendar" : "calendar-outline";
      break;
    case "index":
      iconName = focused ? "home" : "home-outline";
      break;
    default:
      iconName = "circle";
  }
  return (
    <View style={[styles.tabItem, focused && styles.activeTabBackground]}>
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={focused ? 21 : 24}
        color={focused ? "white" : "grey"}
        style={{ marginLeft: 0, marginTop: focused ? -14 : 0 }}
      />
    </View>
  );
};

export default function TabLayout() {

  const renderTabBarIcon = (route: any, focused: boolean) => (
    <TabBarIcon route={route} focused={focused} />
  );

  return (
    // LocationProvider and IndoorMapProvider ensure states can be managed globally
    <IndoorMapProvider>
      <LocationProvider>
        <View style={{ flex: 1 }}>
          <HeaderButtons/>
          <Tabs
            screenOptions={({ route }) => ({
              headerShown: false, // Remove the top header bar
              tabBarStyle: styles.tabBarStyle,
              tabBarItemStyle: styles.tabBarItemStyle,
              tabBarActiveTintColor: "white",
              tabBarInactiveTintColor: "grey",
              tabBarIcon: ({ focused }) => renderTabBarIcon(route, focused),
            })}
          >
            <Tabs.Screen name="map" />
            <Tabs.Screen name="outdoor-map" />
            <Tabs.Screen name="upcoming-class" />
            <Tabs.Screen name="index" />
          </Tabs>
        </View>
      </LocationProvider>
    </IndoorMapProvider>
  );
}