import { Tabs, useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native'; // <-- added Text
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "../styles/LayoutStyles";
import React from 'react';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const currentMode = params.mode;
  const [activeTab, setActiveTab] = React.useState('interest-points');

  // Create custom tab navigation
  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    
    if (tabName === 'outdoor-map') {
      // Navigate to interest-points but with outdoor map context
      router.push({
        pathname: './interest-points',
        params: { mode: 'campus' }
      });
    } else if (tabName === 'interest-points' && currentMode === 'campus') {
      // When clicking interest-points tab while in campus mode, reset to POI mode
      router.push({
        pathname: './interest-points',
        params: { mode: 'poi' }
      });
    } else {
      router.push(tabName);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          // Add a dynamic tabBarLabel which depends on activeTab
          tabBarLabel: ({ focused, color }) => {
            const isActiveTab = activeTab === route.name;
            return (
              <Text style={{ 
                fontSize: 10, 
                marginTop: 2, 
                color: isActiveTab ? 'white' : 'grey'
              }}>
                {route.name}
              </Text>
            );
          },
          tabBarIcon: () => {
            let iconName;
            
            // Determine active tab based on state
            const isActiveTab = activeTab === route.name;
            const activeColor = 'grey';
            
            switch (route.name) {
              case 'interest-points':
                iconName = isActiveTab ? 'pin' : 'pin-outline';
                break;
              case 'outdoor-map':
                iconName = isActiveTab ? 'map' : 'map-outline';
                break;
              case 'indoor-map':
                iconName = isActiveTab ? 'map' : 'map-outline';
                break;
              case 'favorites':
                iconName = isActiveTab ? 'star' : 'star-outline';
                break;
              case 'index':
                iconName = isActiveTab ? 'home' : 'home-outline';
                break;
              default:
                iconName = 'circle';
            }
            return (
              <View style={[
                styles.tabItem, 
                isActiveTab && {
                  ...styles.activeTabBackground,
                  backgroundColor: activeColor
                }
              ]}>
                <Ionicons
                  name={iconName}
                  size={isActiveTab ? 21 : 24}
                  color={isActiveTab ? 'white' : 'grey'}
                  style={{ marginLeft: 0, marginTop: isActiveTab ? -14 : 0 }}
                />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen 
          name="interest-points" 
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigateToTab('interest-points');
            }
          }}
          options={{
            tabBarActiveTintColor: activeTab === 'outdoor-map' ? 'grey' : 'white'
          }}
        />
        <Tabs.Screen 
          name="indoor-map" 
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigateToTab('indoor-map');
            }
          }}
          options={{ 
          }}
        />
        <Tabs.Screen 
          name="outdoor-map" 
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigateToTab('outdoor-map');
            }
          }}
          options={{ }}
        />
        <Tabs.Screen 
          name="favorites" 
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigateToTab('favorites');
            }
          }}
          options={{
            tabBarActiveTintColor: "white"
          }}
        />
      </Tabs>

      <TouchableOpacity
        style={[styles.homeButton]}
        onPress={() => {
          setActiveTab('index');
          router.push('/');
        }}
      >
        <Ionicons name="home" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}