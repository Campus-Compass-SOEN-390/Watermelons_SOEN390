import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FloorNavigation from "../../components/FloorNavigation"; 

describe("FloorNavigation Component", () => {
  const mockOnChangeFloor = jest.fn();
  const selectedBuilding = { floors: ["1", "2", "3"] };

  beforeEach(() => {
    mockOnChangeFloor.mockClear();
  });

  it("renders correctly with floors", () => {
    const { getByText } = render(
      <FloorNavigation selectedBuilding={selectedBuilding} selectedFloor="2" onChangeFloor={mockOnChangeFloor} />
    );

    expect(getByText("2")).toBeTruthy();
  });

  it("does not render if building has no floors", () => {
    const { queryByText } = render(
      <FloorNavigation selectedBuilding={{ floors: [] }} selectedFloor="1" onChangeFloor={mockOnChangeFloor} />
    );

    expect(queryByText("1")).toBeNull();
  });

  it("calls onChangeFloor when moving up a floor", () => {
    const { getByTestId } = render(
      <FloorNavigation selectedBuilding={selectedBuilding} selectedFloor="2" onChangeFloor={mockOnChangeFloor} />
    );

    fireEvent.press(getByTestId("floor-up"));

    expect(mockOnChangeFloor).toHaveBeenCalledWith("3");
  });

  it("calls onChangeFloor when moving down a floor", () => {
    const { getByTestId } = render(
      <FloorNavigation selectedBuilding={selectedBuilding} selectedFloor="2" onChangeFloor={mockOnChangeFloor} />
    );

    fireEvent.press(getByTestId("floor-down"));

    expect(mockOnChangeFloor).toHaveBeenCalledWith("1");
  });

  it("disables up button on top floor", () => {
    const { getByTestId } = render(
      <FloorNavigation selectedBuilding={selectedBuilding} selectedFloor="3" onChangeFloor={mockOnChangeFloor} />
    );

    expect(getByTestId("floor-up").props.accessibilityState.disabled).toBe(true);
  });

  it("disables down button on bottom floor", () => {
    const { getByTestId } = render(
      <FloorNavigation selectedBuilding={selectedBuilding} selectedFloor="1" onChangeFloor={mockOnChangeFloor} />
    );

    expect(getByTestId("floor-down").props.accessibilityState.disabled).toBe(true);
  });
});
