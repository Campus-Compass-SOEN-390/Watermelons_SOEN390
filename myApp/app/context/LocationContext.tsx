//This file is used to handle states relating to the location/outdoor maps managed across different pages
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocalSearchParams } from "expo-router";

//Interface for the context
interface LocationContextType {
  origin: { latitude: number; longitude: number } | null;
  destination: { latitude: number; longitude: number } | null;
  originText: string;
  destinationText: string;
  showTransportation: boolean;
  renderMap: boolean;
  showFooter: boolean;
  travelMode: string;
  showShuttleRoute: boolean;
  navType: string;
  navigationToMap: boolean;
  selectedRouteIndex: number;
  travelTime: string;
  travelDistance: string;
  routeSteps: Array<{id: number; instruction: string; distance: string}>;
  updateOrigin: (location: { latitude: number; longitude: number } | null, text: string) => void;
  updateDestination: (location: { latitude: number; longitude: number } | null, text: string) => void;
  updateShowTransportation: (setting: boolean) => void;
  updateRenderMap: (setting: boolean) => void;
  updateShowFooter: (setting: boolean) => void;
  updateTravelMode: (mode: string) => void;
  updateShowShuttleRoute: (setting: boolean) => void;
  updateNavType: (mode: string) => void;
  updateNavigationToMap: (setting: boolean) => void;
  updateSelectedRouteIndex: (index: number) => void;
  updateTravelTime: (time: string) =>void;
  updateTravelDistance: (distance: string) =>void;
  updateRouteSteps: (steps: Array<{ id: number; instruction: string; distance: string }>) => void; 
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { name, lat, lng } = useLocalSearchParams();
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [showTransportation, setShowTransportation] = useState(false);
  const [renderMap, setRenderMap] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [travelMode, setTravelMode] = useState("");
  const [showShuttleRoute, setShowShuttleRoute] = useState(false);
  const [navigationToMap, setNavigationToMap]= useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [travelTime, setTravelTime] = useState("");
  const [travelDistance, setTravelDistance] = useState("");
  const [routeSteps, setRouteSteps] = useState<Array<{ id: number; instruction: string; distance: string }>>([]); 


  const [navType, setNavType] = useState("");

  const [POILocationData, setPOILocationData] = useState<{ name: string; lat: number; lng: number } | null>(null);

  const updatePOILocationData = (name: string, lat: number, lng: number) => {
    console.log("LOC CONTEXT", name, lat);
    setPOILocationData({ name, lat, lng });
  };
  const updateOrigin = (
    location: { latitude: number; longitude: number } | null,
    text: string
  ) => {
    console.log("Location updated to:", text, location);
    setOrigin(location);
    setOriginText(text);
  };

  const updateDestination = (
    location: { latitude: number; longitude: number } | null,
    text: string
  ) => {
    console.log("Destination update to:", text, location);
    setDestination(location);
    setDestinationText(text);
  };

  // Method to trigger navigation to the map screen
  const updateNavigationToMap = (setting: boolean) => {
    setNavigationToMap(setting);
  }

  // useEffect to update origin and destination if locationData is not null
  useEffect(() => {
    if (POILocationData) {

      updateDestination(
        { latitude: POILocationData.lat, longitude: POILocationData.lng },
        POILocationData.name
      );

    }
  }, [POILocationData]); // This effect runs whenever locationData changes

  const updateShowTransportation = (setting: boolean) => {
    setShowTransportation(setting);
  };

  const updateRenderMap = (setting: boolean) => {
    setRenderMap(setting);
  };

  const updateShowFooter = (setting: boolean) => {
    setShowFooter(setting);
  };

  const updateTravelMode = (mode: string) => {
    setTravelMode(mode);
  };

  const updateShowShuttleRoute = (setting: boolean) => {
    setShowShuttleRoute(setting);
  }

  const updateSelectedRouteIndex = (index: number) => {
    setSelectedRouteIndex(index);
  }

  const updateTravelTime = (time: string) => {
    setTravelTime(time);
  }

  const updateTravelDistance = (distance: string) =>{
    setTravelDistance(distance);
  }

  // Update routeSteps
  const updateRouteSteps = (steps: Array<{ id: number; instruction: string; distance: string }>) => {
    setRouteSteps(steps);
  };

  const updateNavType = (mode: string) => {
    setNavType(mode);
  }

  const memoDependencies = [
    origin, 
    destination, 
    originText, 
    destinationText, 
    showTransportation, 
    renderMap, 
    showFooter,
    travelMode,
    showShuttleRoute,
    navigationToMap,
    selectedRouteIndex,
    travelTime,
    travelDistance,
    routeSteps,
    navType,
    updateOrigin, 
    updateDestination, 
    updateShowTransportation, 
    updateRenderMap,
    updateShowFooter,
    updateTravelMode,
    updateShowShuttleRoute,
    updatePOILocationData, // expose the update function
    updateNavigationToMap,
    updateSelectedRouteIndex,
    updateTravelTime,
    updateTravelDistance,
    updateRouteSteps,
    updateNavType
  ];
    
  const value = React.useMemo(
    () => ({
      origin,
      destination,
      originText,
      destinationText,
      showTransportation,
      renderMap,
      showFooter,
      travelMode,
      showShuttleRoute,
      navigationToMap,
      selectedRouteIndex,
      travelTime,
      travelDistance,
      routeSteps,
      navType,
      updateOrigin,
      updateDestination,
      updateShowTransportation,
      updateRenderMap,
      updateShowFooter,
      updateTravelMode,
      updateShowShuttleRoute,
      updatePOILocationData, // expose the update function
      updateNavigationToMap,
      updateSelectedRouteIndex,
      updateTravelTime,
      updateTravelDistance,
      updateRouteSteps,
      updateNavType
    }),
    memoDependencies
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
};
