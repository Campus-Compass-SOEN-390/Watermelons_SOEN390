import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "../styles/LayoutStyles";
import { LocationProvider } from '../context/LocationContext';

export default function TabLayout() {
  const router = useRouter();

  return (
    //Location Provider ensures states can be managed "globally"
    <LocationProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: false, // Remove the top header bar
            tabBarStyle: styles.tabBarStyle,
            tabBarItemStyle: styles.tabBarItemStyle,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'grey',
            tabBarIcon: ({ focused }) => {
              let iconName;
              switch (route.name) {
                case 'interest-points':
                  iconName = focused ? 'pin' : 'pin-outline';
                  break;
                case 'indoor-map':
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case 'outdoor-map':
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case 'favorites':
                  iconName = focused ? 'star' : 'star-outline';
                  break;
                case 'index':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                default:
                  iconName = 'circle';
              }
              return (
                <View style={[styles.tabItem, focused && styles.activeTabBackground]}>
                  <Ionicons
                    name={iconName as keyof typeof Ionicons.glyphMap}
                    size={focused ? 21 : 24}
                    color={focused ? 'white' : 'grey'}
                    style={{ marginLeft: 0, marginTop: focused ? -14 : 0 }}
                  />
                </View>
              );
            },
          })}
        >
          <Tabs.Screen name="interest-points" />
          <Tabs.Screen name="indoor-map" />
          <Tabs.Screen name="outdoor-map" />
          <Tabs.Screen name="favorites" />
          <Tabs.Screen name="index" />
        </Tabs>

        {/* Custom Home Button overlay */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LocationProvider>
  );
}
