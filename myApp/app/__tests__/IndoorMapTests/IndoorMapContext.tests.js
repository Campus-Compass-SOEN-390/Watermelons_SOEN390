import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { IndoorMapProvider, useIndoorMapContext } from "../../context/IndoorMapContext"; // Adjust path if needed
import { Text, View, Button } from "react-native";

// Test component to consume the context
const TestComponent = () => {
  const {
    isExpanded,
    selectedIndoorBuilding,
    updateIsExpanded,
    updateSelectedIndoorBuilding,
  } = useIndoorMapContext();

  return (
    <View>
      <Text testID="isExpanded">{isExpanded ? "true" : "false"}</Text>
      <Text testID="selectedBuilding">
        {selectedIndoorBuilding ? selectedIndoorBuilding.name : "null"}
      </Text>
      <Button title="Expand" onPress={() => updateIsExpanded(true)} />
      <Button
        title="Select Building"
        onPress={() =>
          updateSelectedIndoorBuilding({
            id: "1",
            name: "Library",
            coordinates: [{ latitude: 45.5, longitude: -73.5 }],
            campus: "Main",
            hasIndoor: true,
          })
        }
      />
    </View>
  );
};

describe("IndoorMapContext (React Native)", () => {
  it("provides default values", () => {
    const { getByTestId } = render(
      <IndoorMapProvider>
        <TestComponent />
      </IndoorMapProvider>
    );

    expect(getByTestId("isExpanded").props.children).toBe("false");
    expect(getByTestId("selectedBuilding").props.children).toBe("null");
  });

  it("updates isExpanded state", () => {
    const { getByTestId, getByText } = render(
      <IndoorMapProvider>
        <TestComponent />
      </IndoorMapProvider>
    );

    fireEvent.press(getByText("Expand"));

    expect(getByTestId("isExpanded").props.children).toBe("true");
  });

  it("updates selectedIndoorBuilding state", () => {
    const { getByTestId, getByText } = render(
      <IndoorMapProvider>
        <TestComponent />
      </IndoorMapProvider>
    );

    fireEvent.press(getByText("Select Building"));

    expect(getByTestId("selectedBuilding").props.children).toBe("Library");
  });

  it("throws an error when used outside of provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useIndoorMapContext must be used within an IndoorMapProvider"
    );
  });
});
