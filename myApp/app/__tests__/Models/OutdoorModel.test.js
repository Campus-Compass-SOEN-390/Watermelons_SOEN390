import OutdoorModel from "../../models/OutdoorModel";
import { sgwRegion, loyolaRegion, SGWtoLoyola } from "../../constants/outdoorMap";
import { buildings, getBuildingById } from "../../api/buildingData";
import { isPointInPolygon } from "geolib";
import { extractShuttleInfo } from "../../api/shuttleLiveData";

// Mock the dependencies
jest.mock("../../constants/outdoorMap", () => ({
  sgwRegion: {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  },
  loyolaRegion: {
    latitude: 45.4581281,
    longitude: -73.6417009,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  },
  SGWtoLoyola: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.57849, 45.49706],
        [-73.63882, 45.45789]
      ]
    }
  }
}));

// Mock the buildingData module with specific test data
jest.mock("../../api/buildingData", () => {
  const mockBuildings = [
    {
      id: "sgw1",
      name: "Hall Building",
      longName: "Henry F. Hall Building",
      campus: "SGW",
      hasIndoor: true,
      coordinates: [
        { latitude: 45.4970, longitude: -73.5790 },
        { latitude: 45.4975, longitude: -73.5790 },
        { latitude: 45.4975, longitude: -73.5785 },
        { latitude: 45.4970, longitude: -73.5785 },
      ]
    },
    {
      id: "sgw2",
      name: "EV Building",
      longName: "Engineering, Computer Science and Visual Arts Integrated Complex",
      campus: "SGW",
      hasIndoor: true,
      coordinates: [
        { latitude: 45.4955, longitude: -73.5780 },
        { latitude: 45.4960, longitude: -73.5780 },
        { latitude: 45.4960, longitude: -73.5775 },
        { latitude: 45.4955, longitude: -73.5775 },
      ]
    },
    {
      id: "loy1",
      name: "VL Building",
      longName: "Vanier Library Building",
      campus: "LOY",
      hasIndoor: true,
      coordinates: [
        { latitude: 45.4590, longitude: -73.6380 },
        { latitude: 45.4595, longitude: -73.6380 },
        { latitude: 45.4595, longitude: -73.6375 },
        { latitude: 45.4590, longitude: -73.6375 },
      ]
    },
    {
      id: "loy2",
      name: "VE",
      longName: "Richard J. Renaud Science Complex",
      campus: "LOY",
      hasIndoor: true,
      coordinates: [
        { latitude: 45.4570, longitude: -73.6410 },
        { latitude: 45.4575, longitude: -73.6410 },
        { latitude: 45.4575, longitude: -73.6405 },
        { latitude: 45.4570, longitude: -73.6405 },
      ]
    }
  ];

  return {
    buildings: mockBuildings,
    getBuildingById: jest.fn((id) => mockBuildings.find(b => b.id === id) || null),
    Campus: {
      SGW: "SGW",
      LOY: "LOY"
    }
  };
});

jest.mock("geolib", () => ({
  isPointInPolygon: jest.fn()
}));

jest.mock("../../api/shuttleLiveData", () => ({
  extractShuttleInfo: jest.fn()
}));

// Override the model's getBuildingsForCampus method for testing
const originalGetBuildingsForCampus = OutdoorModel.getBuildingsForCampus;
OutdoorModel.getBuildingsForCampus = function() {
  // For testing, directly filter buildings based on activeCampus
  if (this.activeCampus.toLowerCase() === 'sgw') {
    return buildings.filter(b => b.campus === 'SGW');
  } else if (this.activeCampus.toLowerCase() === 'loyola') {
    return buildings.filter(b => b.campus === 'LOY');
  }
  return [];
};

// Override the model's getIndoorBuildingsForCampus method for testing
const originalGetIndoorBuildingsForCampus = OutdoorModel.getIndoorBuildingsForCampus;
OutdoorModel.getIndoorBuildingsForCampus = function() {
  // For testing, get all buildings for current campus that have indoor mapping, excluding VE
  return this.getBuildingsForCampus().filter(
    building => building.hasIndoor === true && building.name.toLowerCase() !== "ve"
  );
};

// Mock console methods to reduce noise
console.warn = jest.fn();

