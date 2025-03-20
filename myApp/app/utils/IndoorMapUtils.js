// Select or reselect an indoor building
export const handleIndoorBuildingSelect = (
  building,
  selectedIndoorBuilding,
  selectedFloor,
  updateIsExpanded,
  updateSelectedIndoorBuilding,
  updateSelectedFloor,
  mapRef
) => {
  const buildingCenter = calculateCentroid(convertCoordinates(building.coordinates));

  // Determine the default floor for the building
  const defaultFloor = 1;

  if (selectedIndoorBuilding?.id === building.id) {
    // If reselecting the same building, just recenter without resetting floor
    mapRef.current?.setCamera({
      centerCoordinate: buildingCenter,
      zoomLevel: 18,
      animationMode: "flyTo",
      animationDuration: 1000,
    });

    updateIsExpanded(false);
    updateSelectedFloor(selectedFloor ?? defaultFloor);
  } else {
    // Select a new building and reset to its default first floor
    updateSelectedIndoorBuilding(building);
    updateIsExpanded(false);
    updateSelectedFloor(defaultFloor);

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

// Extracts the building prefix from a classroom name like "H101" -> "H"
export const extractBuildingPrefix = (classroomName) => {
  const match = classroomName.match(/^[A-Za-z]+/); // Extracts letters at the start
  return match ? match[0] : null;
};

// Finds and sets the building based on the classroom name
export const selectBuildingFromClassroom = (classroom, buildings, updateSelectedIndoorBuilding, setSelectedFloor) => {
  if (!classroom) return;

  const buildingPrefix = extractBuildingPrefix(classroom);
  if (!buildingPrefix) return;

  // Find the corresponding building
  const matchingBuilding = buildings.find((b) => b.name.startsWith(buildingPrefix));

  if (matchingBuilding) {
    console.log(`Setting selected indoor building to: ${matchingBuilding.name}`);
    updateSelectedIndoorBuilding(matchingBuilding);
    setSelectedFloor("1"); // Default to the first floor
  } else {
    console.log(`No matching building found for prefix: ${buildingPrefix}`);
  }
};

export const parseClassroomLocation = (classroomText) => {
  const classroomRegex = /^([A-Z]+)(\d{1,3})/i;
  const match = classroomText.match(classroomRegex);

  if (!match) return null;

  let buildingName = match[1];
  let floor = parseInt(match[2][0], 10);

  // Special case for MB building
  if (classroomText.startsWith("MB")) {
    buildingName = "MB";
    if (classroomText.includes("S2")) {
      floor = -2; // Convert "S2" to -2
    }
  }

  return { buildingName, floor };
}