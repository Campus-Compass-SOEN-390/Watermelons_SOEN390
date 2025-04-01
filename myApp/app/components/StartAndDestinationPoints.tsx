interface StartAndDestinationPointsProps {
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
}
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Modal,
  ScrollView,
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import Constants from "expo-constants";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { createStartAndDestinationStyles } from "../styles/StartAndDestinationPointsStyles";
import useLocation from "../hooks/useLocation";
import Icon from "react-native-vector-icons/Foundation";
import { useLocationContext } from "../context/LocationContext";
import { ThemeContext } from "../context/ThemeContext";
import TravelFacade from "../utils/TravelFacade";
import { useIndoorMapContext } from "../context/IndoorMapContext";
import { parseClassroomLocation } from "../utils/IndoorMapUtils";
import { buildings } from "../api/buildingData";
import HeaderButtons from "../components/HeaderButtons";

// Define Types
type Route = {
  duration: string;
  distance: string;
};

type RouteData = {
  mode: string;
  routes: Route[];
};

interface Step {
  id: number;
  distance: string;
  instruction: string;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.apiKey;

const StartAndDestinationPoints: React.FC<StartAndDestinationPointsProps> = ({
  isDisabled,
  setIsDisabled,
}) => {
  // Get theme context
  const { theme, isDarkMode } = useContext(ThemeContext);

  // Generate theme-aware styles
  const styles = createStartAndDestinationStyles({
    ...theme,
    isDarkMode,
  });

  // // Add this useEffect hook for UXCam screen tagging
  // useEffect(() => {
  //   // Tag this screen in UXCam
  //   RNUxcam.tagScreenName("MapsPage");
  // }, []);
  const {
    updateOrigin,
    updateDestination,
    updateShowTransportation,
    updateRenderMap,
    updateTravelMode,
    updateNavigationToMap,
    updateSelectedRouteIndex,
    updateTravelTime,
    updateTravelDistance,
    updateNavType,
    origin,
    destination,
    originText,
    destinationText,
    showTransportation,
    travelMode,
    travelTime,
    travelDistance,
  } = useLocationContext();
  const { updateSelectedFloor, updateSelectedIndoorBuilding } =
    useIndoorMapContext();
  const { location } = useLocation();
  const originRef = useRef<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showMyLocButton, setShowMyLocButton] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [routeSteps, setRouteSteps] = useState<Step[]>([]);
  const [travelTimes, setTravelTimes] = useState<{
    [key: string]: number | null;
  }>({});
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteData[] | null>(null);
  const [showFooter, setShowFooter] = useState(false);

  //Fetch alternative routes

  useEffect(() => {
    const fetchAllRoutes = async () => {
      setLoading(true);

      if (!origin || !destination) {
        console.error("Origin or destination is null.");
        return;
      }

      const fetchedRoutes = await TravelFacade.getAlternativeRoutes(
        origin,
        destination
      );
      setRoutes(Object.values(fetchedRoutes));
      setLoading(false);
    };

    if (origin && destination) {
      fetchAllRoutes();
    }

    console.log("ALL ROUTES: ", routes);
  }, [origin, destination, travelMode]);

  // Fetch travel times when origin or destination changes
  useEffect(() => {
    if (origin && destination) {
      setLoading(true);
      handleNavType(originText, destinationText);
      TravelFacade.getTravelTimes(origin, destination).then((times) => {
        const timesMap: { [key: string]: number | null } = {};
        times.forEach(({ mode, duration }) => {
          timesMap[mode] = duration;
        });
        setTravelTimes(timesMap);
        setLoading(false);
      });
    }
  }, [origin, destination]);

  const handleNavType = (originText: string, destinationText: string) => {
    if (!originText || !destinationText) {
      return "";
    }
    const originBuilding = getBuildingCode(originText);
    const destinationBuilding = getBuildingCode(destinationText);
    console.log("originbuilding is", originBuilding);
    console.log("destinationbuilding is", destinationBuilding);
    console.log("Is Disabled", isDisabled);
    console.log("buildingCoordinates");
    // Function to determine navigation type
    const navigationType = (origin: any, destination: any) => {
      const originBuilding = getBuildingCode(origin);
      const destinationBuilding = getBuildingCode(destination);

      if (
        originBuilding &&
        destinationBuilding &&
        buildingCoordinates[String(originBuilding)] &&
        buildingCoordinates[String(destinationBuilding)]
      ) {
        return originBuilding === destinationBuilding
          ? "indoor"
          : "indoor-outdoor-indoor";
      }
      if (originBuilding && buildingCoordinates[String(originBuilding)])
        return "indoor-outdoor";
      if (
        destinationBuilding &&
        buildingCoordinates[String(destinationBuilding)]
      )
        return "outdoor-indoor";

      return "outdoor";
    };
    updateNavType(navigationType(originText, destinationText));
  };

  const getBuildingCode = (room: string) => {
    const match = room.match(/^[A-Za-z]+/);
    return match ? match[0] : null;
  };

