import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

class ListView extends React.Component {
  state = {
    filterValue: ''
  };

  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(event) {
    this.setState({filterValue: event.target.value});
    this.props.onFilterChanged(event.target.value);
  }

  render() {
    const filteredVenues = this.props.venues.filter(venue => {
      if(!this.state.filterValue) return true;

      return venue.name.toLowerCase().indexOf(this.state.filterValue.toLowerCase()) > -1;
    });

    const venues = filteredVenues.map(venue => (
      <ListItem
        button

        key={venue.id}
        selected={venue.selected}
        onClick={() => this.props.onListItemClicked(venue)}
      >
        <ListItemText primary={venue.name}></ListItemText>
      </ListItem>
    ));

    return (
      <div className="list-view">
        <TextField
          label="Filter..."
          type="search"
          margin="normal"
          variant="outlined"
          onChange={this.handleFilterChange}
          className="filter"
        />
        <List component="nav">
          {venues}
        </List>
      </div>
    );
  }
}

export default ListView;
