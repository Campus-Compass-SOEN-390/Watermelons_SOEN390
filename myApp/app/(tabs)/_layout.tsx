import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface HeaderLeftButtonProps {
  onPress: () => void;
}

const HeaderLeftButton: React.FC<HeaderLeftButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.headerButton}>
    <Ionicons name="home" size={24} color="black" />
    <Text style={styles.headerButtonText}>Home</Text>
  </TouchableOpacity>
);

interface TabIconProps {
  route: { name: string };
  color: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ route, color, focused }) => {
  let iconName: keyof typeof Ionicons.glyphMap | undefined;
  switch (route.name) {
    case "(tabs)/loyola-campus":
      iconName = focused ? "map" : "map-outline";
      break;
    case "(tabs)/sgw-campus":
      iconName = focused ? "location" : "location-outline";
      break;
    case "(tabs)/interest-points":
      iconName = focused ? "pin" : "pin-outline";
      break;
    case "(tabs)/indoor-map":
      iconName = focused ? "map" : "map-outline";
      break;
    case "(tabs)/outdoor-map":
      iconName = focused ? "map" : "map-outline";
      break;
    case "../index":
      iconName = focused ? "home" : "home-outline";
      break;
    default:
      iconName = "help-circle-outline"; // Default fallback icon
  }

  return (
    <View style={[styles.tabItem, focused && styles.activeTabBackground]}>
      <Ionicons name={iconName} size={24} color={color} />
    </View>
  );
};

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveTintColor: '#ffd33d',
        tabBarInactiveTintColor: 'grey',
        headerLeft: () => <HeaderLeftButton onPress={() => router.push('/')} />, 
        tabBarIcon: ({ color, focused }) => <TabIcon route={route} color={color} focused={focused} />, 
      })}
    >
      <Tabs.Screen name="(tabs)/interest-points" options={{ headerShown: true }} />
      <Tabs.Screen name="(tabs)/indoor-map" options={{}} />
      <Tabs.Screen name="outdoor-map" options={{}} />
      <Tabs.Screen name="../index" options={{}} />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },

  tabBarItemStyle: {
    paddingVertical: 10,
    borderRadius: 40,
  },

  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  activeTabBackground: {
    backgroundColor: "grey",
    borderRadius: 40,
    width: 100,
    height: 60,
    position: "absolute",
    top: -5,
    left: "50%",
    transform: [{ translateX: -50 }],
    zIndex: 0,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
});