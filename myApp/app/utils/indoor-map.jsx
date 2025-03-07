
export const handleIndoorBuildingSelect = (building, selectedIndoorBuilding, updateIsExpanded, updateSelectedIndoorBuilding, mapRef) => {
    const buildingCenter = calculateCentroid(
      convertCoordinates(building.coordinates)
    );

    if (selectedIndoorBuilding?.id === building.id) {
      // If the same building is reselected, recenter the camera
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18, // Ensure zoom level is high enough for indoor map
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    } else {
      // Select new building and activate indoor map
      updateSelectedIndoorBuilding(building);
      updateIsExpanded(false);

      // Move camera to the selected building
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  };

  // Function to calculate the centroid of a polygon
export const calculateCentroid = (coordinates) => {
    let x = 0,
      y = 0,
      n = coordinates.length;
  
    coordinates.forEach(([lng, lat]) => {
      x += lng;
      y += lat;
    });
  
    return [x / n, y / n]; // Returns [longitude, latitude]
  };

  // Converts building.coordinates [{latitude, longitude}, ...] to [[lng, lat], ...]
export const convertCoordinates = (coords) =>
    coords.map(({ latitude, longitude }) => [longitude, latitude]);

   // Handle clearing indoor mode
export const handleClearIndoorMap = (updateSelectedIndoorBuilding, updateIsExpanded, mapRef, activeCampus) => {
  updateSelectedIndoorBuilding(null);
  updateIsExpanded(false);

  // Reset camera to the default campus view
  mapRef.current?.setCamera({
    centerCoordinate:
      activeCampus === "sgw"
        ? [-73.5792229, 45.4951962]
        : [-73.6417009, 45.4581281],
    zoomLevel: 15,
    animationMode: "flyTo",
    animationDuration: 1000,
  });
};