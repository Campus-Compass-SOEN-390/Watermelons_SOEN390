import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const router = useRouter();

  return (
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
                  name={iconName}
                  size={focused ? 21 : 24}
                  color={focused ? 'white' : 'grey'}
                  style={{ marginLeft: focused ? 0 : 0, marginTop: focused ? -14 : 0 }}
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
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    marginHorizontal: 15,
  },
  tabBarItemStyle: {
    paddingVertical: 10,
    borderRadius: 40,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBackground: {
    backgroundColor: 'grey',
    borderRadius: 20,
    width: 80,
    height: 60,
    position: 'relative',
    top: 11,
  },
  homeButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
    zIndex: 100,
  },
});
