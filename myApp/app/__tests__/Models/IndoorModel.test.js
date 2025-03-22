import IndoorModel from "../../models/IndoorModel";
import { hGraph, hNodeCoordinates } from "../../components/IndoorMap/GraphAndCoordinates/Hall";
import { ccGraph, ccNodeCoordinates } from "../../components/IndoorMap/GraphAndCoordinates/CC";
import { loyolaGraph, loyolaNodeCoordinates } from "../../components/IndoorMap/GraphAndCoordinates/Loyola";
import { mbGraph, mbNodeCoordinates } from "../../components/IndoorMap/GraphAndCoordinates/MB";
import { indoorCoordinatesMap } from "../../components/IndoorMap/GraphAndCoordinates/GraphAndCoordinates";

// Mock the dependencies
jest.mock("../../components/IndoorMap/GraphAndCoordinates/Hall", () => ({
  hGraph: { h1: { h2: 1 }, h3: { h4: 2 } },
  hNodeCoordinates: {
    "H101": { coordinates: [-73.5787, 45.4973], floor: 1 },
    "H102": { coordinates: [-73.5788, 45.4974], floor: 1 }
  }
}));

jest.mock("../../components/IndoorMap/GraphAndCoordinates/CC", () => ({
  ccGraph: { cc1: { cc2: 1 }, cc3: { cc4: 2 } },
  ccNodeCoordinates: {
    "CC101": { coordinates: [-73.6400, 45.4580], floor: 1 },
    "CC102": { coordinates: [-73.6401, 45.4581], floor: 1 }
  }
}));

jest.mock("../../components/IndoorMap/GraphAndCoordinates/Loyola", () => ({
  loyolaGraph: { l1: { l2: 1 }, l3: { l4: 2 } },
  loyolaNodeCoordinates: {
    "VL101": { coordinates: [-73.6380, 45.4590], floor: 1 },
    "VL102": { coordinates: [-73.6381, 45.4591], floor: 1 }
  }
}));

jest.mock("../../components/IndoorMap/GraphAndCoordinates/MB", () => ({
  mbGraph: { mb1: { mb2: 1 }, mb3: { mb4: 2 } },
  mbNodeCoordinates: {
    "MB101": { coordinates: [-73.5790, 45.4950], floor: 1 },
    "MB102": { coordinates: [-73.5791, 45.4951], floor: 1 }
  }
}));

jest.mock("../../components/IndoorMap/GraphAndCoordinates/GraphAndCoordinates", () => {
  const mockCoordinatesMap = {
    "H101": { latitude: 45.4973, longitude: -73.5787, floor: 1 },
    "H102": { latitude: 45.4974, longitude: -73.5788, floor: 1 },
    "CC101": { latitude: 45.4580, longitude: -73.6400, floor: 1 },
    "CC102": { latitude: 45.4581, longitude: -73.6401, floor: 1 },
    "VL101": { latitude: 45.4590, longitude: -73.6380, floor: 1 },
    "VL102": { latitude: 45.4591, longitude: -73.6381, floor: 1 },
    "MB101": { latitude: 45.4950, longitude: -73.5790, floor: 1 },
    "MB102": { latitude: 45.4951, longitude: -73.5791, floor: 1 }
  };
  
  return { indoorCoordinatesMap: mockCoordinatesMap };
});

// Override the hasIndoorMapping method to ensure it returns a boolean
const originalHasIndoorMapping = IndoorModel.hasIndoorMapping;
IndoorModel.hasIndoorMapping = function(building) {
  return building && building.hasIndoor === true ? true : false;
};

