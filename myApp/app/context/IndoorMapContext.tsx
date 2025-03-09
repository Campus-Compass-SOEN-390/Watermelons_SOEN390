// This file is used to handle states relating to the indoor map managed across different pages
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define a Building type (adjust as needed based on your actual data structure)
interface Building {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number }[];
  campus: string;
  hasIndoor: boolean;
}

// Interface for the context
interface IndoorMapContextType {
  isExpanded: boolean;
  selectedIndoorBuilding: Building | null;
  updateIsExpanded: (setting: boolean) => void;
  updateSelectedIndoorBuilding: (building: Building | null) => void;
}

const IndoorMapContext = createContext<IndoorMapContextType | null>(null);

export const IndoorMapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndoorBuilding, setSelectedIndoorBuilding] = useState<Building | null>(null); // ✅ Explicit type added

  const updateIsExpanded = (setting: boolean) => {
    console.log("isExpanded updated to:", setting);
    setIsExpanded(setting);
  };

  const updateSelectedIndoorBuilding = (building: Building | null) => { // ✅ Allow null
    console.log("selectedIndoorBuilding updated to:", building);
    setSelectedIndoorBuilding(building);
  }

  const value = useMemo(() => ({ 
    isExpanded, 
    selectedIndoorBuilding, 
    updateIsExpanded,
    updateSelectedIndoorBuilding // ✅ Added this
  }), [isExpanded, selectedIndoorBuilding, updateIsExpanded, updateSelectedIndoorBuilding]);

  return (
    <IndoorMapContext.Provider value={value}>
      {children}
    </IndoorMapContext.Provider>
  );
};

export const useIndoorMapContext = (): IndoorMapContextType => {
  const context = useContext(IndoorMapContext);
  if (context === null) {
    throw new Error('useIndoorMapContext must be used within an IndoorMapProvider');
  }
  return context;
};
