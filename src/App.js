/* global google */
import React, { Component } from 'react';
import ListView from './ListView';
import MapContainer from './MapContainer';
import './App.css';

class App extends Component {
  state = {
    venues: [],
    markers: []
  };

  constructor(props) {
    super(props);
    this.listItemClicked = this.listItemClicked.bind(this);
    this.filterChanged = this.filterChanged.bind(this);
  }

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
    console.log(venues);
  }

  sortByVenueName(a, b) {
    if(a.name > b.name) return 1;
    if(b.name > a.name) return -1;
    return 0;
  }

  initMapAndMarkers() {
    this.initMap();
    this.initMarkers();
  }

  initMap() {
    const waikiki = {lat: 21.289063, lng: -157.826991};

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: waikiki
    });

    this.infowindow = new google.maps.InfoWindow();

    this.map.addListener('click', () => {
      this.infowindow.close();
      this.state.venues.forEach(venue => venue.selected = false);
      this.setState({venues: this.state.venues});
    });
  }

  initMarkers() {
    const markers = this.state.venues.map(venue => {
      const marker = new google.maps.Marker({
        position: {lat: venue.location.lat, lng: venue.location.lng},
        map: this.map,
        venue: venue,
        id: venue.id,
        name: venue.name,
        location: venue.location
      });

      marker.addListener('click', () => {
        this.openInfoWindowForMarker(marker);
        this.setSelectedVenue(venue);
      });

      return marker;
    });

    this.setState({markers: markers});
  }

  openInfoWindowForMarker(marker) {
    // this.fetchFourSquareVenueDetails(marker);

    this.infowindow.setContent(this.getInfoWindowContent(marker));
    this.infowindow.open(this.map, marker);
    this.map.panTo(marker.position);
  }

  /*
  * Leaving this in here for reference. It seems as though using
  * the FourSquare details API makes this app go over the quota
  * for the free account too quickly.
  */
  fetchFourSquareVenueDetails(marker) {
    fetch(`https://api.foursquare.com/v2/venues/${marker.id}?client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201`)
      .then(response => response.json())
      .then(data => {
        if(data.meta.code !== 200) {
          alert('Error fetching data from FourSquare');
        }

        this.infowindow.setContent(this.getInfoWindowContent(data.response.venue));
        this.infowindow.open(this.map, marker);
      });
  }

  getInfoWindowContent(venueDetails) {
    return `
      <h1>${venueDetails.name}</h1>
      <p>${venueDetails.location.address}</p>
    `;

  }

  setSelectedVenue(venue) {
    this.state.venues.forEach(venue => venue.selected = false);
    venue.selected = true;
    this.setState({venues: this.state.venues});
  }

  listItemClicked(venue) {
    this.state.markers.forEach(marker => {
      if(marker.id === venue.id) {
        google.maps.event.trigger(marker, 'click')
      }
    });
  }

  filterChanged(filter) {
    this.state.markers.forEach(marker => {
      if(marker.name.toLowerCase().indexOf(filter.toLowerCase()) < 0) {
        marker.setVisible(false);
      } else {
        marker.setVisible(true);
      }
    });

    this.infowindow.close();
  }

  render() {
    return (
      <div className="App">
        <nav className="nav">
          <h1>Waikiki Bars</h1>
        </nav>

        <main className="main">
          <ListView
            venues={this.state.venues}
            onFilterChanged={this.filterChanged}
            onListItemClicked={this.listItemClicked}
          />
          <MapContainer />
        </main>
      </div>
    );
  }
}

export default App;
