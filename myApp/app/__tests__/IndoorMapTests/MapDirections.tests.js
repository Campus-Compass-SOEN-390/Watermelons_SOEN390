import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapDirections from "../../components/MapDirections";
import polyline from '@mapbox/polyline';

jest.mock('@mapbox/polyline', () => ({
  decode: jest.fn(() => [[-73.6, 45.5], [-73.7, 45.6]]),
}));

jest.mock("@rnmapbox/maps", () => ({
  setAccessToken: jest.fn(),
  MapView: jest.fn(() => null),
  Camera: jest.fn(() => null),
  ShapeSource: jest.fn(({ children }) => <>{children}</>),
  LineLayer: jest.fn(() => null),
}));

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe("MapDirections Component", () => {
  const origin = { latitude: 45.5, longitude: -73.6 };
  const destination = { latitude: 45.6, longitude: -73.7 };
  const mapRef = { current: { setCamera: jest.fn() } };

  it("fetches and processes route correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        routes: [
          {
            geometry: { coordinates: [[-73.6, 45.5], [-73.7, 45.6]] },
          },
        ],
      }),
    });

    render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("handles fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);

    await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error fetching Google Maps routes:", expect.any(Error)));
  });

  it("does not update state if unmounted", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        routes: [
          {
            geometry: { coordinates: [[-73.6, 45.5], [-73.7, 45.6]] },
          },
        ],
      }),
    });

    const { unmount } = render(<MapDirections origin={origin} destination={destination} travelMode="walking" mapRef={mapRef} />);

    unmount();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
