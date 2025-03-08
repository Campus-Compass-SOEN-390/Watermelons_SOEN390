import { isPointInPolygon } from "geolib";
import { buildings, Campus } from "../api/buildingData";

describe("Building Data Tests", () => {
  test("All SGW buildings should have 'SGW' as their campus", () => {
    const sgwBuildings = buildings.filter((b) => b.campus === Campus.SGW);
    expect(sgwBuildings.length).toBeGreaterThan(0);
    sgwBuildings.forEach((building) => {
      expect(building.campus).toBe(Campus.SGW);
    });
  });

  test("All LOY buildings should have 'LOY' as their campus", () => {
    const loyBuildings = buildings.filter((b) => b.campus === Campus.LOY);
    expect(loyBuildings.length).toBeGreaterThan(0);
    loyBuildings.forEach((building) => {
      expect(building.campus).toBe(Campus.LOY);
    });
  });

  // Test: User inside Pavillon EV Building should return true
  test("User inside Pavillon EV Building should return true", () => {
    // Using a point adjusted to be inside Pavillon EV Building (from merged data)
    const userLocation = { latitude: 45.495476, longitude: -73.578178 };
    const pavillonBuilding = buildings.find(
      (b) => b.longName === "Pavillon EV Building"
    );
    expect(pavillonBuilding).toBeDefined();
    if (pavillonBuilding && pavillonBuilding.coordinates) {
      const isInside = isPointInPolygon(userLocation, pavillonBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  // Test: User inside LB Building should return true
  test("User inside LB Building should return true", () => {
    const userLocation = { latitude: 45.4967, longitude: -73.5780 };
    const lbBuilding = buildings.find(
      (b) => b.longName === "LB Building"
    );
    expect(lbBuilding).toBeDefined();
    if (lbBuilding && lbBuilding.coordinates) {
      const isInside = isPointInPolygon(userLocation, lbBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  // Test: User inside Learning Square Building should return true
  test("User inside Learning Square Building should return true", () => {
    const userLocation = { latitude: 45.4964, longitude: -73.5796 };
    const learningSquare = buildings.find(
      (b) => b.longName === "Learning Square Building"
    );
    expect(learningSquare).toBeDefined();
    if (learningSquare && learningSquare.coordinates) {
      const isInside = isPointInPolygon(userLocation, learningSquare.coordinates);
      expect(isInside).toBe(true);
    }
  });

  // Test: User inside John Molson School of Business should return true
  test("User inside John Molson School of Business should return true", () => {
    const userLocation = { latitude: 45.4953, longitude: -73.5788 };
    const jmsbBuilding = buildings.find(
      (b) => b.longName === "John Molson School of Business"
    );
    expect(jmsbBuilding).toBeDefined();
    if (jmsbBuilding && jmsbBuilding.coordinates) {
      const isInside = isPointInPolygon(userLocation, jmsbBuilding.coordinates);
      expect(isInside).toBe(true);
    }
  });

  // Test: User outside any building should return false
  test("User outside any building should return false", () => {
    const userLocation = { latitude: 45.4990, longitude: -73.5810 };
    const insideAnyBuilding = buildings.some(
      (building) =>
        building.coordinates && isPointInPolygon(userLocation, building.coordinates)
    );
    expect(insideAnyBuilding).toBe(false);
  });
});
