import { isPointInPolygon } from "geolib"; 
import { buildings, Campus } from "../utils/mapUtils";

describe("Building Data Tests", () => {
  test("All SGW buildings should have 'SGW' as their campus", () => {
    const sgwBuildings = buildings.filter(b => b.campus === Campus.SGW);
    expect(sgwBuildings.length).toBeGreaterThan(0);
    sgwBuildings.forEach(building => {
      expect(building.campus).toBe(Campus.SGW);
    });
  });

  test("All LOY buildings should have 'LOY' as their campus", () => {
    const loyBuildings = buildings.filter(b => b.campus === Campus.LOY);
    expect(loyBuildings.length).toBeGreaterThan(0);
    loyBuildings.forEach(building => {
      expect(building.campus).toBe(Campus.LOY);
    });
  });

  test("User inside Hall Building should return true", () => {
    const userLocation = { latitude: 45.4973, longitude: -73.5789 };
    const hallBuilding = buildings.find(b => b.name === "Hall Building");

    expect(hallBuilding).toBeDefined();
    if (hallBuilding) {
      const isInside = isPointInPolygon(userLocation, hallBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  test("User outside Hall Building should return false", () => {
    const userLocation = { latitude: 45.4985, longitude: -73.5805 };
    const hallBuilding = buildings.find(b => b.name === "Hall Building");

    expect(hallBuilding).toBeDefined();
    if (hallBuilding) {
      const isInside = isPointInPolygon(userLocation, hallBuilding.coordinates);
      expect(isInside).toBe(false);
    }
  });

  test("User inside John Molson School of Business should return true", () => {
    const userLocation = { latitude: 45.4953, longitude: -73.5788 };
    const jmsbBuilding = buildings.find(b => b.name === "John Molson School of Business");

    expect(jmsbBuilding).toBeDefined();
    if (jmsbBuilding) {
      const isInside = isPointInPolygon(userLocation, jmsbBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  test("User inside L Building should return true", () => {
    const userLocation = { latitude: 45.4967, longitude: -73.5795 };
    const lBuilding = buildings.find(b => b.name === "L Building");

    expect(lBuilding).toBeDefined();
    if (lBuilding) {
      const isInside = isPointInPolygon(userLocation, lBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  test("User inside Learning Square should return true", () => {
    const userLocation = { latitude: 45.4964, longitude: -73.5796 };
    const learningSquare = buildings.find(b => b.name === "Learning Square Building");

    expect(learningSquare).toBeDefined();
    if (learningSquare) {
      const isInside = isPointInPolygon(userLocation, learningSquare.coordinates);
      expect(isInside).toBe(true);
    }
  });

  test("User outside any building should return false", () => {
    const userLocation = { latitude: 45.4990, longitude: -73.5810 };
    const insideAnyBuilding = buildings.some(building => 
      isPointInPolygon(userLocation, building.coordinates)
    );

    expect(insideAnyBuilding).toBe(false);
  });
});
