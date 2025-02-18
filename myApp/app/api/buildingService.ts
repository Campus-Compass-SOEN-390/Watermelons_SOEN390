import { getAllBuildings, getBuildingById } from "./buildingData";
import { Building } from "./buildingData";

// Get all building information
export const fetchAllBuildings = async (): Promise<Building[]> => {
  return getAllBuildings();
};

// Get details of a specific building by ID
export const fetchBuildingById = async (id: string): Promise<Building> => {
  // Validate the building ID
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("❌ Invalid building ID. Please provide a valid ID.");
  }

  const building = getBuildingById(id);
  if (!building) {
    throw new Error(`❌ Building with ID "${id}" not found.`);
  }

  return building;
};

//Fix Import Issue: Add Default Export
export default {
  fetchAllBuildings,
  fetchBuildingById,
};
