/* global google */
import React from 'react'
import * as FourSquareAPI from './FourSquareAPI';

class MapContainer extends React.Component {
  state = {
    markers: []
  }

  componentDidUpdate(prevProps) {
    if(this.isVenuesInitializing(this.props.venues, prevProps.venues)) {
      this.initMapAndMarkers();
    }

    this.setSelectedVenue();
  }

  isVenuesInitializing(newVenues, oldVenues) {
    return newVenues.length > 0 && oldVenues.length === 0;
  }

  setSelectedVenue() {
    this.props.venues.forEach(venue => {
        if(venue.selected && venue !== this.state.selectedVenue) {
            this.setState({selectedVenue: venue});
            this.state.markers.forEach(marker => {
              if(marker.id === venue.id) {
                google.maps.event.trigger(marker, 'click')
              }
            });
        }
    });
  }

  selectedVenueChanged(selectedVenue) {
    this.state.markers.forEach(marker => {
      if(marker.id === selectedVenue.id) {
        google.maps.event.trigger(marker, 'click')
      }
    });
  }

  initMapAndMarkers() {
    this.initMap();
    this.initMarkers();
  }

  initMap() {
    // const waikiki = {lat: 21.289063, lng: -157.826991};
    const waikiki = {lat: 21.284063, lng: -157.831000};

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: waikiki
    });

    this.infowindow = new google.maps.InfoWindow();

    this.map.addListener('click', () => {
      this.infowindow.close();
      this.props.venues.forEach(venue => venue.selected = false);
      this.setState({venues: this.props.venues});
    });
  }

  initMarkers() {
    const markers = this.props.venues.map(venue => {
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
        this.props.onMarkerClicked(venue);
      });

      return marker;
    });

    this.setState({markers: markers});
  }

  openInfoWindowForMarker(marker) {
    let infoWindowContent = this.getInfoWindowBasicContent(marker);

    FourSquareAPI.getVenueDetails(marker.id)
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

  getInfoWindowBasicContent(venue) {
    const fourSquarePageURL = FourSquareAPI.getFourSquarePageUrl(venue.id);

    return `
      <h2><a href="${fourSquarePageURL}"" target="_blank">${venue.name}</a></h2>
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

  filterMarkers() {
    this.state.markers.forEach(marker => {
      if(marker.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) < 0) {
        marker.setVisible(false);
      } else {
        marker.setVisible(true);
      }
    });
  }

  render() {
    this.filterMarkers();

    return (
      <div className="map-container">
        <div id="map" role="application"></div>
      </div>
    )
  }
}

export default MapContainer;