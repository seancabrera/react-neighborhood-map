/* global google */
import React, { Component } from 'react';
import ListView from './ListView';
import MapContainer from './MapContainer';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.itemClicked = this.itemClicked.bind(this);
  }

  state = {
    venues: [],
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    markers: []
  };

  componentDidMount() {
    this.fetchFoursquareVenues();
  }

  fetchFoursquareVenues() {
    fetch('https://api.foursquare.com/v2/venues/explore?near=Waikiki&client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201&query=bars')
    .then(response => response.json())
    .then(data => {
      if(data.meta.code !== 200) {
        alert('Error fetching data from FourSquare');
      }

      const places = data.response.groups[0].items;
      this.setVenuesFromPlaces(places);
      this.initMapAndMarkers();
    });
  }

  setVenuesFromPlaces(places) {
    let venues = places.map(place => place.venue);
    venues = venues.sort(this.sortByVenueName);
    this.setState({venues: venues});
  }

  initMapAndMarkers() {
    const waikiki = {lat: 21.289063, lng: -157.826991};
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: waikiki
    });
    const infowindow = new google.maps.InfoWindow();
    const markers = this.state.venues.map(venue => {
      const marker = new google.maps.Marker({
        position: {lat: venue.location.lat, lng: venue.location.lng},
        map: this.map,
        venue: venue,
        id: venue.id,
        name: venue.name
      });

      marker.addListener('click', () => {
        infowindow.setContent(marker.id + ': ' + marker.name);
        infowindow.open(this.map, marker);
        this.state.venues.forEach(venue => venue.selected = false);
        venue.selected = true;
        this.setState({venues: this.state.venues});
      });

      return marker;
    });
    this.map.addListener('click', () => {
      infowindow.close();
      this.state.venues.forEach(venue => venue.selected = false);
      this.setState({venues: this.state.venues});
    });
    this.setState({markers: markers});
  }

  sortByVenueName(a, b) {
    if(a.name > b.name) return 1;
    if(b.name > a.name) return -1;
    return 0;
  }

  itemClicked(venue) {
    this.state.markers.forEach(marker => {
      if(marker.id === venue.id) {
        google.maps.event.trigger(marker, 'click')
      }
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="nav">Neighborhood Map</nav>
        <main className="main">
          <ListView venues={this.state.venues} onItemClicked={this.itemClicked}/>
          <MapContainer />
        </main>
      </div>
    );
  }
}

export default App;
