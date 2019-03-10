import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ListView extends React.Component {
  render() {
    const filteredVenuesListItems = this.getFilteredVenuesListItems();

    return (
      <List component="nav">
        {filteredVenuesListItems}
      </List>
    );
  }

  getFilteredVenuesListItems() {
    const filteredVenues = this.getFilteredVenues();

    return filteredVenues.map(venue => (
      <ListItem
        button
        aria-label={venue.name}
        key={venue.id}
        selected={venue.selected}
        onClick={() => this.props.onListItemClicked(venue)}
      >
        <ListItemText primary={venue.name}></ListItemText>
      </ListItem>
    ));
  }

  getFilteredVenues() {
    return this.props.venues.filter(venue => {
      if(!this.props.filterValue) return true;

      return venue.name.toLowerCase().indexOf(this.props.filterValue.toLowerCase()) > -1;
    });
  }
}

export default ListView;