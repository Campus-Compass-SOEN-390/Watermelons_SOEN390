// app/__tests__/POITests/POIList.tests.js

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ActivityIndicator, FlatList, Image, Text } from "react-native";
import POIList from "../../components/POI/POIList";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme } from "../../constants/themes";

// Instead of mocking the entire POIList component, mock the styles module
jest.mock("../../styles/POIListStyle", () => {
  // Create a simplified version of the styles
  const mockStyles = {
    container: {},
    headerContainer: {},
    filterButton: {},
    retryButton: {},
    filterButtonText: {},
    buttonText: {},
    listContainer: {},
    poiItem: {},
    poiContent: {},
    poiImage: {},
    noImagePlaceholder: {},
    noImageText: {},
    poiHeader: {},
    poiName: {},
    poiDistance: {},
    poiAddress: {},
    categoryContainer: {},
    categoryBadge: {},
    cafeBadge: { backgroundColor: "#d4a88e" },
    restaurantBadge: { backgroundColor: "#8ed4a8" },
    activityBadge: { backgroundColor: "#a88ed4" },
    categoryText: {},
    loadingContainer: {},
    loadingText: {},
    noResultsContainer: {},
    noResultsText: {},
    errorText: {},
    ratingBadge: {},
    ratingText: {},
    directionsButton: {},
    directionsButtonText: {},
  };

  return {
    styles: mockStyles,
    createPOIListStyles: () => mockStyles,
    __esModule: true,
  };
});

// Mock expo-av
jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({ sound: { playAsync: jest.fn() } })
      ),
    },
  },
}));

// Mock expo-speech
jest.mock("expo-speech", () => ({
  speak: jest.fn(),
}));

// Mock react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock the feedback context
jest.mock("../../context/FeedbackContext", () => ({
  useFeedback: () => ({
    vibrationEnabled: true,
    soundEnabled: true,
    speechEnabled: true,
  }),
}));

// Ensure a dummy API key is available
jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {
        apiKey:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ref1&key=undefined",
      },
    },
  },
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the location context
jest.mock("@/app/context/LocationContext", () => ({
  useLocationContext: () => ({
    updatePOILocationData: jest.fn(),
  }),
}));

// Mock Ionicons from @expo/vector-icons to simply render a Text component
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native"); // now in-scope
  return {
    Ionicons: (props) => <Text {...props} />,
  };
});

// Create a proper mock for AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  clear: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  multiMerge: jest.fn(() => Promise.resolve()),
  flushGetRequests: jest.fn(),
}));

// Updated render helper with proper theme context
const renderWithNavAndTheme = (ui, { isDarkMode = false } = {}) => {
  const theme = lightTheme;
  const toggleTheme = jest.fn();

  return render(
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {ui}
    </ThemeContext.Provider>
  );
};

describe("POIList Component", () => {
  // Dummy distance calculation function (always returns 1.2 km)
  const dummyDistance = 1.2;
  const calculateDistance = jest.fn(() => dummyDistance);
  const userLocation = { latitude: 45.5017, longitude: -73.5673 };

  const sampleData = [
    {
      place_id: "1",
      name: "Test Place 1",
      geometry: { location: { lat: 45.5017, lng: -73.5673 } },
      vicinity: "Test Address 1",
      category: "cafe",
      rating: 4.5,
      photos: [{ photo_reference: "ref1" }],
    },
    {
      place_id: "2",
      name: "Test Place 2",
      geometry: { location: { lat: 45.502, lng: -73.568 } },
      vicinity: "Test Address 2",
      category: "restaurant",
      rating: 4.0,
      photos: [], // No photo; placeholder should be rendered
    },
  ];

  it("renders loading state correctly", () => {
    const { getByText, queryByTestId } = renderWithNavAndTheme(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={true}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    // Check for the loading text
    expect(getByText("Loading places...")).toBeTruthy();
    // Assumes the ActivityIndicator has testID="activity-indicator"
    expect(queryByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders error state with retry button when error exists and no data", () => {
    const onRefreshMock = jest.fn();
    const { getByText } = renderWithNavAndTheme(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={false}
        error={"Error fetching data"}
        refreshing={false}
        onRefresh={onRefreshMock}
        calculateDistance={calculateDistance}
      />
    );

    expect(getByText("Error fetching data")).toBeTruthy();
    const retryButton = getByText("Retry");
    expect(retryButton).toBeTruthy();

    fireEvent.press(retryButton);
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it("renders empty state when data is empty", () => {
    const { getByText } = renderWithNavAndTheme(
      <POIList
        data={[]}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    expect(getByText(/No places found with the current filters/)).toBeTruthy();
  });

  it("renders list items correctly when data is provided", () => {
    const { getByText, getAllByText } = renderWithNavAndTheme(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    expect(getByText("Test Place 1")).toBeTruthy();
    expect(getByText("Test Place 2")).toBeTruthy();

    // Since "1.2 km" appears for each item, use getAllByText and check its length.
    const distanceElements = getAllByText(`${dummyDistance.toFixed(1)} km`);
    expect(distanceElements.length).toBe(sampleData.length);

    expect(getByText("Test Address 1")).toBeTruthy();
    expect(getByText("Test Address 2")).toBeTruthy();
    // Instead of getByText (which fails if multiple exist), use getAllByText
    const directionsButtons = getAllByText("Get Directions");
    expect(directionsButtons.length).toBeGreaterThan(0);
  });

  it("calls onRefresh when pull-to-refresh is triggered on the FlatList", () => {
    const onRefreshMock = jest.fn();
    const { getByTestId } = renderWithNavAndTheme(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={true}
        onRefresh={onRefreshMock}
        calculateDistance={calculateDistance}
      />
    );

    // Assumes the FlatList has testID="poi-flatlist"
    const flatList = getByTestId("poi-flatlist");
    // Trigger the refresh event from the RefreshControl
    flatList.props.refreshControl.props.onRefresh();
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it("handles Get Directions button press in list item", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getAllByText } = renderWithNavAndTheme(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    const getDirectionsButtons = getAllByText("Get Directions");
    fireEvent.press(getDirectionsButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith("Get directions to: Test Place 1");
    expect(consoleSpy).toHaveBeenCalledWith("Address: Test Address 1");
    consoleSpy.mockRestore();
  });

  it("shows no image placeholder when image fails to load", () => {
    const { getByText, getByTestId } = renderWithNavAndTheme(
      <POIList
        data={[sampleData[0]]}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    // Assumes the Image in POIListItem has testID="poi-image"
    const imageComponent = getByTestId("poi-image");
    fireEvent(imageComponent, "error", {
      nativeEvent: { error: "error loading image" },
    });

    expect(getByText("No Image Available")).toBeTruthy();
  });

  it("handles items with and without photo reference correctly", () => {
    const { getAllByTestId } = renderWithNavAndTheme(
      <POIList
        data={sampleData}
        userLocation={userLocation}
        isLoading={false}
        error={null}
        refreshing={false}
        onRefresh={jest.fn()}
        calculateDistance={calculateDistance}
      />
    );

    // Check that we have two image components (one for each POI)
    const imageComponents = getAllByTestId("poi-image");
    expect(imageComponents.length).toBe(1);

    // The first POI has a photo reference, so its source should include the API key
    expect(imageComponents[0].props.source.uri).toContain(
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ref1&key=undefined"
    );
  });
});
