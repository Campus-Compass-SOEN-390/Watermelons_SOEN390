import * as Location from "expo-location";
import { useState, useEffect } from "react";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const useLocation = () => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      // Track location continuously
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 5, // Update every 5 meters
        },
        (currentLocation) => {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      );

      return () => subscription.remove(); // Cleanup
    })();
  }, []);

  return { location, errorMsg, hasPermission };
};

export default useLocation;