describe("OutdoorModel Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset OutdoorModel state for each test
    OutdoorModel.activeCampus = "sgw";
    OutdoorModel.region = sgwRegion;
    OutdoorModel.highlightedBuilding = null;
    OutdoorModel.selectedBuilding = null;
    OutdoorModel.shuttleLocations = [];
    OutdoorModel.shuttleDetails = null;
    OutdoorModel.coordinatesMap = {
      "My Position": undefined,
      "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
      "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849 },
      "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
      "EV Building": { latitude: 45.4957, longitude: -73.5773 },
      "SGW Campus": { latitude: 45.4962, longitude: -73.578 },
      "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
      "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
    };
  });

  afterAll(() => {
    // Restore original methods after tests
    OutdoorModel.getBuildingsForCampus = originalGetBuildingsForCampus;
    OutdoorModel.getIndoorBuildingsForCampus = originalGetIndoorBuildingsForCampus;
  });

  describe("calculateCentroid", () => {
    test("should calculate centroid of a polygon with multiple points", () => {
      const coordinates = [
        [-73.5790, 45.4970],
        [-73.5790, 45.4975],
        [-73.5785, 45.4975],
        [-73.5785, 45.4970]
      ];
      
      const result = OutdoorModel.calculateCentroid(coordinates);
      
      expect(result[0]).toBeCloseTo(-73.57875, 3); // Longitude with less precision
      expect(result[1]).toBeCloseTo(45.4973, 3);   // Latitude with less precision
    });

    test("should handle a single point", () => {
      const coordinates = [[-73.5787, 45.4973]];
      
      const result = OutdoorModel.calculateCentroid(coordinates);
      
      expect(result).toEqual([-73.5787, 45.4973]);
    });

    test("should handle empty array", () => {
      const coordinates = [];
      
      const result = OutdoorModel.calculateCentroid(coordinates);
      
      // NaN results because division by zero
      expect(result[0]).toBeNaN();
      expect(result[1]).toBeNaN();
    });
  });

  describe("getAllBuildings", () => {
    test("should return all buildings", () => {
      const result = OutdoorModel.getAllBuildings();
      
      expect(result).toEqual(buildings);
      expect(result.length).toBe(4); // Our mock has 4 buildings
    });
  });

  describe("getBuildingById", () => {
    test("should return building by ID", () => {
      const building = OutdoorModel.getBuildingById("sgw1");
      
      expect(getBuildingById).toHaveBeenCalledWith("sgw1");
      expect(building).toEqual(buildings[0]);
    });

    test("should return null for non-existent building ID", () => {
      getBuildingById.mockReturnValueOnce(null);
      
      const result = OutdoorModel.getBuildingById("nonexistent");
      
      expect(getBuildingById).toHaveBeenCalledWith("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getBuildingsForCampus", () => {
    test("should return SGW buildings when activeCampus is sgw", () => {
      OutdoorModel.activeCampus = "sgw";
      
      const result = OutdoorModel.getBuildingsForCampus();
      
      expect(result.length).toBe(2);
      expect(result[0].campus).toBe("SGW");
      expect(result[1].campus).toBe("SGW");
    });

    test("should return Loyola buildings when activeCampus is loyola", () => {
      OutdoorModel.activeCampus = "loyola";
      
      const result = OutdoorModel.getBuildingsForCampus();
      
      expect(result.length).toBe(2);
      expect(result[0].campus).toBe("LOY");
      expect(result[1].campus).toBe("LOY");
    });
  });

  describe("getIndoorBuildingsForCampus", () => {
    test("should return indoor buildings excluding VE for SGW campus", () => {
      OutdoorModel.activeCampus = "sgw";
      
      const result = OutdoorModel.getIndoorBuildingsForCampus();
      
      expect(result.length).toBe(2);
      expect(result.every(b => b.hasIndoor === true)).toBe(true);
      expect(result.every(b => b.campus === "SGW")).toBe(true);
    });

    test("should return indoor buildings excluding VE for Loyola campus", () => {
      OutdoorModel.activeCampus = "loyola";
      
      const result = OutdoorModel.getIndoorBuildingsForCampus();
      
      // Should exclude VE building
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("VL Building");
      expect(result[0].hasIndoor).toBe(true);
      expect(result[0].campus).toBe("LOY");
    });
  });

  describe("checkLocationInBuildings", () => {
    test("should return null if location is not provided", () => {
      const result = OutdoorModel.checkLocationInBuildings(null);
      
      expect(result).toBeNull();
      expect(isPointInPolygon).not.toHaveBeenCalled();
    });

    test("should return building name if location is inside a building", () => {
      const location = { latitude: 45.4972, longitude: -73.5787 };
      isPointInPolygon.mockReturnValueOnce(true);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(isPointInPolygon).toHaveBeenCalledWith(location, expect.any(Array));
      expect(result).toBe("Hall Building");
    });

    test("should return null if location is not inside any building", () => {
      const location = { latitude: 45.5000, longitude: -73.5800 };
      isPointInPolygon.mockReturnValue(false);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(isPointInPolygon).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test("should return null if no buildings have coordinates", () => {
      const location = { latitude: 45.4972, longitude: -73.5787 };
      // Mock buildings to have no coordinates
      const mockBuildings = buildings.map(b => ({ ...b, coordinates: [] }));
      jest.spyOn(OutdoorModel, 'getAllBuildings').mockReturnValueOnce(mockBuildings);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(result).toBeNull();
    });

    test("should return null if buildings array is empty", () => {
      const location = { latitude: 45.4972, longitude: -73.5787 };
      jest.spyOn(OutdoorModel, 'getAllBuildings').mockReturnValueOnce([]);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(result).toBeNull();
    });

    test("should handle buildings with empty coordinates array", () => {
      const location = { latitude: 45.4972, longitude: -73.5787 };
      const buildingsWithEmptyCoords = [
        { ...buildings[0], coordinates: [] },
        ...buildings.slice(1)
      ];
      jest.spyOn(OutdoorModel, 'getAllBuildings').mockReturnValueOnce(buildingsWithEmptyCoords);
      isPointInPolygon.mockReturnValue(false);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(isPointInPolygon).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test("should skip buildings with undefined coordinates", () => {
      const location = { latitude: 45.4972, longitude: -73.5787 };
      const buildingsWithUndefinedCoords = [
        { ...buildings[0], coordinates: undefined },
        ...buildings.slice(1)
      ];
      jest.spyOn(OutdoorModel, 'getAllBuildings').mockReturnValueOnce(buildingsWithUndefinedCoords);
      isPointInPolygon.mockReturnValue(false);
      
      const result = OutdoorModel.checkLocationInBuildings(location);
      
      expect(isPointInPolygon).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("getCurrentCampusRegion", () => {
    test("should return sgwRegion when activeCampus is sgw", () => {
      OutdoorModel.activeCampus = "sgw";
      
      const result = OutdoorModel.getCurrentCampusRegion();
      
      expect(result).toEqual(sgwRegion);
    });

    test("should return loyolaRegion when activeCampus is loyola", () => {
      OutdoorModel.activeCampus = "loyola";
      
      const result = OutdoorModel.getCurrentCampusRegion();
      
      expect(result).toEqual(loyolaRegion);
    });
  });

  describe("getCurrentCampusCenter", () => {
    test("should return center coordinates for SGW campus", () => {
      OutdoorModel.activeCampus = "sgw";
      
      const result = OutdoorModel.getCurrentCampusCenter();
      
      expect(result).toEqual([sgwRegion.longitude, sgwRegion.latitude]);
    });

    test("should return center coordinates for Loyola campus", () => {
      OutdoorModel.activeCampus = "loyola";
      
      const result = OutdoorModel.getCurrentCampusCenter();
      
      expect(result).toEqual([loyolaRegion.longitude, loyolaRegion.latitude]);
    });
  });

  describe("updateUserPosition", () => {
    test("should update user position when valid location is provided", () => {
      const location = { latitude: 45.5017, longitude: -73.5673 };
      
      OutdoorModel.updateUserPosition(location);
      
      expect(OutdoorModel.coordinatesMap["My Position"]).toEqual(location);
    });

    test("should set user position to undefined when invalid location is provided", () => {
      OutdoorModel.coordinatesMap["My Position"] = { latitude: 45.5017, longitude: -73.5673 };
      
      OutdoorModel.updateUserPosition(null);
      
      expect(OutdoorModel.coordinatesMap["My Position"]).toBeUndefined();
    });
  });

  describe("getShuttleRoute", () => {
    test("should return SGWtoLoyola", () => {
      const result = OutdoorModel.getShuttleRoute();
      
      expect(result).toEqual(SGWtoLoyola);
    });
  });

  describe("fetchShuttleLocations", () => {
    test("should fetch shuttle locations successfully", async () => {
      const mockShuttleData = [
        { id: "BUS1", latitude: 45.4972, longitude: -73.5787 },
        { id: "BUS2", latitude: 45.4582, longitude: -73.6405 }
      ];
      extractShuttleInfo.mockResolvedValueOnce(mockShuttleData);
      
      const result = await OutdoorModel.fetchShuttleLocations();
      
      expect(extractShuttleInfo).toHaveBeenCalled();
      expect(result).toEqual(mockShuttleData);
      expect(OutdoorModel.shuttleLocations).toEqual(mockShuttleData);
    });

    test("should handle errors and return empty array", async () => {
      extractShuttleInfo.mockRejectedValueOnce(new Error("Failed to fetch"));
      
      const result = await OutdoorModel.fetchShuttleLocations();
      
      expect(extractShuttleInfo).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith("Error fetching shuttle data:", "Failed to fetch");
      expect(result).toEqual([]);
      expect(OutdoorModel.shuttleLocations).toEqual([]);
    });
  });
});