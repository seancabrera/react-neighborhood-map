import React from 'react';
import TextField from '@material-ui/core/TextField';

class FilterInput extends React.Component {
  componentDidMount() {
    // The "Responsive Drawer" will remount this component
    // whenever it is reopened on mobile. To properly sync
    // with the map, reset the filter state throughout the App
    // by bubbling up this event
    this.props.handleFilterChange('');
  }

  render() {
    return (
      <TextField
        label="Filter..."
        type="search"
        margin="normal"
        variant="outlined"
        onChange={(event) => this.props.handleFilterChange(event.target.value)}
        className="filter"
      />
    );
  }

}

export default FilterInput;