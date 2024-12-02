import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category, Plumbing } from '@mui/icons-material';
import AddServiceForm from "./ServiceForm"
import Booking from "../../pages/BookServices"
import ProfilePage from '../../pages/ProfilePage';
import HeroSection from './HeroSection';
import { useSelector } from 'react-redux';




// Services Section
// export const Services = () => (
//   <Box>
//     <Typography variant="h5">Manage Services</Typography>
//     {/* Add service cards or lists */}
//   </Box>
// );

export const BookingPage = () => (
  <Box>
    <Typography variant="h5">Book Services</Typography>
    <Booking/>
  </Box>
);


export const ViewBookings = () => (
  <Box>
    <Typography variant="h5">Your Bookings</Typography>
    <Booking/>
  </Box>
);

// Add New Service Section
export const AddNewService = () => (
    <AddServiceForm/>
);

// Messages Section


export const Messages = () => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh'  // Full viewport height to center vertically in the entire viewport
  }}>
    <Typography variant="h1" component="h1" sx={{ textAlign: 'center' }}>
      Coming Soon...
    </Typography>
  </Box>
);

// Reviews Section
export const Reviews = () => (
  <Box>

    <Typography variant="h5">Customer Reviews</Typography>
    {/* Add review components or list */}
  </Box>
);

// Settings Section
export const Settings = () => (
  <Box>
    {/* <Typography variant="h5">Account Overview</Typography> */}
    {/* Add account setting forms or details */}
    <ProfilePage></ProfilePage>
  </Box>
);


