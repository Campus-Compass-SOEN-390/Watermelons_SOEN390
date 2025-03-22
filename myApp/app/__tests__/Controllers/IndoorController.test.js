import IndoorController from "../../controllers/IndoorController";
import IndoorModel from "../../models/IndoorModel";

// Mock dependencies
jest.mock("../../models/IndoorModel", () => ({
  selectedIndoorBuilding: null,
  isExpanded: false,
  selectedFloor: 1,
  graph: { node1: { node2: 1 }, node3: { node4: 1 } },
  nodeCoordinates: {
    node1: { coordinates: [-73.5787, 45.4973], floor: 1 },
    node2: { coordinates: [-73.5788, 45.4974], floor: 1 }
  },
  indoorCoordinatesMap: {
    "H101": { latitude: 45.4973, longitude: -73.5787, floor: 1 },
    "H102": { latitude: 45.4974, longitude: -73.5788, floor: 1 }
  },
  getBuildingCenter: jest.fn(),
  hasIndoorMapping: jest.fn(),
  convertCoordinates: jest.fn(),
  calculateCentroid: jest.fn()
}));

describe("IndoorController Tests", () => {
  let mockMapRef;
  let mockUpdateSelectedIndoorBuilding;
  let mockUpdateIsExpanded;
  let mockUpdateSelectedFloor;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    IndoorModel.selectedIndoorBuilding = null;
    IndoorModel.isExpanded = false;
    IndoorModel.selectedFloor = 1;
    
    // Create mock refs and functions
    mockMapRef = {
      current: {
        setCamera: jest.fn()
      }
    };
    
    mockUpdateSelectedIndoorBuilding = jest.fn();
    mockUpdateIsExpanded = jest.fn();
    mockUpdateSelectedFloor = jest.fn();
  });

  describe("handleIndoorBuildingSelect", () => {
    test("should recenter camera if the same building is reselected", () => {
      const building = { id: "hall", name: "Hall Building" };
      const buildingCenter = [-73.5787, 45.4973];
      
      IndoorModel.selectedIndoorBuilding = { id: "hall", name: "Hall Building" };
      IndoorModel.getBuildingCenter.mockReturnValueOnce(buildingCenter);
      
      IndoorController.handleIndoorBuildingSelect(
        building,
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        mockUpdateSelectedFloor,
        mockMapRef
      );
      
      expect(IndoorModel.getBuildingCenter).toHaveBeenCalledWith(building);
      expect(mockUpdateSelectedIndoorBuilding).not.toHaveBeenCalled();
      expect(mockUpdateIsExpanded).not.toHaveBeenCalled();
      expect(mockUpdateSelectedFloor).not.toHaveBeenCalled();
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should select new building and update state", () => {
      const building = { id: "hall", name: "Hall Building" };
      const buildingCenter = [-73.5787, 45.4973];
      
      IndoorModel.selectedIndoorBuilding = { id: "library", name: "Library Building" };
      IndoorModel.getBuildingCenter.mockReturnValueOnce(buildingCenter);
      
      IndoorController.handleIndoorBuildingSelect(
        building,
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        mockUpdateSelectedFloor,
        mockMapRef
      );
      
      expect(IndoorModel.getBuildingCenter).toHaveBeenCalledWith(building);
      expect(mockUpdateSelectedIndoorBuilding).toHaveBeenCalledWith(building);
      expect(mockUpdateIsExpanded).toHaveBeenCalledWith(false);
      expect(mockUpdateSelectedFloor).toHaveBeenCalledWith(1);
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: buildingCenter,
        zoomLevel: 18,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should handle null mapRef gracefully", () => {
      const building = { id: "hall", name: "Hall Building" };
      const buildingCenter = [-73.5787, 45.4973];
      
      IndoorModel.selectedIndoorBuilding = { id: "library", name: "Library Building" };
      IndoorModel.getBuildingCenter.mockReturnValueOnce(buildingCenter);
      
      IndoorController.handleIndoorBuildingSelect(
        building,
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        mockUpdateSelectedFloor,
        { current: null }
      );
      
      expect(IndoorModel.getBuildingCenter).toHaveBeenCalledWith(building);
      expect(mockUpdateSelectedIndoorBuilding).toHaveBeenCalledWith(building);
      expect(mockUpdateIsExpanded).toHaveBeenCalledWith(false);
      expect(mockUpdateSelectedFloor).toHaveBeenCalledWith(1);
      expect(mockMapRef.current?.setCamera).not.toHaveBeenCalled();
    });
  });

  describe("handleClearIndoorMap", () => {
    test("should clear indoor map state and reset camera", () => {
      const activeCampus = "sgw";
      
      IndoorController.handleClearIndoorMap(
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        mockMapRef,
        activeCampus,
        mockUpdateSelectedFloor
      );
      
      expect(mockUpdateSelectedIndoorBuilding).toHaveBeenCalledWith(null);
      expect(mockUpdateIsExpanded).toHaveBeenCalledWith(false);
      expect(mockUpdateSelectedFloor).toHaveBeenCalledWith(1);
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [-73.5792229, 45.4951962],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should use loyola coordinates when campus is loyola", () => {
      const activeCampus = "loyola";
      
      IndoorController.handleClearIndoorMap(
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        mockMapRef,
        activeCampus,
        mockUpdateSelectedFloor
      );
      
      expect(mockMapRef.current.setCamera).toHaveBeenCalledWith({
        centerCoordinate: [-73.6417009, 45.4581281],
        zoomLevel: 15,
        animationMode: "flyTo",
        animationDuration: 1000,
      });
    });
    
    test("should handle null mapRef gracefully", () => {
      const activeCampus = "sgw";
      
      IndoorController.handleClearIndoorMap(
        mockUpdateSelectedIndoorBuilding,
        mockUpdateIsExpanded,
        { current: null },
        activeCampus,
        mockUpdateSelectedFloor
      );
      
      expect(mockUpdateSelectedIndoorBuilding).toHaveBeenCalledWith(null);
      expect(mockUpdateIsExpanded).toHaveBeenCalledWith(false);
      expect(mockUpdateSelectedFloor).toHaveBeenCalledWith(1);
      expect(mockMapRef.current?.setCamera).not.toHaveBeenCalled();
    });
  });

  describe("getGraph", () => {
    test("should return graph from model", () => {
      const result = IndoorController.getGraph();
      
      expect(result).toEqual(IndoorModel.graph);
    });
  });

  describe("getNodeCoordinates", () => {
    test("should return nodeCoordinates from model", () => {
      const result = IndoorController.getNodeCoordinates();
      
      expect(result).toEqual(IndoorModel.nodeCoordinates);
    });
  });

  describe("getIndoorCoordinatesMap", () => {
    test("should return indoorCoordinatesMap from model", () => {
      const result = IndoorController.getIndoorCoordinatesMap();
      
      expect(result).toEqual(IndoorModel.indoorCoordinatesMap);
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
      
      IndoorModel.convertCoordinates.mockReturnValueOnce(mockConvertedCoords);
      
      const result = IndoorController.convertCoordinates(coords);
      
      expect(IndoorModel.convertCoordinates).toHaveBeenCalledWith(coords);
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
      
      IndoorModel.calculateCentroid.mockReturnValueOnce(mockCentroid);
      
      const result = IndoorController.calculateCentroid(coordinates);
      
      expect(IndoorModel.calculateCentroid).toHaveBeenCalledWith(coordinates);
      expect(result).toBe(mockCentroid);
    });
  });

  describe("getIndoorBuildingsForCampus", () => {
    test("should filter buildings by campus and hasIndoor property", () => {
      const buildings = [
        { id: "h", name: "Hall Building", campus: "SGW", hasIndoor: true },
        { id: "ev", name: "EV Building", campus: "SGW", hasIndoor: true },
        { id: "vl", name: "VL Building", campus: "LOY", hasIndoor: true },
        { id: "ve", name: "VE", campus: "LOY", hasIndoor: true },
        { id: "mb", name: "MB Building", campus: "SGW", hasIndoor: false }
      ];
      const activeCampus = "sgw";
      
      const result = IndoorController.getIndoorBuildingsForCampus(buildings, activeCampus);
      
      expect(result).toEqual([
        { id: "h", name: "Hall Building", campus: "SGW", hasIndoor: true },
        { id: "ev", name: "EV Building", campus: "SGW", hasIndoor: true }
      ]);
    });
    
    test("should filter buildings for loyola campus excluding VE", () => {
      const buildings = [
        { id: "h", name: "Hall Building", campus: "SGW", hasIndoor: true },
        { id: "ev", name: "EV Building", campus: "SGW", hasIndoor: true },
        { id: "vl", name: "VL Building", campus: "LOY", hasIndoor: true },
        { id: "ve", name: "VE", campus: "LOY", hasIndoor: true },
        { id: "mb", name: "MB Building", campus: "SGW", hasIndoor: false }
      ];
      const activeCampus = "loy"; // Changed from "loyola" to "loy" to match the controller code
      
      const result = IndoorController.getIndoorBuildingsForCampus(buildings, activeCampus);
      
      expect(result).toEqual([
        { id: "vl", name: "VL Building", campus: "LOY", hasIndoor: true }
      ]);
    });
    
    test("should return empty array if no buildings match criteria", () => {
      const buildings = [
        { id: "mb", name: "MB Building", campus: "SGW", hasIndoor: false }
      ];
      const activeCampus = "sgw";
      
      const result = IndoorController.getIndoorBuildingsForCampus(buildings, activeCampus);
      
      expect(result).toEqual([]);
    });
    
    test("should handle case-insensitive campus comparison", () => {
      const buildings = [
        { id: "h", name: "Hall Building", campus: "SGW", hasIndoor: true },
        { id: "vl", name: "VL Building", campus: "LOY", hasIndoor: true }
      ];
      const activeCampus = "SGW";
      
      const result = IndoorController.getIndoorBuildingsForCampus(buildings, activeCampus);
      
      expect(result).toEqual([
        { id: "h", name: "Hall Building", campus: "SGW", hasIndoor: true }
      ]);
    });
  });
});