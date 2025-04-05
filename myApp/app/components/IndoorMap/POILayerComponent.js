import React from "react";
import Mapbox from "@rnmapbox/maps";
import PropTypes from "prop-types";

export const POILayer = ({ id, image, name, testID }) => {
  return (
    <Mapbox.SymbolLayer
      id={id}
      testID={testID}
      sourceID="indoor-map"
      style={{
        iconImage: image,
        iconSize: 0.3,
        iconAllowOverlap: true, // Ensure icons don't disappear when overlapping
      }}
      filter={["==", ["get", "name"], name]}
      minZoomLevel={18}
    />
  );
};

POILayer.propTypes = {
  id: PropTypes.string.isRequired,
  // Fix PropType for image - in React Native, require() returns a number (resource ID)
  image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
  name: PropTypes.string.isRequired,
  testID: PropTypes.string,
};

export default POILayer;
