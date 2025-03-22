import OutdoorController from "../../controllers/OutdoorController";
import OutdoorModel from "../../models/OutdoorModel";
import { estimateShuttleFromButton } from "../../utils/shuttleUtils";

// Mock dependencies
jest.mock("../../models/OutdoorModel", () => ({
  activeCampus: "sgw",
  toggleCampus: jest.fn(),
  getCurrentCampusRegion: jest.fn(),
  getBuildingById: jest.fn(),
  selectedBuilding: null,
  getAllBuildings: jest.fn(),
  getShuttleRoute: jest.fn(),
  isPointInPolygon: jest.fn(),
  convertCoordinates: jest.fn(),
  calculateCentroid: jest.fn(),
  coordinatesMap: {
    "My Position": undefined,
    "Hall Building": { latitude: 45.4961, longitude: -73.5772 },
    "Loyola Campus, Shuttle Stop": { latitude: 45.49706, longitude: -73.57849 },
    "SGW Campus, Shuttle Stop": { latitude: 45.45789, longitude: -73.63882 },
    "EV Building": { latitude: 45.4957, longitude: -73.5773 },
    "SGW Campus": { latitude: 45.4962, longitude: -73.578 },
    "Loyola Campus": { latitude: 45.4582, longitude: -73.6405 },
    "Montreal Downtown": { latitude: 45.5017, longitude: -73.5673 },
  },
}));

jest.mock("../../utils/shuttleUtils", () => ({
  estimateShuttleFromButton: jest.fn(),
}));

