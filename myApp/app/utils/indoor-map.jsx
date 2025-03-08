// Select or reselect an indoor building
export const handleIndoorBuildingSelect = (
  building,
  selectedIndoorBuilding,
  updateIsExpanded,
  updateSelectedIndoorBuilding,
  setSelectedFloor,
  mapRef
) => {
  const buildingCenter = calculateCentroid(convertCoordinates(building.coordinates));

  if (selectedIndoorBuilding?.id === building.id) {
    // If the same building is selected, just recenter
    mapRef.current?.setCamera({
      centerCoordinate: buildingCenter,
      zoomLevel: 18, // Ensure high enough zoom level
      animationMode: "flyTo",
      animationDuration: 1000,
    });
    updateIsExpanded(false);
    setSelectedFloor(building.floors ? building.floors[0] : null);
  } else {
    // Select a new building and reset to its default first floor
    updateSelectedIndoorBuilding(building);
    updateIsExpanded(false);
    setSelectedFloor(building.floors ? building.floors[0] : null);

    // Move camera to the selected building
    mapRef.current?.setCamera({
      centerCoordinate: buildingCenter,
      zoomLevel: 18,
      animationMode: "flyTo",
      animationDuration: 1000,
    });
  }
};

// Converts {latitude, longitude} format to [[lng, lat], ...] for Mapbox
export const convertCoordinates = (coords) => 
  coords.map(({ latitude, longitude }) => [longitude, latitude]);

// Calculate the centroid of a polygon (used for building positioning)
export const calculateCentroid = (coordinates) => {
  let x = 0, y = 0, n = coordinates.length;
  coordinates.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  return [x / n, y / n]; // [longitude, latitude]
};

// Handle exiting indoor mode (resets floor selection)
export const handleClearIndoorMap = (
  updateSelectedIndoorBuilding,
  updateIsExpanded,
  mapRef,
  activeCampus,
  setSelectedFloor
) => {
  updateSelectedIndoorBuilding(null);
  updateIsExpanded(false);
  setSelectedFloor(null); 

  // Reset map view to campus default
  mapRef.current?.setCamera({
    centerCoordinate: activeCampus === "sgw"
      ? [-73.5792229, 45.4951962]
      : [-73.6417009, 45.4581281],
    zoomLevel: 15,
    animationMode: "flyTo",
    animationDuration: 1000,
  });
};
