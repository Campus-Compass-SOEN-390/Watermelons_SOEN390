import React from "react";
import { render } from "@testing-library/react-native";
import IndoorMap from "../../components/IndoorMap/IndoorMap";

jest.mock("@rnmapbox/maps", () => ({
  setAccessToken: jest.fn(),
  ShapeSource: jest.fn(({ children }) => children),
  FillLayer: jest.fn(() => "FillLayer"),
  LineLayer: jest.fn(() => "LineLayer"),
  SymbolLayer: jest.fn(() => "SymbolLayer"),
}));

describe("IndoorMap Component", () => {
  it("renders correctly with no selected building (default first floors)", () => {
    const { queryByText, queryByTestId } = render(
      <IndoorMap selectedBuilding={null} selectedFloor={null} />
    );

    // Ensure Mapbox ShapeSource is present
    expect(queryByTestId("indoor-map")).toBeTruthy();

    // Ensure Map layers are rendered
    expect(queryByText("FillLayer")).toBeTruthy();
    expect(queryByText("LineLayer")).toBeTruthy();
    expect(queryByText("SymbolLayer")).toBeTruthy();
  });

  it("renders correctly when a building and floor are selected", () => {
    const selectedBuilding = { name: "MB" };
    const selectedFloor = "2";

    const { queryByTestId } = render(
      <IndoorMap selectedBuilding={selectedBuilding} selectedFloor={selectedFloor} />
    );

    expect(queryByTestId("indoor-map")).toBeTruthy();
  });

  it("filters geoJSON correctly based on selected building and floor", () => {
    const selectedBuilding = { name: "H" };
    const selectedFloor = "8";

    const { rerender } = render(
      <IndoorMap selectedBuilding={selectedBuilding} selectedFloor={selectedFloor} />
    );

    // Simulate an update to another building
    rerender(
      <IndoorMap selectedBuilding={{ name: "MB" }} selectedFloor="1" />
    );
  });

  it("does not render if GeoJSON data is not loaded", () => {
    jest.spyOn(React, "useEffect").mockImplementation(() => {}); // Mock useEffect to prevent loading GeoJSON
    const { queryByTestId } = render(<IndoorMap selectedBuilding={null} selectedFloor={null} />);

    expect(queryByTestId("indoor-map")).toBeFalsy();
  });
});
