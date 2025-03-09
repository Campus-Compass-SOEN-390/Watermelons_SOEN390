//This file is used to handle states relating to the location/outdoor maps managed across different pages
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  updateOrigin: (location: { latitude: number; longitude: number } | null, text: string) => void;
  updateDestination: (location: { latitude: number; longitude: number } | null, text: string) => void;
  updateShowTransportation: (setting: boolean) => void;
  updateRenderMap: (setting: boolean) => void;
  updateShowFooter: (setting: boolean) => void;
  updateTravelMode: (mode: string) => void;
  updateShowShuttleRoute: (setting: boolean) => void;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [showTransportation, setShowTransportation] = useState(false);
  const [renderMap, setRenderMap] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [travelMode, setTravelMode] = useState("");
  const [showShuttleRoute, setShowShuttleRoute] = useState(false);

  const updateOrigin = (location: { latitude: number; longitude: number } | null, text: string) => {
    console.log("Location updated to:", text, location)
    setOrigin(location);
    setOriginText(text);
  };

  const updateDestination = (location: { latitude: number; longitude: number } | null, text: string) => {
    console.log("Destination update to:", text, location);
    setDestination(location);
    setDestinationText(text);
  };

  const updateShowTransportation = (setting: boolean) => {
    setShowTransportation(setting);
  }

  const updateRenderMap = (setting: boolean) => {
    setRenderMap(setting);
  }

  const updateShowFooter = (setting: boolean) => {
    setShowFooter(setting);
  }

  const updateTravelMode = (mode: string) => {
    setTravelMode(mode);
  }

  const updateShowShuttleRoute = (setting: boolean) => {
    setShowShuttleRoute(setting);
  }

  const value = React.useMemo(() => ({ 
    origin, 
    destination, 
    originText, 
    destinationText, 
    showTransportation, 
    renderMap, 
    showFooter,
    travelMode,
    showShuttleRoute,
    updateOrigin, 
    updateDestination, 
    updateShowTransportation, 
    updateRenderMap,
    updateShowFooter,
    updateTravelMode,
    updateShowShuttleRoute
   }), [origin, destination, originText, destinationText, showTransportation, renderMap, showFooter, travelMode, showShuttleRoute, updateOrigin, updateDestination, updateShowTransportation, updateRenderMap, updateShowFooter, updateTravelMode, updateShowShuttleRoute]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
