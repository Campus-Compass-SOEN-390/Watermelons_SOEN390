import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BuildingPopup, { BuildingPopupProps } from "../components/BuildingPopUp";
import { ThemeContext } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../constants/themes";

// Helper function to render with ThemeContext
const renderWithTheme = (
  ui: React.ReactElement,
  { isDarkMode = false } = {}
) => {
  const mockToggleTheme = jest.fn();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return render(
    <ThemeContext.Provider
      value={{ theme, isDarkMode, toggleTheme: mockToggleTheme }}
    >
      {ui}
    </ThemeContext.Provider>
  );
};

describe("BuildingPopup Component", () => {
  const mockOnClose = jest.fn();
  const mockOnGetDirections = jest.fn();
  const mockSetAsStartingPoint = jest.fn();

  const mockBuilding = {
    name: "Mock Building",
    longName: "Mock Building Long Name",
    openHours: "9 AM - 5 PM",
    wheelchairAccessible: true,
    departments: ["Engineering", "Math"],
  };

  const defaultProps: BuildingPopupProps = {
    visible: true,
    onClose: mockOnClose,
    building: mockBuilding,
    onGetDirections: mockOnGetDirections,
    setAsStartingPoint: mockSetAsStartingPoint,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders building information correctly", () => {
    const { getByText } = renderWithTheme(<BuildingPopup {...defaultProps} />);

    expect(getByText("Building Information")).toBeTruthy();
    expect(getByText("Mock Building")).toBeTruthy();
    expect(getByText("Mock Building Long Name")).toBeTruthy();
    expect(getByText("9 AM - 5 PM")).toBeTruthy();
    expect(getByText("Accessibility: Yes")).toBeTruthy();
    expect(getByText("Departments: Engineering, Math")).toBeTruthy();
  });

  it("calls onGetDirections when 'Get Directions' button is pressed", () => {
    const { getByText } = renderWithTheme(<BuildingPopup {...defaultProps} />);
    fireEvent.press(getByText("Get Directions"));

    expect(mockOnGetDirections).toHaveBeenCalledWith(mockBuilding);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls setAsStartingPoint when 'Use as Starting Point' button is pressed", () => {
    const { getByText } = renderWithTheme(<BuildingPopup {...defaultProps} />);
    fireEvent.press(getByText("Use as Starting Point"));

    expect(mockSetAsStartingPoint).toHaveBeenCalledWith(mockBuilding);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when close icon is pressed", () => {
    const { getByTestId } = renderWithTheme(
      <BuildingPopup {...defaultProps} />
    );
    fireEvent.press(getByTestId("close-button"));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("displays 'No department info' when departments array is empty", () => {
    const noDeptProps: BuildingPopupProps = {
      ...defaultProps,
      building: {
        ...mockBuilding,
        departments: [],
      },
    };

    const { getByTestId } = renderWithTheme(<BuildingPopup {...noDeptProps} />);
    const deptText = getByTestId("departments-text");

    expect(deptText.children.join("")).toContain("No department info");
  });

  it("renders correctly in dark mode", () => {
    const { getByText } = renderWithTheme(<BuildingPopup {...defaultProps} />, {
      isDarkMode: true,
    });

    expect(getByText("Building Information")).toBeTruthy();
    // The component should render with dark theme styles when isDarkMode is true
  });
});
