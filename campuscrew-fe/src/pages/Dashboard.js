// Dashboard.js
import React, { useState,useEffect } from 'react';
import { AppBar,Box, Typography, IconButton,Avatar, Grid, Paper, Toolbar } from '@mui/material';
import Sidebar from '../components/UI/Sidebar';  // Import the Sidebar component
import {BookingPage, AddNewService, Messages, Reviews, Settings } from '../components/UI/Section'; // Import the sections
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice'; // Correct path to your authSlice
import YourServices from '../pages/YourServices'
import YourBookings from '../pages/YourBookings'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedSection, setSelectedSection] = useState('Services');

  useEffect(() => {
    if (!user) {
      // If no user is found in the state, redirect to login
      navigate('/login');
      
      return;
    }

    const storedIsPfw = localStorage.getItem('is_pfw');
    
    // Only reload if the isPfw state is different from what's in localStorage
    if (user.isPfw !== (storedIsPfw === 'true')) {
      localStorage.setItem('is_pfw', user.isPfw);
      window.location.reload(); // Reload the page to update the state
    }

    // Redirect to dashboard if the user is logged in
    if (user && user.isPfw) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  // Function to handle the selection of a section
  const handleSectionChange = (section) => setSelectedSection(section);

  // Function to render the selected section dynamically
 
const renderSection = () => {
  switch (selectedSection) {
    // case 'Services':
    //   return <Services />;
    case 'Add New Service':
      return user?.isPfw ? <AddNewService /> : null;
    case 'Messages':
      return <Messages />;
    case 'Reviews':
      return <Reviews />;
    case 'Profile':
      return <Settings />;
    case 'Book Services': // Add the new Booking page
      return <BookingPage />;
    case 'Your Services':
      return <YourServices />;

    case 'Your Bookings':
      return <YourBookings />;
    default:
      return <BookingPage />;
  }
};

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Use the Sidebar component here */}
      <Sidebar selectedSection={selectedSection} handleSectionChange={handleSectionChange} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Top AppBar */}
      <AppBar position="static" color="primary">
      <Toolbar>
        {/* Greeting on the left */}
        <Button 
  component={Link} 
  to="/dashboard" 
  variant="text" 
  sx={{ flexGrow: 1 }}
>
  CampusCrew
</Button>

        {/* User Profile */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Hello {user?.firstName || 'Guest'}
          </Typography>
          <Avatar alt={user.name} src="/profile.jpg" sx={{ bgcolor: 'secondary.main' }} />
          <IconButton
            color="inherit"
            onClick={() => {
              // Handle logout action
              handleLogout()
              console.log('Logout clicked');
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>

        {/* Summary Section */}
        {/* <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Earnings</Typography>
              <Typography variant="h4">{user.totalEarnings}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Active Bookings</Typography>
              <Typography variant="h4">{user.activeBookings}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Average Rating</Typography>
              <Typography variant="h4">{user.averageRating}</Typography>
            </Paper>
          </Grid>
        </Grid> */}

        {/* Section Content */}
        <Box sx={{ mt: 3 }}>
          {renderSection()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
