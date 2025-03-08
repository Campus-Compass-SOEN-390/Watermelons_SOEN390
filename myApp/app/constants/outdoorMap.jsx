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
        [-73.57926, 45.49598], 
        [-73.57929, 45.49567],
        [-73.5817, 45.49361],
        [-73.57752, 45.49113],
        [-73.57703, 45.49031],
        [-73.57718, 45.48926],
        [-73.59379, 45.47847],
        [-73.59624, 45.47457], 
        [-73.59759, 45.47338],
        [-73.59856, 45.47311],
        [-73.60328, 45.4696],
        [-73.60533, 45.46872],
        [-73.60716, 45.46741],
        [-73.60989, 45.46663],
        [-73.61212, 45.4655],
        [-73.61413, 45.46513],
        [-73.61774, 45.46328],
        [-73.62239, 45.46232],
        [-73.62399, 45.46158],
        [-73.62893, 45.46368],
        [-73.63701, 45.45937],
        [-73.63882, 45.45789],
      ],
    },
  };