import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import IndoorMap from "../../components/IndoorMap/IndoorMap";
import Mapbox from "@rnmapbox/maps";
import finalMapData from "../../../assets/floorplans/finalMap.json";

jest.mock("@rnmapbox/maps", () => ({
  setAccessToken: jest.fn(),
  ShapeSource: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  FillLayer: jest.fn(() => <div testID="room-fill-layer" />),
  LineLayer: jest.fn(({ id }) => <div testID={id} />),
  SymbolLayer: jest.fn(({ id }) => <div testID={id} />),
}));

jest.mock("expo-constants", () => ({
  expoConfig: { extra: { mapbox: "test-access-token" } },
}));

describe("IndoorMap Component", () => {
  test("renders without crashing", async () => {
    const { getByTestId } = render(<IndoorMap selectedBuilding={null} selectedFloor={"1"} />);
    
    await waitFor(() => {
      expect(getByTestId("indoor-map")).toBeTruthy();
    });
  });

  test("sets Mapbox access token on mount", () => {
    render(<IndoorMap selectedBuilding={null} selectedFloor={"1"} />);
    expect(Mapbox.setAccessToken).toHaveBeenCalledWith("test-access-token");
  });

  test("renders the correct layers", async () => {
    const { getByTestId } = render(<IndoorMap selectedBuilding={null} selectedFloor={"1"} />);

    await waitFor(() => {
      expect(getByTestId("room-fill-layer")).toBeTruthy();
      expect(getByTestId("room-line-layer")).toBeTruthy();
      expect(getByTestId("path-line-layer")).toBeTruthy();
      expect(getByTestId("wall-line-layer")).toBeTruthy();
      expect(getByTestId("door-text-layer")).toBeTruthy();
      expect(getByTestId("poi-stairs-layer")).toBeTruthy();
      expect(getByTestId("poi-elevator-layer")).toBeTruthy();
      expect(getByTestId("poi-escalator-layer")).toBeTruthy();
      expect(getByTestId("poi-bathroom-layer")).toBeTruthy();
    });
  });

  test("filters GeoJSON data correctly when selectedBuilding is provided", async () => {
    const selectedBuilding = { name: "Building A" };
    const selectedFloor = "2";

    const { getByTestId } = render(<IndoorMap selectedBuilding={selectedBuilding} selectedFloor={selectedFloor} />);

    await waitFor(() => {
      const shapeSource = getByTestId("indoor-map");

      const filteredFeatures = finalMapData.features.filter((feature) => {
        const featureBuilding = feature.properties.building;
        const featureFloor = feature.properties.floor;
        return (
          (featureBuilding === selectedBuilding.name && featureFloor === Number(selectedFloor)) ||
          (featureBuilding !== selectedBuilding.name && featureFloor === 1)
        );
      });

      expect(shapeSource.props.shape.features).toEqual(filteredFeatures);
    });
  });
});
