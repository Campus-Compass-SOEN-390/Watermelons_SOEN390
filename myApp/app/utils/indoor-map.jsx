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

  // Determine the default floor for the building
  const defaultFloor = building.floors?.length ? building.floors[0] : selectedIndoorBuilding?.floors?.[0] || null;

  if (selectedIndoorBuilding?.id === building.id) {
    // If reselecting the same building, just recenter without resetting floor
    mapRef.current?.setCamera({
      centerCoordinate: buildingCenter,
      zoomLevel: 18,
      animationMode: "flyTo",
      animationDuration: 1000,
    });

    updateIsExpanded(false);
    setSelectedFloor((prevFloor) => prevFloor ?? defaultFloor);
  } else {
    // Select a new building and reset to its default first floor
    updateSelectedIndoorBuilding(building);
    updateIsExpanded(false);
    setSelectedFloor(defaultFloor);

    // Move camera to the new building
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
