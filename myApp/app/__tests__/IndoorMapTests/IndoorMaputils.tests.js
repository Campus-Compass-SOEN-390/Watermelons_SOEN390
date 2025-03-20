import { 
    handleIndoorBuildingSelect, 
    handleClearIndoorMap, 
    convertCoordinates, 
    calculateCentroid 
  } from "../../utils/IndoorMapUtils"; 
  
  describe("Indoor Map Utility Functions", () => {
    
    describe("convertCoordinates", () => {
      it("converts latitude/longitude objects to [lng, lat] format", () => {
        const coords = [
          { latitude: 45.5, longitude: -73.6 },
          { latitude: 45.6, longitude: -73.7 }
        ];
        expect(convertCoordinates(coords)).toEqual([
          [-73.6, 45.5],
          [-73.7, 45.6]
        ]);
      });
    });
  
    describe("calculateCentroid", () => {
      it("calculates the centroid of a set of coordinates", () => {
        const coords = [
          [-73.6, 45.5],
          [-73.7, 45.6],
          [-73.8, 45.7]
        ];
        expect(calculateCentroid(coords)).toEqual([
          (-73.6 - 73.7 - 73.8) / 3, 
          (45.5 + 45.6 + 45.7) / 3
        ]);
      });
    });
  
    describe("handleIndoorBuildingSelect", () => {
      let updateIsExpanded, updateSelectedIndoorBuilding, setSelectedFloor, mapRef;
  
      beforeEach(() => {
        updateIsExpanded = jest.fn();
        updateSelectedIndoorBuilding = jest.fn();
        setSelectedFloor = jest.fn();
        mapRef = { current: { setCamera: jest.fn() } };
      });
  
      it("selects a new building and moves the map", () => {
        const building = { id: "B1", coordinates: [{ latitude: 45.5, longitude: -73.6 }], floors: ["1", "2"] };
        
        handleIndoorBuildingSelect(building, null, updateIsExpanded, updateSelectedIndoorBuilding, setSelectedFloor, mapRef);
        
        expect(updateSelectedIndoorBuilding).toHaveBeenCalledWith(building);
        expect(updateIsExpanded).toHaveBeenCalledWith(false);
        expect(setSelectedFloor).toHaveBeenCalledWith("1");
        expect(mapRef.current.setCamera).toHaveBeenCalledWith({
          centerCoordinate: [-73.6, 45.5],
          zoomLevel: 18,
          animationMode: "flyTo",
          animationDuration: 1000
        });
      });
  
      it("reselects the same building and recenters without resetting floor", () => {
        const building = { id: "B1", coordinates: [{ latitude: 45.5, longitude: -73.6 }], floors: ["1", "2"] };
        
        handleIndoorBuildingSelect(building, building, updateIsExpanded, updateSelectedIndoorBuilding, setSelectedFloor, mapRef);
        
        expect(updateSelectedIndoorBuilding).not.toHaveBeenCalled();
        expect(updateIsExpanded).toHaveBeenCalledWith(false);
        expect(setSelectedFloor).toHaveBeenCalled();
        expect(mapRef.current.setCamera).toHaveBeenCalledWith({
          centerCoordinate: [-73.6, 45.5],
          zoomLevel: 18,
          animationMode: "flyTo",
          animationDuration: 1000
        });
      });
    });
  
    describe("handleClearIndoorMap", () => {
      let updateSelectedIndoorBuilding, updateIsExpanded, setSelectedFloor, mapRef;
  
      beforeEach(() => {
        updateSelectedIndoorBuilding = jest.fn();
        updateIsExpanded = jest.fn();
        setSelectedFloor = jest.fn();
        mapRef = { current: { setCamera: jest.fn() } };
      });
  
      it("clears the indoor map and resets to campus view", () => {
        handleClearIndoorMap(updateSelectedIndoorBuilding, updateIsExpanded, mapRef, "sgw", setSelectedFloor);
  
        expect(updateSelectedIndoorBuilding).toHaveBeenCalledWith(null);
        expect(updateIsExpanded).toHaveBeenCalledWith(false);
        expect(setSelectedFloor).toHaveBeenCalledWith(null);
        expect(mapRef.current.setCamera).toHaveBeenCalledWith({
          centerCoordinate: [-73.5792229, 45.4951962],
          zoomLevel: 15,
          animationMode: "flyTo",
          animationDuration: 1000
        });
      });
  
      it("clears the indoor map and resets to Loyola campus view", () => {
        handleClearIndoorMap(updateSelectedIndoorBuilding, updateIsExpanded, mapRef, "loy", setSelectedFloor);
  
        expect(updateSelectedIndoorBuilding).toHaveBeenCalledWith(null);
        expect(updateIsExpanded).toHaveBeenCalledWith(false);
        expect(setSelectedFloor).toHaveBeenCalledWith(null);
        expect(mapRef.current.setCamera).toHaveBeenCalledWith({
          centerCoordinate: [-73.6417009, 45.4581281],
          zoomLevel: 15,
          animationMode: "flyTo",
          animationDuration: 1000
        });
      });
    });
  
  });
  