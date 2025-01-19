import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campus Crew
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/profile" color="inherit">Profile</Button>
          <Button component={Link} to="/services" color="inherit">Services</Button>
          <Button component={Link} to="/contact" color="inherit">Contact</Button>
        </Box>
        <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/profile" onClick={toggleDrawer}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button component={Link} to="/services" onClick={toggleDrawer}>
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
