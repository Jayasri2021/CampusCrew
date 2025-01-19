import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

const ProfilePage = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state.auth.user);

  // If user data isn't available in Redux, fall back to localStorage
  const userId = user?.id || localStorage.getItem('user_id');
  const firstName = user?.firstName || localStorage.getItem('first_name');

  // Use `isPfw` value from Redux, falling back to localStorage if needed
  const isPfw = user?.isPfw !== undefined ? user.isPfw : JSON.parse(localStorage.getItem('is_pfw') || 'false');

  console.log("profile info from state", user);

  const [profileInfo, setProfileInfo] = useState({
    userId,
    firstName,
    isPfw,
    email: '', // Placeholder for email or any other data
    address: '', // Placeholder for address
  });

  // Fetch user profile details (if necessary, e.g., from an API)
  useEffect(() => {
    console.log("userId in useEffect", userId);
    if (userId) {
      // Mock API call to fetch additional user info (could be replaced with an actual API call)
      const fetchProfileData = async () => {
        console.log("Fetching profile data...");
        const data = {
          email: 'user@example.com', // Example email
          address: '123 Main St, City, Country', // Example address
        };
        setProfileInfo((prevState) => ({
          ...prevState,
          email: data.email,
          address: data.address,
        }));
      };

      fetchProfileData();
    }
  }, [userId]);

  console.log("profileInfo state", profileInfo);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Page
      </Typography>

      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">User Information</Typography>
            <Divider sx={{ marginY: 2 }} />

            <Typography variant="body1">
              <strong>User ID:</strong> {profileInfo.userId}
            </Typography>
            <Typography variant="body1">
              <strong>First Name:</strong> {profileInfo.firstName}
            </Typography>
            {/* <Typography variant="body1">
              <strong>Email:</strong> {profileInfo.email}
            </Typography> */}
            <Typography variant="body1">
              <strong>Address:</strong> {profileInfo.address}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {profileInfo.isPfw ? 'Purdue Fort Wayne Student User' : 'Regular User'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
