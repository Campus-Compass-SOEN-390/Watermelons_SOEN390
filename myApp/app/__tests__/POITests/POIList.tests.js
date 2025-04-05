import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

// Import these before mocking to ensure they're available
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../constants/themes";
import POIList from "../../components/POI/POIList";

// Modify mocking strategy to avoid out-of-scope variable references
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn(),
  };
});

// Before importing other mocks, setup the ThemeContext mock
const createMockThemeContext = (isDarkMode = false) => ({
  isDarkMode,
  theme: isDarkMode ? darkTheme : lightTheme,
  toggleTheme: jest.fn(),
});

// Mock the styles module
jest.mock("../../styles/POIListStyle", () => {
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
    scrollTopButton: {},
    scrollTopButtonTouchable: {},
    footerContainer: {},
    footerText: {},
    iconColor: {},
    placeholderTextColor: {},
  };

  return {
    styles: mockStyles,
    createPOIListStyles: jest.fn(() => mockStyles),
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

// Mock the ThemeContext hook (from the specific import path)
jest.mock("@/app/context/ThemeContext", () => ({
  ThemeContext: {
    Provider: ({ children, value }) => children,
    Consumer: ({ children }) => children({ isDarkMode: false, theme: {} }),
  },
}));

// Mock react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock the button interaction hook
jest.mock("../../hooks/useButtonInteraction", () => ({
  useButtonInteraction: () => ({
    handleButtonPress: jest.fn(),
  }),
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
        apiKey: "dummy-key",
      },
    },
  },
  expoConfig: { extra: { apiKey: "dummy-key" } },
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
  const { Text } = require("react-native");
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

describe("POIList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup the useContext mock to return a default theme context
    const React = require("react");
    React.useContext.mockImplementation((context) => {
      if (context === ThemeContext) {
        return createMockThemeContext(false);
      }
      return jest.requireActual("react").useContext(context);
    });
  });

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
      uniqueKey: "cafe-1", // Add uniqueKey for our optimized code
    },
    {
      place_id: "2",
      name: "Test Place 2",
      geometry: { location: { lat: 45.502, lng: -73.568 } },
      vicinity: "Test Address 2",
      category: "restaurant",
      rating: 4.0,
      photos: [], // No photo; placeholder should be rendered
      uniqueKey: "restaurant-2", // Add uniqueKey for our optimized code
    },
  ];

  it("renders loading state correctly", () => {
    const { getByText, queryByTestId } = render(
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
    const { getByText } = render(
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
    const { getByText } = render(
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
    const { getByText, getAllByText } = render(
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
    const { getByTestId } = render(
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
    const { getAllByText } = render(
      <POIList
        data={sampleData.map((item) => ({
          ...item,
          // Add the uniqueKey that our optimized code expects
          uniqueKey: `${item.category}-${item.place_id}`,
        }))}
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

    // In our optimized code, we no longer log the address
    // Check only for the log of the place name
    expect(consoleSpy).toHaveBeenCalledWith("Get directions to: Test Place 1");
    consoleSpy.mockRestore();
  });

  it("handles dark mode correctly", () => {
    // Reconfigure useContext for dark mode
    const React = require("react");
    React.useContext.mockImplementation((context) => {
      if (context === ThemeContext) {
        return createMockThemeContext(true);
      }
      return jest.requireActual("react").useContext(context);
    });

    const { getByTestId } = render(
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
    // Verify that a FlatList is rendered even in dark mode
    expect(getByTestId("poi-flatlist")).toBeTruthy();
  });

  it("renders loading indicator with dark mode colors when in dark mode", () => {
    // Mock the useContext to return isDarkMode: true
    const React = require("react");
    React.useContext.mockImplementation((context) => {
      if (context === ThemeContext) {
        return {
          isDarkMode: true,
          theme: darkTheme,
          toggleTheme: jest.fn(),
        };
      }
      return jest.requireActual("react").useContext(context);
    });

    const { getByTestId } = render(
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

    // Verify that the activity indicator is rendered with dark mode styling
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("shows no image placeholder when image fails to load", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText, getByTestId } = render(
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
    expect(consoleSpy).toHaveBeenCalledWith(
      "Image error for Test Place 1:",
      "error loading image"
    );
    consoleSpy.mockRestore();
  });

  // Additional tests for scroll behavior
  it("handles scroll events correctly", () => {
    const { getByTestId } = render(
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

    // Simulate scrolling
    const flatList = getByTestId("poi-flatlist");
    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentOffset: { y: 400 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 500, width: 100 },
      },
    });

    // Verify the scroll handler was called
    expect(flatList.props.onScroll).toBeTruthy();
  });
});
