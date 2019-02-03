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
    this.fetchFoursquareVenues()
      .then(places => {
        this.setVenuesFromPlaces(places);
        this.initMapAndMarkers();
      })
      .catch(() => alert('Error fetching venues from FourSquare'));
  }

  fetchFoursquareVenues() {
    return fetch('https://api.foursquare.com/v2/venues/explore?near=Waikiki&client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201&query=bars')
      .then(response => {
        if(!response.ok) {
          throw Error('Error fetching FourSquare recommended venues');
        }

        return response.json()
      })
      .then(data => {
        if(data.meta.code !== 200) {
          throw Error('Error fetching FourSquare recommended venues');
        }

        return data.response.groups[0].items;
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
        location: venue.location,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        this.openInfoWindowForMarker(marker);
        this.animateMarkerBounce(marker);
        this.setSelectedListItem(venue);
      });

      return marker;
    });

    this.setState({markers: markers});
  }

  openInfoWindowForMarker(marker) {
    let infoWindowContent = this.getInfoWindowBasicContent(marker);

    this.fetchFourSquareVenueDetails(marker)
      .then(venue => {
          infoWindowContent += this.getInfoWindowAdditionalContent(venue);
          this.infowindow.setContent(infoWindowContent);
          this.infowindow.open(this.map, marker);
        })
        .catch(() => {
          infoWindowContent += '<br> Unable to fetch additional details';
          this.infowindow.setContent(infoWindowContent);
          this.infowindow.open(this.map, marker);
        });;
  }

  animateMarkerBounce(marker) {
    this.map.panTo(marker.position);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1000);
  }

  /*
  * It seems as though using the FourSquare details API makes this
  * app go over the quota for the free account too quickly...
  */
  fetchFourSquareVenueDetails(marker) {
    return fetch(`https://api.foursquare.com/v2/venues/${marker.id}?client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201`)
      .then(response => {
        if(!response.ok) {
          throw Error('this sucks');
        }

        return response.json()
      })
      .then(data => {
        if(data.meta.code !== 200) {
          throw Error('Error fetching data from FourSquare');
        }

        return data.response.venue;
      });
  }

  getInfoWindowBasicContent(venue) {
    return `
      <h1>${venue.name}</h1>
      <p>${venue.location.address}</p>
    `;
  }

  getInfoWindowAdditionalContent(venueDetails) {
    let content = '';
    if(venueDetails.description) {
      content += `<p style="text-align: left;">${venueDetails.description}</p>`;
    }
    if(venueDetails.url) {
      content += `<a href="${venueDetails.url}" target="_blank">${venueDetails.url}</a>`;
    }
    return content;
  }

  setSelectedListItem(venue) {
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
