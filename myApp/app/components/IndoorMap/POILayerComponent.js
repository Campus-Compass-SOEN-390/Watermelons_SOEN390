import React from 'react';
import Mapbox from '@rnmapbox/maps';
import PropTypes from 'prop-types';

export const POILayer = ({ id, image, name, testID }) => {
  return (
    <Mapbox.SymbolLayer
      id={id}
      testID={testID}
      sourceID="indoor-map"
      style={{
        iconImage: image,
        iconSize: 0.3,
      }}
      filter={['==', ['get', 'name'], name]}
      minZoomLevel={18}
    />
  );
};

POILayer.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  testID: PropTypes.string,
};

export default POILayer;