  const buildingCoordinates: Record<
    string,
    { latitude: number; longitude: number }
  > = {
    VL: { latitude: 45.459026, longitude: -73.638606 }, // Vanier Library
    H: { latitude: 45.497092, longitude: -73.5788 }, // Hall Building
    EV: { latitude: 45.495376, longitude: -73.577997 }, // Engineering and Visual Arts
    MB: { latitude: 45.495304, longitude: -73.579044 }, // John Molson Building
    CC: { latitude: 45.458422, longitude: -73.640747 },
  };

  const handleDestinationInput = (text: string) => {
    const buildingCode = getBuildingCode(text);

    if (buildingCode && buildingCoordinates[buildingCode]) {
      const coords = buildingCoordinates[buildingCode];
      updateDestination(coords, text);
    } else {
      updateDestination(null, text);
    }
  };

  // Handle Route Selection button click
  const handleRouteSelection = (index: number) => {
    updateSelectedRouteIndex(index);

    console.log("SELECTED TRAVEL TIME:", travelTime);
    console.log("SELECTED TRAVEL DISTANCE:", travelDistance);
  };

  // Handle "GO" button click
  const handleGoClick = () => {
    setShowFooter(false);
    updateNavigationToMap(true);
  };

  // Handle "Steps" button click (show modal)
  const handleStepsClick = async () => {
    if (!origin || !destination) return;

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${travelMode.toLowerCase()}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const stepsArray = data.routes[0].legs[0].steps.map(
          (step: any, index: number) => ({
            id: index,
            instruction: step.html_instructions.replace(/<[^>]*?>/g, ""), //(Safer Regex - non-greedy quantifier) old = /<[^>]+>/g
            distance: step.distance.text,
          })
        );

        setRouteSteps(stepsArray);
        setShowSteps(true);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Close steps modal
  const handleCloseSteps = () => {
    setShowSteps(false);
  };

  useEffect(() => {
    try {
      handleNavType(originText, destinationText);
      updateOrigin(origin, originText);
      updateDestination(destination, destinationText);
    } catch {
      console.log("Crashed 5");
    }
  }, [
    origin,
    location,
    {
      /*originText, destinationText*/
    },
    showTransportation,
    showSteps,
  ]);

  useEffect(() => {
    try {
      handleNavType(originText, destinationText);
      updateShowTransportation(false);
    } catch {
      console.log("Crashed 4");
    }
  }, [origin, location]);

  const getTravelTimeText = (
    times: { [key: string]: number | null },
    mode: string
  ) => {
    return times[mode] ? `${times[mode]} min` : "N/A";
  };

  return (
    <View style={styles.container}>
      {/* Theme Toggle Button */}
      {/* Header buttons */}
      {/* Header buttons */}
      <HeaderButtons />
      {/* <TouchableOpacity
        style={styles.themeToggleButton}
        onPress={toggleTheme}
        accessibilityLabel={
          isDarkMode ? "Switch to light mode" : "Switch to dark mode"
        }
        testID="themeToggleButton"
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={20}
          color={theme.buttonText}
        />
      </TouchableOpacity> */}

      <View style={styles.card}>
        {/* From Input with Google Places Autocomplete */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>From</Text>
          <GooglePlacesAutocomplete
            ref={originRef}
            placeholder="Type or select origin location"
            fetchDetails={true}
            minLength={0}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
              components: "country:ca",
            }}
            onPress={(data, details = null) => {
              if (details) {
                const location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                updateOrigin(location, data.description);
                console.log("Hello went thru onPress");
                originRef.current?.setAddressText(data.description);
                updateShowTransportation(false);
              }
            }}
            textInputProps={{
              value: originText,
              onChangeText: (text) => updateOrigin(origin, text),
              onFocus: () => {
                setIsInputFocused(true);
                setShowMyLocButton(true);
              },
              onBlur: () => setIsInputFocused(false),
              style: styles.input,
              placeholderTextColor: isDarkMode ? "#999" : "#666",
            }}
            styles={{
              listView: styles.dropdownFrom,
              row: styles.dropdownItem,
              description: { color: theme.text },
              predefinedPlacesDescription: { color: theme.text },
            }}
          />
          {/* My Location Button */}
          {isInputFocused && showMyLocButton && (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                if (location) {
                  updateShowTransportation(false);
                  const coords = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  };
                  console.log("Selected My Location:", coords);
                  updateOrigin(coords, "My Location");
                  originRef.current?.setAddressText("My Location");
                  setShowMyLocButton(false);
                  setIsInputFocused(false);
                } else {
                  console.log("User location not available.");
                }
              }}
              style={styles.myLocationButton}
            >
              <Icon name="target-two" size={20} color={theme.text} />
              <Text style={styles.myLocationText}>My Location</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* To Input with Google Places Autocomplete */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>To</Text>
          <GooglePlacesAutocomplete
            placeholder="Type or select destination location"
            fetchDetails={true}
            minLength={0}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
              components: "country:ca",
            }}
            onPress={(data, details = null) => {
              if (details) {
                const location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                updateDestination(location, data.description);
                updateShowTransportation(false);
              }
            }}
            textInputProps={{
              value: destinationText,
              onChangeText: handleDestinationInput,
              style: styles.input,
              placeholderTextColor: isDarkMode ? "#999" : "#666",
            }}
            styles={{
              listView: styles.dropdownTo,
              row: styles.dropdownItem,
              description: { color: theme.text },
              predefinedPlacesDescription: { color: theme.text },
            }}
          />
        </View>
        {/* Conditional Rendering for Directions Options */}
        {!showTransportation ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (origin && destination) {
                const parsedLocation = parseClassroomLocation(originText);

                if (parsedLocation) {
                  const { buildingName, floor } = parsedLocation;

                  const matchedBuilding = buildings.find(
                    (b) => b.name === buildingName
                  );

                  if (matchedBuilding) {
                    updateSelectedIndoorBuilding(matchedBuilding);
                    updateSelectedFloor(Number(floor));
                  }
                }

                handleNavType(originText, destinationText);
                updateShowTransportation(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme.buttonBackground}
                />
                <Text style={styles.loadingText}>
                  Calculating travel times...
                </Text>
              </View>
            ) : (
              [
                { mode: "driving" as const, icon: "directions-car" as const },
                { mode: "transit" as const, icon: "directions-bus" as const },
                { mode: "walking" as const, icon: "directions-walk" as const },
                {
                  mode: "bicycling" as const,
                  icon: "directions-bike" as const,
                },
              ].map(({ mode, icon }) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => {
                    if (origin && destination) {
                      console.log("Get Directions Pressed");
                      updateRenderMap(true);
                      updateTravelMode(mode);
                      updateShowTransportation(true);
                      setShowFooter(true);
                    }
                  }}
                  style={[
                    styles.transportButton,
                    travelMode === mode && styles.selectedButton,
                    { flexDirection: "row", alignItems: "center" }, // Added row layout
                  ]}
                >
                  <MaterialIcons
                    name={icon}
                    size={20}
                    color={travelMode === mode ? theme.buttonText : theme.text}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      textAlign: "center",
                      flexWrap: "wrap",
                      color:
                        travelMode === mode ? theme.buttonText : theme.text,
                    }}
                  >
                    {getTravelTimeText(travelTimes, mode)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>

      {/* FOOTER */}
      {showFooter && (
        <View style={styles.footerContainer}>
          {/* Accessibility Toggle pushed to the right */}
          <View style={styles.accessibilityToggle}>
            <Switch
              value={isDisabled}
              onValueChange={(val) => setIsDisabled(val)}
              trackColor={{ false: "#ccc", true: theme.buttonBackground }}
              thumbColor="#fff"
            />
            <MaterialIcons
              name="accessible"
              size={24}
              color={isDisabled ? theme.buttonBackground : "#555"}
              style={{ marginLeft: 5 }}
            />
          </View>

          {/* Cancel Button at Top Right */}
          <View style={styles.cancelButtonTopRight}>
            <TouchableOpacity
              onPress={() => {
                updateShowTransportation(false);
                updateRenderMap(false);
                updateSelectedFloor(1);
                updateSelectedIndoorBuilding(null);
                updateOrigin(null, "");
                updateDestination(null, "");
                setShowFooter(false);
              }}
            >
              <Text style={[styles.footerButtonText, { color: "red" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Steps Button */}
          <TouchableOpacity
            style={styles.stepsButton}
            onPress={handleStepsClick}
          >
            <Text style={styles.footerButtonText}>Steps</Text>
          </TouchableOpacity>

          {/* Display Alternative Routes */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.buttonBackground} />
              <Text style={styles.loadingText}>Loading routes...</Text>
            </View>
          ) : routes && routes.length > 0 ? (
            <View style={styles.routesContainer}>
              {routes
                .filter((routeData) => routeData.mode === travelMode)
                .map((routeData, index) => (
                  <View key={index}>
                    {routeData.routes.map((route, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.routeCard}
                        onPress={() => {
                          handleRouteSelection(i);
                        }}
                      >
                        <Text style={{ color: theme.text }}>
                          {route.duration} min {"\n"} {route.distance}
                        </Text>
                        <TouchableOpacity
                          style={styles.goButton}
                          onPress={() => {
                            handleGoClick();
                            updateTravelTime(route.duration);
                            updateTravelDistance(route.distance);
                          }}
                        >
                          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                            Go
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
            </View>
          ) : (
            <Text style={{ color: theme.text }}>
              No alternative routes available.
            </Text>
          )}
        </View>
      )}

      {/* Steps Modal */}
      {showSteps && (
        <Modal visible={showSteps} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Step-by-Step Directions</Text>
              <ScrollView style={styles.stepsList}>
                {routeSteps.map((step) => (
                  <View key={step.id} style={styles.stepItem}>
                    <Text style={styles.stepText}>{step.instruction}</Text>
                    <Text style={styles.stepDistance}>{step.distance}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseSteps}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default StartAndDestinationPoints;
