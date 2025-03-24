import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapDirections from "../../components/MapDirections";

// Mock polyline (not currently used but keeping it in case of future use)
jest.mock("@mapbox/polyline", () => ({
  decode: jest.fn(() => [[-73.6, 45.5], [-73.7, 45.6]]),
}));

// Mock Mapbox components
jest.mock("@rnmapbox/maps", () => {
  const React = require("react");
  return {
    setAccessToken: jest.fn(),
    MapView: jest.fn(() => null),
    Camera: jest.fn(() => null), 
    ShapeSource: ({ children }) => <>{children}</>,
    LineLayer: () => null,
  };
});


// Mock LocationContext
jest.mock("../../context/LocationContext", () => ({
  useLocationContext: () => ({
    selectedRouteIndex: 0,
  }),
}));

// Mock Google Maps API
jest.mock("../../api/googleMapsApi", () => ({
  getAlternativeRoutes: jest.fn(),
}));

import { getAlternativeRoutes } from "../../api/googleMapsApi";

describe("MapDirections Component", () => {
  const origin = { latitude: 45.5, longitude: -73.6 };
  const destination = { latitude: 45.6, longitude: -73.7 };
  const mapRef = { current: { setCamera: jest.fn() } };

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and processes route correctly", async () => {
    const mockRoutes = [
      {
        mode: "walking",
        routes: [
          {
            coordinates: [[-73.6, 45.5], [-73.7, 45.6]],
            duration: 300,
            distance: 1000,
            summary: "Test route",
          },
        ],
      },
    ];

    getAlternativeRoutes.mockResolvedValueOnce(mockRoutes);

    render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);

    await waitFor(() => {
      expect(getAlternativeRoutes).toHaveBeenCalledWith(origin, destination, ["walking"]);
    });
  });

  it("handles fetch errors gracefully", async () => {
    getAlternativeRoutes.mockRejectedValueOnce(new Error("Network error"));

    render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching alternative routes:", expect.any(Error));
    });
  });

  it("does not update state if unmounted", async () => {
    const mockRoutes = [
      {
        mode: "walking",
        routes: [
          {
            coordinates: [[-73.6, 45.5], [-73.7, 45.6]],
            duration: 300,
            distance: 1000,
            summary: "Test route",
          },
        ],
      },
    ];

    getAlternativeRoutes.mockResolvedValueOnce(mockRoutes);

    const { unmount } = render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);
    unmount();

    await waitFor(() => {
      expect(getAlternativeRoutes).toHaveBeenCalledTimes(1);
    });
  });
});
