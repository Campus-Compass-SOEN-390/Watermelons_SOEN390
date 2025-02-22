// Import the functions we are testing
import { fetchAllBuildings, fetchBuildingById } from "../api/buildingService";

describe("Building Service API", () => {
  /**
   *   Test Case 1: Fetch all buildings (Loyola & SGW)
   */
  test("fetchAllBuildings should return all buildings", async () => {
    const buildings = await fetchAllBuildings(); 

    // Expect at least one building in the list
    expect(buildings.length).toBeGreaterThan(0);

    // Ensure that the list contains buildings from both campuses
    expect(buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "loy1", name: "AD" }),  // Loyola Campus
        expect.objectContaining({ id: "sgw1", name: "B" })  // SGW Campus
      ])
    );
  });

  /**
   *   Test Case 2: Fetch a specific Loyola building by ID
   */
  test("fetchBuildingById should return correct Loyola building", async () => {
    const building = await fetchBuildingById("loy1"); 

    expect(building).toBeDefined();
    expect(building.id).toBe("loy1");
    expect(building.name).toBe("AD");
  });

  /**
   *  Test Case 3: Fetch a specific SGW building by ID
   */
  test("fetchBuildingById should return correct SGW building", async () => {
    const building = await fetchBuildingById("sgw1"); 

    expect(building).toBeDefined();
    expect(building.id).toBe("sgw1");
    expect(building.name).toBe("B");
  });

  /**
   *  Test Case 4: Handle non-existent buildings (404 Not Found)
   */
  test("fetchBuildingById should return 404 Not Found for non-existent building", async () => {
    await expect(fetchBuildingById("sgw65")).rejects.toThrow(
      '❌ Building with ID "sgw65" not found.'
    );
  });

  /**
   *  Test Case 5: Handle invalid input values (400 Bad Request)
   */
  test("fetchBuildingById should return 400 Bad Request for invalid ID", async () => {
    await expect(fetchBuildingById("")).rejects.toThrow(
      "Invalid building ID. Please provide a valid ID."
    );
    await expect(fetchBuildingById(null as any)).rejects.toThrow(
      "Invalid building ID. Please provide a valid ID."
    );
    await expect(fetchBuildingById(undefined as any)).rejects.toThrow(
      "Invalid building ID. Please provide a valid ID."
    );
  });
});
