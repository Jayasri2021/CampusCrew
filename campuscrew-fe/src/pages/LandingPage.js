import React from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Access user data from the Redux store
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    setSnackbarOpen(true); // Show confirmation message
    navigate('/'); // Redirect to login page after a short delay
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: '#f5f5f5', // Optional background color
        padding: '20px',
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Campus Crew
      </Typography>
      <Typography variant="h2" component="h1" gutterBottom>
Welcome      </Typography>

      {/* {user ? (
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Welcome, {user.firstName} {user.lastName}!<br />
          Your email: {user.email}
        </Typography>
      ) : (
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          You are not logged in.
        </Typography>
      )} */}

      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Logged out successfully!"
      />
    </Box>
  );
};

export default LandingPage;
