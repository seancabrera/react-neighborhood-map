import React from 'react'

class MapContainer extends React.Component {
  render() {
    return (
      <div className="map-container">
        <div id="map" role="application"></div>
      </div>
    )
  }
}

export default MapContainer;