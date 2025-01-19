import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid, Paper, Avatar, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingsByUserIdAsync, deleteBookingAsync } from '../redux/slices/serviceSlice';

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', weekday: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const YourBookings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const bookings = useSelector((state) => state.services.bookings); // Correct state slice
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookingsByUserIdAsync(user.id));
      console.log('Fetching bookings for user:', user.id);
    }
  }, [dispatch, user]);

  const handleDeleteBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteBooking = async () => {
    if (selectedBookingId) {
      await dispatch(deleteBookingAsync(selectedBookingId));
      setOpenDeleteDialog(false);
    }
  };

  const cancelDeleteBooking = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: 'bold', marginBottom: 3, textAlign: 'center', color: '#333' }}
      >
        Your Bookings
      </Typography>

      {bookings?.length ? (
        <Grid container spacing={4}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.booking_id}>
              <Paper elevation={4} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
                <Stack spacing={2}>
                  {/* Display Service Image */}
                  {booking.services?.serviceimages?.[0]?.image_url && (
                    <Avatar
                      variant="square"
                      src={booking.services.serviceimages[0].image_url}
                      alt={booking.services.name}
                      sx={{ width: '100%', height: 200, borderRadius: 2 }}
                    />
                  )}
                  
                  {/* Booking Details */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                    {booking.services.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', textAlign: 'center' }}>
                    {booking.services.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
                    Rate: <span style={{ fontWeight: 'normal' }}>${booking.services.rate} per hour</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
                    Booked For: <span style={{ fontWeight: 'normal' }}>{formatDate(booking.serviceavailability.avail_slots)}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
                    Duration: <span style={{ fontWeight: 'normal' }}>{booking.serviceavailability.max_hrs} hours</span>
                  </Typography>

                  {/* User Details */}
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
                    Booked By: <span style={{ fontWeight: 'normal' }}>{booking.users.first_name} {booking.users.last_name} ({booking.users.email})</span>
                  </Typography>

                  {/* Actions (if needed) */}
                  <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                    View Details
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth 
                    sx={{ marginTop: 2 }} 
                    onClick={() => handleDeleteBooking(booking.booking_id)}
                  >
                    Delete Booking
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 3, textAlign: 'center', color: '#555' }}>
          No bookings found.
        </Typography>
      )}

      {/* Delete Booking Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteBooking}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#333' }}>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteBooking} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteBooking} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default YourBookings;
