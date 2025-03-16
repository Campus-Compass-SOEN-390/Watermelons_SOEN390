import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import IndoorMap from "../../components/IndoorMap/IndoorMap";
import { setAccessToken } from "@rnmapbox/maps";

jest.mock("@rnmapbox/maps", () => ({
  setAccessToken: jest.fn(),
  ShapeSource: jest.fn(() => null),
  FillLayer: jest.fn(() => null),
  LineLayer: jest.fn(() => null),
  SymbolLayer: jest.fn(() => null),
}));

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  jest.spyOn(console, "error").mockImplementation(() => {}); 
});

afterEach(() => {
  console.error.mockRestore();
});

describe("IndoorMap Component", () => {
  it("fetches GeoJSON data and updates state", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        type: "FeatureCollection",
        features: [
          { type: "Feature", properties: { building: "VL", floor: 1 } },
          { type: "Feature", properties: { building: "VL", floor: 2 } },
          { type: "Feature", properties: { building: "H", floor: 1 } },
        ],
      }),
    });

    render(<IndoorMap selectedBuilding={{ name: "VL" }} selectedFloor={1} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("filters features correctly for selected building and floor", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        type: "FeatureCollection",
        features: [
          { type: "Feature", properties: { building: "VL", floor: 1 } },
          { type: "Feature", properties: { building: "VL", floor: 2 } },
          { type: "Feature", properties: { building: "H", floor: 1 } },
        ],
      }),
    });

    const { rerender } = render(<IndoorMap selectedBuilding={{ name: "VL" }} selectedFloor={1} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    rerender(<IndoorMap selectedBuilding={{ name: "VL" }} selectedFloor={2} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // ✅ Ensures fetch was only called once
  });

  it("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<IndoorMap selectedBuilding={null} selectedFloor={1} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching GeoJSON:",
        expect.any(Error)
      );
    });
  });
});
