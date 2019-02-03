import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class ListView extends React.Component {
  render() {
    const venues = this.props.venues.map(venue => (
      <ListItem
        button
        key={venue.id}
        selected={venue.selected}
        onClick={() => this.props.onItemClicked(venue)}
      >
        <ListItemText primary={venue.name}></ListItemText>
      </ListItem>
    ));

    return (
      <div style={{width: '400px'}}>
        <List component="nav">
          {venues}
        </List>
      </div>
    );
  }
}

export default ListView;
