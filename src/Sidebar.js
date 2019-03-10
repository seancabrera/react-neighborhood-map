import React from 'react';
import FilterInput from './FilterInput';
import FourSquareLogo from './FourSquareLogo';
import ListView from './ListView';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: ''
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(filterValue) {
    this.setState({filterValue: filterValue});
    this.props.onFilterChanged(filterValue);
  }

  render() {
    return (
      <div className="sidebar">
        <FourSquareLogo />
        <FilterInput
          handleFilterChange={this.handleFilterChange}
        />
        <ListView
          venues={this.props.venues}
          filterValue={this.state.filterValue}
          onListItemClicked={this.props.onListItemClicked}
        />
      </div>
    );
  }
}

export default Sidebar;
