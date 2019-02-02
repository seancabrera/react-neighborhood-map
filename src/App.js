import React, { Component } from 'react';
import ListView from './ListView';
import MapContainer from './MapContainer';
import './App.css';

class App extends Component {
  state = {
    venues: []
  };

  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/explore?near=Waikiki&client_id=QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ&client_secret=RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF&v=20190201&query=bars')
    .then(response => response.json())
    .then(data => {
      if(data.meta.code !== 200) {
        alert('Error fetching data from FourSquare');
      }

      const places = data.response.groups[0].items;

      let venues = places.map(place => place.venue);
      venues = venues.sort(this.sortByVenueName);
      this.setState({venues: venues});
    });
  }

  sortByVenueName(a, b) {
    if(a.name > b.name) return 1;
    if(b.name > a.name) return -1;
    return 0;
  }

  render() {

    return (
      <div className="App">
        <nav class="nav">Neighborhood Map</nav>
        <main class="main">
          <ListView venues={this.state.venues} />
          <MapContainer venues={this.state.venues}/>
        </main>
      </div>
    );
  }
}

export default App;
