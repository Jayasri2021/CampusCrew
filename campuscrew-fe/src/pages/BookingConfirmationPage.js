import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, IconButton, Divider } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingDetailsAsync } from '../redux/slices/serviceSlice'; 

const BookingConfirmation = () => {
  const [isLoading, setIsLoading] = useState(true); // Local loading state
  const [error, setError] = useState(null); // Local error state

  const dispatch = useDispatch();
  const { bookingDetails, loading, error: reduxError } = useSelector(state => state.services);
  const { bookingId } = useParams(); // Get the bookingId from the URL

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        try {
          // Dispatch action to fetch booking details
          await dispatch(fetchBookingDetailsAsync(bookingId));
        } catch (err) {
          // Handle errors
          setError('Error fetching booking details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookingDetails();
    }
  }, [bookingId, dispatch]);

  // Show loading spinner if data is still being fetched
  if (isLoading || loading) {
    return <CircularProgress />;
  }

  // Show error message if there is an error
  if (error || reduxError) {
    return <Typography color="error">{error || reduxError}</Typography>;
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Booking Confirmation
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <CheckCircleIcon sx={{ color: 'green', fontSize: 30, marginRight: 2 }} />
        <Typography variant="h5" color="primary">Booking Confirmed</Typography>
      </Box>

      {bookingDetails && (
        <Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="h6" gutterBottom>
            Booking ID: <strong>{bookingDetails.booking_id}</strong>
          </Typography>
          <Typography variant="body1">
            <strong>Service:</strong> {bookingDetails.service.name}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {bookingDetails.service.description}
          </Typography>
          <Typography variant="body1">
            <strong>Rate:</strong> ${bookingDetails.service.rate}/hr
          </Typography>
          <Typography variant="body1">
            <strong>Scheduled Slot:</strong> {new Date(bookingDetails.slot.avail_slots).toLocaleString()}
          </Typography>
        </Box>
      )}

      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
