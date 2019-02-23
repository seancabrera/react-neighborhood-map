import React, { Component } from 'react';
import ListView from './ListView';
import MapContainer from './MapContainer';
import * as FourSquareAPI from './FourSquareAPI';
import './App.css';

class App extends Component {
  state = {
    venues: [],
    filter: ''
  };

  constructor(props) {
    super(props);
    this.filterChanged = this.filterChanged.bind(this);
    this.setSelectedVenue = this.setSelectedVenue.bind(this);
  }

  componentDidMount() {
    FourSquareAPI.getRecommendedVenues()
      .then(venues => {
        this.setState({venues: venues});
      })
      .catch(() => alert('Error fetching venues from FourSquare'));
  }

  setSelectedVenue(venue) {
    this.state.venues.forEach(venue => venue.selected = false);
    venue.selected = true;
    this.setState({venues: this.state.venues});
  }

  filterChanged(filter) {
    this.setState({filter: filter});
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
            onListItemClicked={this.setSelectedVenue}
          />
          <MapContainer
            venues={this.state.venues}
            onMarkerClicked={this.setSelectedVenue}
            filter={this.state.filter}
          />
        </main>
      </div>
    );
  }
}

export default App;
