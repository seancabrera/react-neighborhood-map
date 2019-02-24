import React, { Component } from 'react';
import ResponsiveDrawer from './ResponsiveDrawer';
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
        <ResponsiveDrawer
          venues={this.state.venues}
          filterChanged={this.filterChanged}
          setSelectedVenue={this.setSelectedVenue}
          filter={this.state.filter}
        />
      </div>
    );
  }
}

export default App;
