import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Sidebar from './Sidebar';
import MapContainer from './MapContainer';

// This file was taken from the Material UI component demos at:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/drawers/ResponsiveDrawer.js
// It was modified for the purposes of this app. THe modifications
// include rendering the Sidebar and MapContainer components
// in the proper sections of the render() function.
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
  },
});

class ResponsiveDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mobileOpen: false};
    this.handleListItemClicked = this.handleListItemClicked.bind(this);
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleListItemClicked(venue) {
    this.props.setSelectedVenue(venue);
    this.setState({mobileOpen: false});
  }

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <Sidebar
            venues={this.props.venues}
            onFilterChanged={this.props.filterChanged}
            onListItemClicked={this.handleListItemClicked}
          />
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Waikiki Bars
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <MapContainer
              venues={this.props.venues}
              onMarkerClicked={this.props.setSelectedVenue}
              filter={this.props.filter}
            />
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
