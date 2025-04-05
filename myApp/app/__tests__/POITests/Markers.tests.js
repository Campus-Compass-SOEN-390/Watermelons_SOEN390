import React from "react";
import { render } from "@testing-library/react-native";
import {
  CoffeeMarker,
  RestaurantMarker,
  ActivityMarker,
} from "../../components/POI/Markers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme } from "../../constants/themes";

// Mock the @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    MaterialCommunityIcons: jest.fn(({ name, size, color }) => (
      <View testID={`icon-${name}`} size={size} color={color} />
    )),
  };
});

// Helper function to render with ThemeContext
const renderWithTheme = (ui, { isDarkMode = false } = {}) => {
  const theme = lightTheme;
  const toggleTheme = jest.fn();

  return render(
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {ui}
    </ThemeContext.Provider>
  );
};

describe("Marker Components", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    MaterialCommunityIcons.mockClear();
  });

  describe("CoffeeMarker", () => {
    it("renders correctly", () => {
      const { getByTestId } = renderWithTheme(<CoffeeMarker />);
      expect(getByTestId("icon-coffee")).toBeTruthy();
    });

    it("uses the correct icon properties", () => {
      renderWithTheme(<CoffeeMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "coffee",
          size: 24,
          color: "black",
        }),
        expect.anything()
      );
    });
  });

  describe("RestaurantMarker", () => {
    it("renders correctly", () => {
      const { getByTestId } = renderWithTheme(<RestaurantMarker />);
      expect(getByTestId("icon-silverware-fork-knife")).toBeTruthy();
    });

    it("uses the correct icon properties", () => {
      renderWithTheme(<RestaurantMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "silverware-fork-knife",
          size: 24,
          color: "orange",
        }),
        expect.anything()
      );
    });
  });

  describe("ActivityMarker", () => {
    it("renders correctly", () => {
      const { getByTestId } = renderWithTheme(<ActivityMarker />);
      expect(getByTestId("icon-run")).toBeTruthy();
    });

    it("uses the correct icon properties", () => {
      renderWithTheme(<ActivityMarker />);
      expect(MaterialCommunityIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "run",
          size: 20,
          color: "green",
        }),
        expect.anything()
      );
    });
  });

  describe("Snapshots", () => {
    it("CoffeeMarker matches snapshot", () => {
      const tree = renderWithTheme(<CoffeeMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("RestaurantMarker matches snapshot", () => {
      const tree = renderWithTheme(<RestaurantMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("ActivityMarker matches snapshot", () => {
      const tree = renderWithTheme(<ActivityMarker />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