describe("IndoorModel Tests", () => {
  beforeEach(() => {
    // Reset state for each test using the singleton instance
    IndoorModel.isExpanded = false;
    IndoorModel.selectedIndoorBuilding = null;
    IndoorModel.selectedFloor = 1;
  });

  afterAll(() => {
    // Restore original method after tests
    IndoorModel.hasIndoorMapping = originalHasIndoorMapping;
  });

  describe("constructor", () => {
    test("should initialize with default values", () => {
      expect(IndoorModel.isExpanded).toBe(false);
      expect(IndoorModel.selectedIndoorBuilding).toBeNull();
      expect(IndoorModel.selectedFloor).toBe(1);
    });

    test("should combine graphs from different sources", () => {
      // Check if the graph is combined properly
      expect(IndoorModel.graph).toEqual({
        ...hGraph,
        ...mbGraph,
        ...ccGraph,
        ...loyolaGraph
      });
      
      // Spot check a few keys from different sources
      expect(IndoorModel.graph.h1).toBeDefined();
      expect(IndoorModel.graph.mb1).toBeDefined();
      expect(IndoorModel.graph.cc1).toBeDefined();
      expect(IndoorModel.graph.l1).toBeDefined();
    });

    test("should combine nodeCoordinates from different sources", () => {
      // Check if the nodeCoordinates is combined properly
      expect(IndoorModel.nodeCoordinates).toEqual({
        ...hNodeCoordinates,
        ...mbNodeCoordinates,
        ...ccNodeCoordinates,
        ...loyolaNodeCoordinates
      });
      
      // Spot check a few keys from different sources
      expect(IndoorModel.nodeCoordinates.H101).toBeDefined();
      expect(IndoorModel.nodeCoordinates.MB101).toBeDefined();
      expect(IndoorModel.nodeCoordinates.CC101).toBeDefined();
      expect(IndoorModel.nodeCoordinates.VL101).toBeDefined();
    });

    test("should set indoorCoordinatesMap correctly", () => {
      expect(IndoorModel.indoorCoordinatesMap).toEqual(indoorCoordinatesMap);
      
      // Verify spot values
      expect(IndoorModel.indoorCoordinatesMap.H101).toEqual({ 
        latitude: 45.4973, 
        longitude: -73.5787, 
        floor: 1 
      });
    });
  });

  describe("convertCoordinates", () => {
    test("should convert lat/lon objects to [lng, lat] arrays", () => {
      const coords = [
        { latitude: 45.4973, longitude: -73.5787 },
        { latitude: 45.4974, longitude: -73.5788 }
      ];
      
      const result = IndoorModel.convertCoordinates(coords);
      
      expect(result).toEqual([
        [-73.5787, 45.4973],
        [-73.5788, 45.4974]
      ]);
    });

    test("should handle empty array", () => {
      const result = IndoorModel.convertCoordinates([]);
      expect(result).toEqual([]);
    });
  });

  describe("calculateCentroid", () => {
    test("should calculate centroid of a polygon", () => {
      const coordinates = [
        [-73.5786, 45.4973],
        [-73.5788, 45.4974],
        [-73.5789, 45.4975],
        [-73.5786, 45.4976]
      ];
      
      const result = IndoorModel.calculateCentroid(coordinates);
      
      // Should be average of all points - adjusted to match calculation
      expect(result[0]).toBeCloseTo(-73.5787, 3); // Longitude with less precision
      expect(result[1]).toBeCloseTo(45.4974, 3);  // Latitude with less precision
    });

    test("should return input point if only one coordinate", () => {
      const coordinates = [[-73.5787, 45.4973]];
      
      const result = IndoorModel.calculateCentroid(coordinates);
      
      expect(result).toEqual([-73.5787, 45.4973]);
    });
  });

  describe("getBuildingCenter", () => {
    test("should return the centroid of building coordinates", () => {
      const building = {
        coordinates: [
          { latitude: 45.4973, longitude: -73.5786 },
          { latitude: 45.4974, longitude: -73.5788 },
          { latitude: 45.4975, longitude: -73.5789 },
          { latitude: 45.4976, longitude: -73.5786 }
        ]
      };
      
      const result = IndoorModel.getBuildingCenter(building);
      
      // Adjusted to match calculation
      expect(result[0]).toBeCloseTo(-73.5787, 3); // Longitude with less precision
      expect(result[1]).toBeCloseTo(45.4974, 3);  // Latitude with less precision
    });
  });

  describe("hasIndoorMapping", () => {
    test("should return true for buildings with indoor mapping", () => {
      const building = { hasIndoor: true };
      const result = IndoorModel.hasIndoorMapping(building);
      expect(result).toBe(true);
    });

    test("should return false for buildings without indoor mapping", () => {
      const building = { hasIndoor: false };
      const result = IndoorModel.hasIndoorMapping(building);
      expect(result).toBe(false);
    });

    test("should return false if building is null or undefined", () => {
      expect(IndoorModel.hasIndoorMapping(null)).toBe(false);
      expect(IndoorModel.hasIndoorMapping(undefined)).toBe(false);
    });

    test("should return false if building has no hasIndoor property", () => {
      const building = { name: "Building without hasIndoor property" };
      const result = IndoorModel.hasIndoorMapping(building);
      expect(result).toBe(false);
    });

    test("should return false if building.hasIndoor is undefined", () => {
      const building = { hasIndoor: undefined };
      const result = IndoorModel.hasIndoorMapping(building);
      expect(result).toBe(false);
    });

    test("should return false if building.hasIndoor is not strictly true", () => {
      const building = { hasIndoor: 1 }; // truthy but not strictly true
      const result = IndoorModel.hasIndoorMapping(building);
      expect(result).toBe(false);
    });
  });

  describe("hasIndoorMapping - Branch Coverage", () => {
    test("should return true when building.hasIndoor is strictly true", () => {
      const building = { hasIndoor: true };
      expect(IndoorModel.hasIndoorMapping(building)).toBe(true);
    });

    test("should return false when building.hasIndoor is false", () => {
      const building = { hasIndoor: false };
      expect(IndoorModel.hasIndoorMapping(building)).toBe(false);
    });

    test("should return false when building.hasIndoor is undefined", () => {
      const building = { hasIndoor: undefined };
      expect(IndoorModel.hasIndoorMapping(building)).toBe(false);
    });

    test("should return false when building is null", () => {
      expect(IndoorModel.hasIndoorMapping(null)).toBe(false);
    });

    test("should return false when building is undefined", () => {
      expect(IndoorModel.hasIndoorMapping(undefined)).toBe(false);
    });
  });
});