describe("OutdoorController Tests", () => {
  let mockMapRef;
  let mockUpdateOrigin;
  let mockUpdateDestination;
  let mockUpdateShowTransportation;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    OutdoorModel.activeCampus = "sgw";
    OutdoorModel.selectedBuilding = null;
    
    // Create mock refs and functions
    mockMapRef = {
      current: {
        setCamera: jest.fn()
      }
    };
    
    mockUpdateOrigin = jest.fn();
    mockUpdateDestination = jest.fn();
    mockUpdateShowTransportation = jest.fn();
  });

  describe("toggleCampus", () => {
    test("should toggle campus from SGW to Loyola", () => {
      OutdoorModel.activeCampus = "sgw";
      
      const result = OutdoorController.toggleCampus(mockMapRef);
      
      expect(OutdoorModel.activeCampus).toBe("loy");
      expect(result).toBe("loy");
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [-73.6417009, 45.4581281],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should toggle campus from Loyola to SGW", () => {
      OutdoorModel.activeCampus = "loy";
      
      const result = OutdoorController.toggleCampus(mockMapRef);
      
      expect(OutdoorModel.activeCampus).toBe("sgw");
      expect(result).toBe("sgw");
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [-73.5792229, 45.4951962],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should handle case when mapRef is null", () => {
      const result = OutdoorController.toggleCampus({ current: null });
      
      expect(OutdoorModel.activeCampus).toBe("loy");
      expect(result).toBe("loy");
      expect(mockMapRef.current.setCamera).not.toHaveBeenCalled();
    });
  });

  describe("centerMapOnCampus", () => {
    test("should set camera to current campus region", () => {
      const mockRegion = {
        latitude: 45.4962,
        longitude: -73.5772
      };
      
      OutdoorModel.getCurrentCampusRegion.mockReturnValueOnce(mockRegion);
      
      OutdoorController.centerMapOnCampus(mockMapRef);
      
      expect(OutdoorModel.getCurrentCampusRegion).toHaveBeenCalled();
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [mockRegion.longitude, mockRegion.latitude],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should handle case when mapRef is null", () => {
      OutdoorController.centerMapOnCampus({ current: null });
      
      expect(OutdoorModel.getCurrentCampusRegion).not.toHaveBeenCalled();
    });
  });

  describe("centerMapOnUser", () => {
    test("should set camera to user location", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      
      OutdoorController.centerMapOnUser(mockMapRef, location);
      
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 17,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should not set camera if location is null", () => {
      OutdoorController.centerMapOnUser(mockMapRef, null);
      
      expect(mockMapRef.current.setCamera).not.toHaveBeenCalled();
    });
    
    test("should handle case when mapRef is null", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      
      OutdoorController.centerMapOnUser({ current: null }, location);
      
      expect(mockMapRef.current.setCamera).not.toHaveBeenCalled();
    });
  });

  describe("handleBuildingPress", () => {
    test("should set selected building and return it", () => {
      const building = { id: "building1" };
      const fullBuilding = { id: "building1", name: "Hall Building" };
      
      OutdoorModel.getBuildingById.mockReturnValueOnce(fullBuilding);
      
      const result = OutdoorController.handleBuildingPress(building);
      
      expect(OutdoorModel.getBuildingById).toHaveBeenCalledWith(building.id);
      expect(OutdoorModel.selectedBuilding).toBe(fullBuilding);
      expect(result).toBe(fullBuilding);
    });
    
    test("should return null if building is null", () => {
      const result = OutdoorController.handleBuildingPress(null);
      
      expect(OutdoorModel.getBuildingById).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    test("should return null if building has no id", () => {
      const building = { name: "Building without ID" };
      
      const result = OutdoorController.handleBuildingPress(building);
      
      expect(OutdoorModel.getBuildingById).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("handleBuildingGetDirections", () => {
    test("should set origin and destination for directions", () => {
      const building = {
        coordinates: [
          { latitude: 45.4967, longitude: -73.5782 },
          { latitude: 45.4969, longitude: -73.5784 },
          { latitude: 45.4965, longitude: -73.5786 }
        ]
      };
      const userLocation = { latitude: 45.4962, longitude: -73.5772 };
      
      OutdoorController.handleBuildingGetDirections(
        building,
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation,
        mockUpdateShowTransportation
      );
      
      // Expected centroid calculation: average of lat/lng
      const expectedDestination = {
        latitude: (45.4967 + 45.4969 + 45.4965) / 3,
        longitude: (-73.5782 + -73.5784 + -73.5786) / 3
      };
      
      expect(mockUpdateOrigin).toHaveBeenCalledWith(userLocation);
      expect(mockUpdateDestination).toHaveBeenCalledWith(expectedDestination);
      expect(mockUpdateShowTransportation).toHaveBeenCalledWith(true);
    });
    
    test("should handle error when building is null", () => {
      console.error = jest.fn();
      
      OutdoorController.handleBuildingGetDirections(
        null,
        mockUpdateOrigin,
        mockUpdateDestination,
        { latitude: 45.4962, longitude: -73.5772 },
        mockUpdateShowTransportation
      );
      
      expect(console.error).toHaveBeenCalledWith("Building is undefined");
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
      expect(mockUpdateDestination).not.toHaveBeenCalled();
      expect(mockUpdateShowTransportation).not.toHaveBeenCalled();
    });
    
    test("should handle error when building has no coordinates", () => {
      console.error = jest.fn();
      
      OutdoorController.handleBuildingGetDirections(
        { name: "Building without coordinates" },
        mockUpdateOrigin,
        mockUpdateDestination,
        { latitude: 45.4962, longitude: -73.5772 },
        mockUpdateShowTransportation
      );
      
      expect(console.error).toHaveBeenCalledWith(
        "Building has no coordinates!",
        { name: "Building without coordinates" }
      );
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
      expect(mockUpdateDestination).not.toHaveBeenCalled();
      expect(mockUpdateShowTransportation).not.toHaveBeenCalled();
    });
    
    test("should handle error when user location is not available", () => {
      console.error = jest.fn();
      
      OutdoorController.handleBuildingGetDirections(
        {
          coordinates: [
            { latitude: 45.4967, longitude: -73.5782 },
            { latitude: 45.4969, longitude: -73.5784 }
          ]
        },
        mockUpdateOrigin,
        mockUpdateDestination,
        null,
        mockUpdateShowTransportation
      );
      
      expect(console.error).toHaveBeenCalledWith("User location unavailable for directions");
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
      expect(mockUpdateDestination).not.toHaveBeenCalled();
      expect(mockUpdateShowTransportation).not.toHaveBeenCalled();
    });
  });

  describe("handleBuildingSetStartingPoint", () => {
    test("should set building as starting point", () => {
      const building = {
        coordinates: [
          { latitude: 45.4967, longitude: -73.5782 },
          { latitude: 45.4969, longitude: -73.5784 },
          { latitude: 45.4965, longitude: -73.5786 }
        ]
      };
      
      OutdoorController.handleBuildingSetStartingPoint(building, mockUpdateOrigin);
      
      // Expected centroid calculation: average of lat/lng
      const expectedOrigin = {
        latitude: (45.4967 + 45.4969 + 45.4965) / 3,
        longitude: (-73.5782 + -73.5784 + -73.5786) / 3
      };
      
      expect(mockUpdateOrigin).toHaveBeenCalledWith(expectedOrigin);
    });
    
    test("should handle error when building is null", () => {
      console.error = jest.fn();
      
      OutdoorController.handleBuildingSetStartingPoint(null, mockUpdateOrigin);
      
      expect(console.error).toHaveBeenCalledWith("Building is undefined");
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
    });
    
    test("should handle error when building has no coordinates", () => {
      console.error = jest.fn();
      
      OutdoorController.handleBuildingSetStartingPoint(
        { name: "Building without coordinates" },
        mockUpdateOrigin
      );
      
      expect(console.error).toHaveBeenCalledWith(
        "Building has no coordinates!",
        { name: "Building without coordinates" }
      );
      expect(mockUpdateOrigin).not.toHaveBeenCalled();
    });
  });

  describe("handleShuttleButton", () => {
    test("should set shuttle route from SGW to Loyola", async () => {
      OutdoorModel.activeCampus = "sgw";
      const userLocation = { latitude: 45.4962, longitude: -73.5772 };
      const mockShuttleDetails = { 
        estimate: "10 minutes", 
        nextDeparture: "10:30" 
      };
      
      estimateShuttleFromButton.mockResolvedValueOnce(mockShuttleDetails);
      
      const result = await OutdoorController.handleShuttleButton(
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation
      );
      
      expect(mockUpdateOrigin).toHaveBeenCalledWith(
        OutdoorModel.coordinatesMap["SGW Campus, Shuttle Stop"]
      );
      expect(mockUpdateDestination).toHaveBeenCalledWith(
        OutdoorModel.coordinatesMap["Loyola Campus, Shuttle Stop"]
      );
      expect(estimateShuttleFromButton).toHaveBeenCalledWith(
        "sgw",
        userLocation,
        OutdoorModel.coordinatesMap["SGW Campus, Shuttle Stop"],
        OutdoorModel.coordinatesMap["Loyola Campus, Shuttle Stop"]
      );
      expect(result).toBe(mockShuttleDetails);
    });
    
    test("should set shuttle route from Loyola to SGW", async () => {
      OutdoorModel.activeCampus = "loyola";
      const userLocation = { latitude: 45.4582, longitude: -73.6405 };
      const mockShuttleDetails = { 
        estimate: "15 minutes", 
        nextDeparture: "10:45" 
      };
      
      estimateShuttleFromButton.mockResolvedValueOnce(mockShuttleDetails);
      
      const result = await OutdoorController.handleShuttleButton(
        mockUpdateOrigin,
        mockUpdateDestination,
        userLocation
      );
      
      expect(mockUpdateOrigin).toHaveBeenCalledWith(
        OutdoorModel.coordinatesMap["Loyola Campus, Shuttle Stop"]
      );
      expect(mockUpdateDestination).toHaveBeenCalledWith(
        OutdoorModel.coordinatesMap["SGW Campus, Shuttle Stop"]
      );
      expect(estimateShuttleFromButton).toHaveBeenCalledWith(
        "loyola",
        userLocation,
        OutdoorModel.coordinatesMap["Loyola Campus, Shuttle Stop"],
        OutdoorModel.coordinatesMap["SGW Campus, Shuttle Stop"]
      );
      expect(result).toBe(mockShuttleDetails);
    });
    
    test("should handle errors", async () => {
      const error = new Error("Shuttle error");
      console.error = jest.fn();
      
      estimateShuttleFromButton.mockRejectedValueOnce(error);
      
      const result = await OutdoorController.handleShuttleButton(
        mockUpdateOrigin,
        mockUpdateDestination,
        { latitude: 45.4962, longitude: -73.5772 }
      );
      
      expect(console.error).toHaveBeenCalledWith("Error handling shuttle button:", error);
      expect(result).toBeNull();
    });
  });

  describe("getAllBuildings", () => {
    test("should return all buildings from model", () => {
      const mockBuildings = [{ id: "building1" }, { id: "building2" }];
      
      OutdoorModel.getAllBuildings.mockReturnValueOnce(mockBuildings);
      
      const result = OutdoorController.getAllBuildings();
      
      expect(OutdoorModel.getAllBuildings).toHaveBeenCalled();
      expect(result).toBe(mockBuildings);
    });
  });

  describe("getShuttleRoute", () => {
    test("should return shuttle route from model", () => {
      const mockRoute = { type: "Feature", geometry: { type: "LineString" } };
      
      OutdoorModel.getShuttleRoute.mockReturnValueOnce(mockRoute);
      
      const result = OutdoorController.getShuttleRoute();
      
      expect(OutdoorModel.getShuttleRoute).toHaveBeenCalled();
      expect(result).toBe(mockRoute);
    });
  });

  describe("checkIfInsideBuilding", () => {
    test("should return building name if user is inside a building", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      const mockBuildings = [
        {
          name: "Hall Building",
          coordinates: [
            { latitude: 45.4960, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5775 },
            { latitude: 45.4960, longitude: -73.5775 }
          ]
        },
        {
          name: "Library Building",
          coordinates: [
            { latitude: 45.4970, longitude: -73.5780 },
            { latitude: 45.4975, longitude: -73.5780 },
            { latitude: 45.4975, longitude: -73.5785 },
            { latitude: 45.4970, longitude: -73.5785 }
          ]
        }
      ];
      
      OutdoorModel.getAllBuildings.mockReturnValueOnce(mockBuildings);
      OutdoorModel.isPointInPolygon.mockReturnValueOnce(true);
      
      const result = OutdoorController.checkIfInsideBuilding(location);
      
      expect(OutdoorModel.getAllBuildings).toHaveBeenCalled();
      expect(OutdoorModel.isPointInPolygon).toHaveBeenCalledWith(
        location,
        mockBuildings[0].coordinates
      );
      expect(result).toBe("Hall Building");
    });
    
    test("should return null if user is not inside any building", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      const mockBuildings = [
        {
          name: "Hall Building",
          coordinates: [
            { latitude: 45.4960, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5775 },
            { latitude: 45.4960, longitude: -73.5775 }
          ]
        }
      ];
      
      OutdoorModel.getAllBuildings.mockReturnValueOnce(mockBuildings);
      OutdoorModel.isPointInPolygon.mockReturnValueOnce(false);
      
      const result = OutdoorController.checkIfInsideBuilding(location);
      
      expect(OutdoorModel.getAllBuildings).toHaveBeenCalled();
      expect(OutdoorModel.isPointInPolygon).toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    test("should return null if location is null", () => {
      const result = OutdoorController.checkIfInsideBuilding(null);
      
      expect(OutdoorModel.getAllBuildings).not.toHaveBeenCalled();
      expect(OutdoorModel.isPointInPolygon).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    test("should skip buildings with no coordinates", () => {
      const location = { latitude: 45.4962, longitude: -73.5772 };
      const mockBuildings = [
        { name: "Building without coordinates" },
        {
          name: "Hall Building",
          coordinates: [
            { latitude: 45.4960, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5770 },
            { latitude: 45.4965, longitude: -73.5775 },
            { latitude: 45.4960, longitude: -73.5775 }
          ]
        }
      ];
      
      OutdoorModel.getAllBuildings.mockReturnValueOnce(mockBuildings);
      OutdoorModel.isPointInPolygon.mockReturnValueOnce(true);
      
      const result = OutdoorController.checkIfInsideBuilding(location);
      
      expect(OutdoorModel.getAllBuildings).toHaveBeenCalled();
      expect(OutdoorModel.isPointInPolygon).toHaveBeenCalledWith(
        location,
        mockBuildings[1].coordinates
      );
      expect(result).toBe("Hall Building");
    });
  });

  describe("convertCoordinates", () => {
    test("should call model's convertCoordinates method with arguments", () => {
      const coords = [
        { latitude: 45.4967, longitude: -73.5782 },
        { latitude: 45.4969, longitude: -73.5784 }
      ];
      const mockConvertedCoords = [
        [-73.5782, 45.4967],
        [-73.5784, 45.4969]
      ];
      
      OutdoorModel.convertCoordinates.mockReturnValueOnce(mockConvertedCoords);
      
      const result = OutdoorController.convertCoordinates(coords);
      
      expect(OutdoorModel.convertCoordinates).toHaveBeenCalledWith(coords);
      expect(result).toBe(mockConvertedCoords);
    });
  });

  describe("calculateCentroid", () => {
    test("should call model's calculateCentroid method with arguments", () => {
      const coordinates = [
        [-73.5782, 45.4967],
        [-73.5784, 45.4969]
      ];
      const mockCentroid = [-73.5783, 45.4968];
      
      OutdoorModel.calculateCentroid.mockReturnValueOnce(mockCentroid);
      
      const result = OutdoorController.calculateCentroid(coordinates);
      
      expect(OutdoorModel.calculateCentroid).toHaveBeenCalledWith(coordinates);
      expect(result).toBe(mockCentroid);
    });
  });
});