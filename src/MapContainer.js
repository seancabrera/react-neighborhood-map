import React, { Component } from 'react'

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    venues: []
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

  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/explore?near=Waikiki&client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201&query=bars')
    .then(response => response.json())
    .then(data => {
      if(data.meta.code !== 200) {
        alert('Error fetching data from FourSquare');
      }

      const places = data.response.groups[0].items;
      this.setState({places: places})
      console.log(places);

      const venues = places.map(place => place.venue);
      this.setState({venues: venues});
    });
  }

  render() {
    const markers = this.state.venues.map(venue => (
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