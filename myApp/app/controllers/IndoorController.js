import IndoorModel from '../models/IndoorModel';

class IndoorController {
  constructor() {
    this.model = IndoorModel;
  }

  // Handle indoor building selection
  handleIndoorBuildingSelect(building, updateSelectedIndoorBuilding, updateIsExpanded, updateSelectedFloor, mapRef) {
    const buildingCenter = this.model.getBuildingCenter(building);

    if (this.model.selectedIndoorBuilding?.id === building.id) {
      // If the same building is reselected, recenter the camera
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18, // Ensure zoom level is high enough for indoor map
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    } else {
      // Select new building and update state
      updateSelectedIndoorBuilding(building);
      updateIsExpanded(false);
      updateSelectedFloor(1); // Reset to default floor

      // Move camera to the selected building
      mapRef.current?.setCamera({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  }

  // Clear indoor map selection
  handleClearIndoorMap(updateSelectedIndoorBuilding, updateIsExpanded, mapRef, activeCampus, updateSelectedFloor) {
    updateSelectedIndoorBuilding(null);
    updateIsExpanded(false);
    updateSelectedFloor(1);

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
  }

  // Get combined graph data for indoor navigation
  getGraph() {
    return this.model.graph;
  }

  // Get node coordinates for indoor navigation
  getNodeCoordinates() {
    return this.model.nodeCoordinates;
  }

  // Get indoor coordinates map
  getIndoorCoordinatesMap() {
    return this.model.indoorCoordinatesMap;
  }

  // Convert coordinates for indoor map display
  convertCoordinates(coords) {
    return this.model.convertCoordinates(coords);
  }

  // Calculate centroid for a building
  calculateCentroid(coordinates) {
    return this.model.calculateCentroid(coordinates);
  }

  // Filter buildings with indoor mapping for the given campus
  getIndoorBuildingsForCampus(buildings, activeCampus) {
    return buildings.filter(
      building => 
        building.campus.toLowerCase() === activeCampus.toLowerCase() && 
        building.hasIndoor === true &&
        building.name.toLowerCase() !== "ve"
    );
  }
}

export default new IndoorController();
