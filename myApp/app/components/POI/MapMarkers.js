import React, { useContext } from "react";
import Mapbox from "@rnmapbox/maps";
import { TouchableOpacity } from "react-native";
import { getRandomBytes } from "expo-crypto";
import { ThemeContext } from "../../context/ThemeContext"; // Update path if needed

// Update MapMarkers to handle coordinates correctly, make markers clickable, and support themes
export default function MapMarkers({
  data,
  MarkerComponent,
  onMarkerPress,
  isDarkMode: propIsDarkMode,
  theme: propTheme,
}) {
  // Get theme from context if not provided as props
  const themeContext = useContext(ThemeContext);
  const isDarkMode =
    propIsDarkMode !== undefined ? propIsDarkMode : themeContext?.isDarkMode;
  const theme = propTheme || themeContext?.theme;

  // Memoize the theme context value to avoid unnecessary re-renders
  const themeContextValue = React.useMemo(
    () => ({ isDarkMode, theme }),
    [isDarkMode, theme]
  );

  // Pass theme info to MarkerComponent if it needs it
  const MarkerWithTheme = (props) => (
    <ThemeContext.Provider value={themeContextValue}>
      <MarkerComponent {...props} />
    </ThemeContext.Provider>
  );

  console.log("MapMarkers data:", data[0]);
  return data.map((point) => {
    const lat = point?.geometry?.location?.lat;
    const lng = point?.geometry?.location?.lng;
    if (!lat || !lng) return null;

    // Generate a unique key/id using place_id or fallback to a random id
    // Secure random ID generator -- sonarqube imporvement
    const generateSecureId = () => {
      const randomBytes = getRandomBytes(8); // 8 bytes = 16 hex chars
      return Array.from(randomBytes, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    };

    // Usage:
    const pointId = point.place_id || `marker-${generateSecureId()}`;

    return (
      <Mapbox.MarkerView
        key={pointId}
        id={pointId}
        coordinate={[lng, lat]}
        title={point.name || "Location"}
        onPress={() => onMarkerPress?.(point)}
      >
        <TouchableOpacity onPress={() => onMarkerPress?.(point)}>
          <MarkerWithTheme />
        </TouchableOpacity>
      </Mapbox.MarkerView>
    );
  });
}
