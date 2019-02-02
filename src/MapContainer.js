import React, { Component } from 'react'

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const markers = this.props.venues.map(venue => (
      <Marker
        key={venue.id}
        onClick={this.onMarkerClick}
        name={venue.name}
        position={{lat: venue.location.lat, lng: venue.location.lng}}
      />)
    )

    return (
      <Map
        google={this.props.google}
        onClick={this.onMapClicked}
        initialCenter={{
            lat: 21.289063,
            lng: -157.826991
          }}
        initialZoom={25}
      >
        {markers}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDf2ypYu8fLcI22iwkU1BkrlCk2Ss_8Y3Y'
})(MapContainer)