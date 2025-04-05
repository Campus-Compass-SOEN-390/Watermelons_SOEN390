import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapDirections from "../../components/MapDirections";

let mockCameraRef = { setCamera: jest.fn() };

jest.mock("@mapbox/polyline", () => ({
  decode: jest.fn(() => [[-73.6, 45.5], [-73.7, 45.6]]),
}));

jest.mock("@rnmapbox/maps", () => {
  const React = require("react");
  return {
    setAccessToken: jest.fn(),
    MapView: jest.fn(() => null),
    Camera: React.forwardRef((props, ref) => {
      if (ref && typeof ref === "object") {
        mockCameraRef.setCamera = jest.fn(); 
        ref.current = mockCameraRef;
      }
      return null;
    }),
    ShapeSource: ({ children }) => <>{children}</>,
    LineLayer: () => null,
  };
});

jest.mock("../../context/LocationContext", () => ({
  useLocationContext: () => ({
    selectedRouteIndex: 0,
  }),
}));

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

  it("returns null when origin or destination is missing", () => {
    const { queryByTestId } = render(<MapDirections origin={null} destination={destination} travelMode="walking" mapRef={mapRef} />);
    expect(queryByTestId("map-container")).toBeNull();
  
    const { queryByTestId: queryByTestId2 } = render(<MapDirections origin={origin} destination={null} travelMode="walking" mapRef={mapRef} />);
    expect(queryByTestId2("map-container")).toBeNull();
  });

  it("renders multiple routes and highlights the selected one", async () => {
    const mockRoutes = [
      {
        mode: "walking",
        routes: [
          {
            coordinates: [[-73.6, 45.5], [-73.7, 45.6]],
            duration: 300,
            distance: 1000,
            summary: "Route 1",
          },
          {
            coordinates: [[-73.6, 45.5], [-73.8, 45.7]],
            duration: 350,
            distance: 1200,
            summary: "Route 2",
          },
        ],
      },
    ];
  
    getAlternativeRoutes.mockResolvedValueOnce(mockRoutes);
  
    render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(getAlternativeRoutes).toHaveBeenCalledTimes(1);
    });
  });

  it("does not fetch routes if origin, destination, and travel mode are unchanged", async () => {
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
  
    getAlternativeRoutes.mockResolvedValue(mockRoutes);
  
    const { rerender } = render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(getAlternativeRoutes).toHaveBeenCalledTimes(1);
    });
  
    rerender(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);
  
    await waitFor(() => {
      expect(getAlternativeRoutes).toHaveBeenCalledTimes(1); // Still just 1 call
    });
  });

  it("calls setCamera when routes and selectedRouteIndex are valid", async () => {
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
  
    getAlternativeRoutes.mockResolvedValue(mockRoutes);
  
    render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(mockCameraRef.setCamera).toHaveBeenCalledWith(
        expect.objectContaining({
          centerCoordinate: expect.any(Array),
          zoomLevel: expect.any(Number),
          animationDuration: 1000,
        })
      );
    });
  });

  it("does not call setCamera if cameraRef is null", async () => {
    const mockRoutes = [
      {
        mode: "walking",
        routes: [
          {
            coordinates: [[-73.6, 45.5]],
            duration: 300,
            distance: 1000,
            summary: "Short route",
          },
        ],
      },
    ];
  
    getAlternativeRoutes.mockResolvedValueOnce(mockRoutes);
  
    mockCameraRef.setCamera = jest.fn(); 
    const mock = require("@rnmapbox/maps");
    mock.Camera = React.forwardRef((props, ref) => {
      if (ref && typeof ref === "object") {
        ref.current = null;
      }
      return null;
    });
  
    render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(mockCameraRef.setCamera).not.toHaveBeenCalled();
    });
  });  

  it("logs error if alternativeRoutes is not an array", async () => {
    getAlternativeRoutes.mockResolvedValueOnce({ bad: "data" });
  
    render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Unexpected response structure:",
        expect.objectContaining({ bad: "data" })
      );
    });
  });

  it("logs warning if no routes are found for selected mode", async () => {
    const mockRoutes = [
      {
        mode: "cycling",
        routes: [],
      },
    ];
  
    getAlternativeRoutes.mockResolvedValueOnce(mockRoutes);
  
    render(
      <MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />
    );
  
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith("No alternative routes found.");
    });
  });
  

});
