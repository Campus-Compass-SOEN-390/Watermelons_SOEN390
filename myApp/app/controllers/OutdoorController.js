import OutdoorModel from '../models/OutdoorModel';
import { estimateShuttleFromButton } from "../utils/shuttleUtils";

class OutdoorController {
  constructor() {
    this.model = OutdoorModel;
  }

  // Switch between SGW and Loyola campuses
  toggleCampus(mapRef) {
    const newCampus = this.model.activeCampus === "sgw" ? "loy" : "sgw";
    this.model.activeCampus = newCampus;

    if (mapRef.current) {
      const newCenter = newCampus === "sgw"
        ? [-73.5792229, 45.4951962]
        : [-73.6417009, 45.4581281];

      mapRef.current.setCamera({
        centerCoordinate: newCenter,
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }

    return newCampus;
  }

  // Center map on campus
  centerMapOnCampus(mapRef) {
    if (mapRef.current) {
      const currentRegion = this.model.getCurrentCampusRegion();
      mapRef.current.setCamera({
        centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  }

  // Center map on user
  centerMapOnUser(mapRef, location) {
    if (location && mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 17,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    }
  }

  // Handle building press to show details
  handleBuildingPress(building) {
    if (!building || !building.id) {
      return null;
    }
    
    const fullBuilding = this.model.getBuildingById(building.id);
    this.model.selectedBuilding = fullBuilding;
    return fullBuilding;
  }

  // Handle getting directions to a building
  handleBuildingGetDirections(building, updateOrigin, updateDestination, userLocation, updateShowTransportation) {
    if (!building) {
      console.error("Building is undefined");
      return;
    }

    if (!building.coordinates || building.coordinates.length === 0) {
      console.error("Building has no coordinates!", building);
      return;
    }

    // Calculate a centroid from building coordinates
    const coords = building.coordinates;
    let sumLat = 0;
    let sumLng = 0;
    
    coords.forEach(coord => {
      sumLat += coord.latitude;
      sumLng += coord.longitude;
    });

    const destination = {
      latitude: sumLat / coords.length,
      longitude: sumLng / coords.length,
    };

    // Set origin and destination for navigation
    if (userLocation) {
      updateOrigin(userLocation);
      updateDestination(destination);
      updateShowTransportation(true);
    } else {
      console.error("User location unavailable for directions");
    }
  }

  // Handle setting a building as a starting point
  handleBuildingSetStartingPoint(building, updateOrigin) {
    if (!building) {
      console.error("Building is undefined");
      return;
    }

    if (!building.coordinates || building.coordinates.length === 0) {
      console.error("Building has no coordinates!", building);
      return;
    }

    // Calculate a centroid from building coordinates
    const coords = building.coordinates;
    let sumLat = 0;
    let sumLng = 0;
    
    coords.forEach(coord => {
      sumLat += coord.latitude;
      sumLng += coord.longitude;
    });

    const origin = {
      latitude: sumLat / coords.length,
      longitude: sumLng / coords.length,
    };

    // Set as origin for navigation
    updateOrigin(origin);
  }

  // Handle shuttle button click
  async handleShuttleButton(updateOrigin, updateDestination, userLocation) {
    try {
      // Switch origin and destination based on current campus
      if (this.model.activeCampus === "sgw") {
        const origin = this.model.coordinatesMap["SGW Campus, Shuttle Stop"];
        const destination = this.model.coordinatesMap["Loyola Campus, Shuttle Stop"];
        
        updateOrigin(origin);
        updateDestination(destination);
        
        // Get shuttle estimate
        const shuttleDetails = await estimateShuttleFromButton(
          this.model.activeCampus,
          userLocation, 
          this.model.coordinatesMap["SGW Campus, Shuttle Stop"], 
          this.model.coordinatesMap["Loyola Campus, Shuttle Stop"]
        );
        
        return shuttleDetails;
      } else {
        const origin = this.model.coordinatesMap["Loyola Campus, Shuttle Stop"];
        const destination = this.model.coordinatesMap["SGW Campus, Shuttle Stop"];
        
        updateOrigin(origin);
        updateDestination(destination);
        
        // Get shuttle estimate
        const shuttleDetails = await estimateShuttleFromButton(
          this.model.activeCampus,
          userLocation, 
          this.model.coordinatesMap["Loyola Campus, Shuttle Stop"], 
          this.model.coordinatesMap["SGW Campus, Shuttle Stop"]
        );
        
        return shuttleDetails;
      }
    } catch (error) {
      console.error("Error handling shuttle button:", error);
      return null;
    }
  }

  // Get all buildings
  getAllBuildings() {
    return this.model.getAllBuildings();
  }

  // Get shuttle route line
  getShuttleRoute() {
    return this.model.getShuttleRoute();
  }

  // Check if user is inside a building
  checkIfInsideBuilding(location) {
    if (!location) return null;

    const buildings = this.model.getAllBuildings();

    for (const building of buildings) {
      if (building.coordinates && building.coordinates.length > 0) {
        // Convert coordinates to the format expected by isPointInPolygon
        const polygonCoords = building.coordinates.map(coord => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        }));

        // Check if user is inside this building
        if (this.model.isPointInPolygon(location, polygonCoords)) {
          return building.name;
        }
      }
    }

    return null;
  }

  // Convert building coordinates
  convertCoordinates(coords) {
    return this.model.convertCoordinates(coords);
  }

  // Calculate centroid
  calculateCentroid(coordinates) {
    return this.model.calculateCentroid(coordinates);
  }
}

export default new OutdoorController();
