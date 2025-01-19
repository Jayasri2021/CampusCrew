import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

const Sidebar = ({ selectedSection, handleSectionChange }) => {
  // Get user state from Redux
  const user = useSelector((state) => state.auth.user);

  // Define the default sections
  const sections = ['Book Services', 'Your Bookings','Messages', 'Profile'];

  // Conditionally add 'Add New Service' if the user has 'isPfw' as true
  if (user?.isPfw && !sections.includes('Add New Service', 'Your Services')) {
    sections.unshift('Add New Service','Your Services');  // Add at the start of the array
  }

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        padding: 2,
      }}
    >
      {/* Logo with Animation */}
      <Box
        sx={{
          marginBottom: 4,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            letterSpacing: '2px',
          }}
        >
          CampusCrew
        </Typography>
      </Box>

      {/* Sidebar Links */}
      <List>
        {sections.map((text) => (
          <ListItem
            button
            key={text}
            selected={selectedSection === text}
            onClick={() => handleSectionChange(text)}
            sx={{
              backgroundColor: selectedSection === text ? 'primary.main' : 'transparent',
              color: selectedSection === text ? 'text.contrastText' : 'text.primary',
              padding: '12px 12px',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: selectedSection === text ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
