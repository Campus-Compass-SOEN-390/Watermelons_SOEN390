import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../constants/outdoorMap";
import { buildings, getBuildingById } from "../api/buildingData";
import { isPointInPolygon } from "geolib";
import { extractShuttleInfo } from "../api/shuttleLiveData";

class OutdoorModel {
  constructor() {
    this.activeCampus = "sgw";
    this.region = sgwRegion;
    this.highlightedBuilding = null;
    this.selectedBuilding = null;
    this.shuttleLocations = [];
    this.shuttleDetails = null;
    this.coordinatesMap = {
      "My Position": undefined,
      "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
      "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849 },
      "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
      "EV Building": { latitude: 45.4957, longitude: -73.5773 },
      "SGW Campus": { latitude: 45.4962, longitude: -73.578 },
      "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
      "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
    };
  }

  // Convert building.coordinates [{latitude, longitude}, ...] to [[lng, lat], ...]
  convertCoordinates(coords) {
    return coords.map(({ latitude, longitude }) => [longitude, latitude]);
  }

  // Function to calculate the centroid of a polygon
  calculateCentroid(coordinates) {
    let x = 0,
      y = 0,
      n = coordinates.length;

    coordinates.forEach(([lng, lat]) => {
      x += lng;
      y += lat;
    });

    return [x / n, y / n]; // Returns [longitude, latitude]
  }

  // Get all buildings
  getAllBuildings() {
    return buildings;
  }

  // Get building by ID
  getBuildingById(id) {
    return getBuildingById(id);
  }

  // Get buildings for current campus
  getBuildingsForCampus() {
    return buildings.filter(
      building => building.campus.toLowerCase() === this.activeCampus.toLowerCase()
    );
  }

  // Get buildings with indoor mapping
  getIndoorBuildingsForCampus() {
    return this.getBuildingsForCampus().filter(
      building => building.hasIndoor === true && building.name.toLowerCase() !== "ve"
    );
  }

  // Check if a location is inside any building
  checkLocationInBuildings(location) {
    if (!location) return null;
    
    for (const building of buildings.filter(b => b.coordinates && b.coordinates.length > 0)) {
      if (isPointInPolygon(location, building.coordinates)) {
        return building.name;
      }
    }
    return null;
  }

  // Get region for current campus
  getCurrentCampusRegion() {
    return this.activeCampus === "sgw" ? sgwRegion : loyolaRegion;
  }

  // Get center coordinates for current campus
  getCurrentCampusCenter() {
    const region = this.getCurrentCampusRegion();
    return [region.longitude, region.latitude];
  }

  // Update user's current position
  updateUserPosition(location) {
    if (location && location.latitude && location.longitude) {
      this.coordinatesMap["My Position"] = {
        latitude: location.latitude,
        longitude: location.longitude
      };
    } else {
      this.coordinatesMap["My Position"] = undefined;
    }
  }

  // Get shuttle route data
  getShuttleRoute() {
    return SGWtoLoyola;
  }

  // Fetch shuttle live locations
  async fetchShuttleLocations() {
    try {
      const shuttleData = await extractShuttleInfo();
      this.shuttleLocations = shuttleData;
      return shuttleData;
    } catch (error) {
      console.warn("Error fetching shuttle data:", error.message);
      return [];
    }
  }
}

export default new OutdoorModel();
