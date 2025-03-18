import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAlternativeRoutes } from "../api/googleMapsApi";
import { addShuttleOption } from "../utils/addShuttleOption";

// Define Types
type RouteStep = {
  instruction: string;
  distance: string;
  duration?: number;
};

type RouteData = {
  mode: string;
  summary: string;
  distance: string;
  duration: number;
  coordinates?: any;
  steps: RouteStep[];
  details?: any;
};

interface DirectionsScreenRouteParams {
  origin: { latitude: number; longitude: number; name?: string };
  destination: { latitude: number; longitude: number; name?: string };
  travelMode: string;
}

const DirectionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ DirectionsScreen: DirectionsScreenRouteParams }, "DirectionsScreen">>();
  const { origin, destination, travelMode } = route.params;

  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (origin && destination) {
      fetchAllRoutes();
    }
  }, [origin, destination, travelMode]);

  const fetchAllRoutes = async () => {
    setLoading(true);
    try {
      const googleRoutesResponse = (await getAlternativeRoutes(
        origin,
        destination,
        [travelMode],
        3
      )) as { [key: string]: RouteData[] };
  
      const googleRoutes = googleRoutesResponse[travelMode] || [];
  
      const shuttleRoutes: RouteData[] = await addShuttleOption(origin, destination);
  
      const combinedRoutes = [...shuttleRoutes, ...googleRoutes];
      setRoutes(combinedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Directions</Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>From: {origin.name}</Text>
        <Text style={styles.locationText}>To: {destination.name}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView style={styles.routesContainer}>
          {routes.map((route, index) => (
            <View
              key={`${route.mode}-${index}`}
              style={[styles.routeCard, route.mode.includes("Shuttle") && styles.shuttleCard]}
            >
              <Text style={styles.routeSummary}>{route.mode}</Text>
              <Text>
                {route.distance} - {route.duration} min
              </Text>
              {route.steps?.map((step, i) => (
                <Text key={`${route.mode}-${i}`} style={styles.stepText}>
                  {step.instruction} ({step.distance})
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goButton}>
          <MaterialIcons name="directions" size={24} color="white" />
          <Text style={styles.goText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DirectionsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { padding: 20, backgroundColor: "#6200ee", alignItems: "center" },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },
  locationContainer: { padding: 15, backgroundColor: "white" },
  locationText: { fontSize: 16, fontWeight: "500" },
  routesContainer: { padding: 15 },
  routeCard: { padding: 10, backgroundColor: "white", marginVertical: 5, borderRadius: 8 },
  shuttleCard: { borderColor: "#6200ee", borderWidth: 2, backgroundColor: "#e8e0ff" },
  routeSummary: { fontSize: 16, fontWeight: "bold" },
  stepText: { fontSize: 14, color: "#666" },
  footer: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#6200ee" },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "white", fontSize: 16, marginLeft: 5 },
  goButton: { flexDirection: "row", alignItems: "center" },
  goText: { color: "white", fontSize: 16, marginLeft: 5 },
});