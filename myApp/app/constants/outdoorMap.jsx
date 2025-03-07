//Campus regions
export const sgwRegion = {
    latitude: 45.4951962,
    longitude: -73.5792229,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
export const loyolaRegion = {
    latitude: 45.4581281,
    longitude: -73.6417009,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
  //Coordinates for shuttle from SGW to Loyola. Need to be updated with proper coordinates. Also, need to add ones for loyola to SGW.
  //Note that here for mapbox it is longitude first, and the latitude. So, the reverse of google maps
export const SGWtoLoyola = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.57849, 45.49706],
        [-73.5793, 45.49604], 
        [-73.57934, 45.49579],
        [-73.5817, 45.49357],
        [-73.577, 45.48973],
        [-73.62401, 45.46161],
        [-73.62888, 45.46374],
        [-73.63882, 45.45789],
      ],
    },
  };