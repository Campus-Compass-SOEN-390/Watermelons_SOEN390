import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BuildingPopup, { BuildingPopupProps } from "../components/BuildingPopUp"; // Adjust the path as needed

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

  it("renders building information correctly", () => {
    const { getByText } = render(<BuildingPopup {...defaultProps} />);

    expect(getByText("Building Information")).toBeTruthy();
    expect(getByText("📍 Mock Building")).toBeTruthy();
    expect(getByText("🏛 Mock Building Long Name")).toBeTruthy();
    expect(getByText("🕒 9 AM - 5 PM")).toBeTruthy();
    expect(getByText("♿ Accessibility: ✅ Yes")).toBeTruthy();
    expect(getByText("🏢 Departments: Engineering, Math")).toBeTruthy();
  });

  it("calls onGetDirections when 'Get Directions' button is pressed", () => {
    const { getByText } = render(<BuildingPopup {...defaultProps} />);
    const getDirectionsButton = getByText("Get Directions");

    fireEvent.press(getDirectionsButton);

    expect(mockOnGetDirections).toHaveBeenCalledWith(mockBuilding);
    expect(mockOnClose).toHaveBeenCalled(); // Should close the modal
  });

  it("calls setAsStartingPoint when 'Set Starting Point' button is pressed", () => {
    const { getByText } = render(<BuildingPopup {...defaultProps} />);
    const setStartPointButton = getByText("Use As Starting Point");

    fireEvent.press(setStartPointButton);

    expect(mockSetAsStartingPoint).toHaveBeenCalledWith(mockBuilding);
    expect(mockOnClose).toHaveBeenCalled(); // Should close the modal
  });

  it("calls onClose when 'Close' button is pressed", () => {
    const { getByText } = render(<BuildingPopup {...defaultProps} />);
    const closeButton = getByText("Close");

    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
