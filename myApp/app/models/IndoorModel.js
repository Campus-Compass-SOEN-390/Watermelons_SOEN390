import { hGraph, hNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/Hall";
import { ccGraph, ccNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/CC";
import { loyolaGraph, loyolaNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/Loyola";
import { mbGraph, mbNodeCoordinates } from "../components/IndoorMap/GraphAndCoordinates/MB";
import { indoorCoordinatesMap } from "../components/IndoorMap/GraphAndCoordinates/GraphAndCoordinates";

class IndoorModel {
  constructor() {
    this.isExpanded = false;
    this.selectedIndoorBuilding = null;
    this.selectedFloor = 1;
    
    // Combine Graphs and Coordinates
    this.graph = { ...hGraph, ...mbGraph, ...ccGraph, ...loyolaGraph };
    this.nodeCoordinates = { 
      ...hNodeCoordinates, 
      ...mbNodeCoordinates, 
      ...ccNodeCoordinates, 
      ...loyolaNodeCoordinates 
    };
    
    this.indoorCoordinatesMap = indoorCoordinatesMap;
  }

  // Convert building.coordinates [{latitude, longitude}, ...] to [[lng, lat], ...]
  convertCoordinates(coords) {
    return coords.map(({ latitude, longitude }) => [longitude, latitude]);
  }

  // Calculate the centroid of a polygon
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

  // Get the center coordinates of a building
  getBuildingCenter(building) {
    return this.calculateCentroid(this.convertCoordinates(building.coordinates));
  }

  // Check if this building has indoor mapping available
  hasIndoorMapping(building) {
    return building && building.hasIndoor === true;
  }
}

export default new IndoorModel();
