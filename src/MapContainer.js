import React from 'react'

class MapContainer extends React.Component {
  render() {
    return (
      <div style={{width: '100vw', height: 'calc(100vh - 50px)'}}>
        <div id="map" style={{width: '100%', height: '100%'}}></div>
      </div>
    )
  }
}

export default MapContainer;