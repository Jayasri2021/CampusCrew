import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ user }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Greeting on the left */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CampusCrewwwww
        </Typography>

        {/* User Profile */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Hello, {user.name}
          </Typography>
          <Avatar alt={user.name} src="/profile.jpg" sx={{ bgcolor: 'secondary.main' }} />
          <IconButton
            data-test="logout-button"
            color="inherit"
            onClick={() => {
              // Handle logout action
              console.log('Logout clicked');
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
