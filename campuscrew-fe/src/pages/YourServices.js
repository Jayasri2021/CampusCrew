import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  CardActions,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicesbyUserId, editSlotAsync, deleteSlotAsync, deleteServiceAsync } from '../redux/slices/serviceSlice'; // Thunk imports
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';

const Services = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const services = useSelector((state) => state.services.services);

  const [open, setOpen] = useState(false); // Dialog state
  const [currentAvailability, setCurrentAvailability] = useState(null); // Slot being edited
  const [slotValue, setSlotValue] = useState(null); // Slot input state
  const [maxHrs, setMaxHrs] = useState(2); // Max hours state
  const [toastOpen, setToastOpen] = useState(false); // Toast state
  const [toastMessage, setToastMessage] = useState(''); // Toast message
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Confirmation dialog for deletion
  const [deleteServiceId, setDeleteServiceId] = useState(null); // Store the service id to delete

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchServicesbyUserId(user.id));
    }
  }, [dispatch, user]);

  const handleEditSlot = (availability) => {
    setCurrentAvailability(availability);
    setSlotValue(availability.avail_slots ? DateTime.fromISO(availability.avail_slots) : null);
    setMaxHrs(availability.max_hrs || 2); // If max_hrs is available, set it
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAvailability(null);
  };

  const handleSaveSlot = async () => {
    if (currentAvailability && slotValue) {
      const payload = {
        availability_id: currentAvailability.availability_id,
        avail_slots: slotValue.toFormat('yyyy-LL-dd HH:mm:ss'), // Use toFormat() to format the date as required
        max_hrs: maxHrs, // Use maxHrs from the input field
      };
      console.log('my payload', payload);

      try {
        const response = await dispatch(editSlotAsync(payload));

        if (response.meta.requestStatus === 'fulfilled') {
          setToastMessage('Slot updated successfully');
          setToastOpen(true);
          setTimeout(() => {
            dispatch(fetchServicesbyUserId(user.id)); // Refresh services list after 2 seconds
            handleClose();
          }, 2000); // Timeout before refresh
        } else {
          throw new Error('Failed to update slot');
        }
      } catch (error) {
        setToastMessage(error.message || 'Failed to update slot');
        setToastOpen(true);
      }
    } else {
      setToastMessage('Slot value cannot be empty');
      setToastOpen(true);
    }
  };

  const handleDeleteSlot = async (availabilityId) => {
    console.log('Attempting to delete slot with availabilityId:', availabilityId);

    try {
      // Dispatching the delete slot action and passing only the availabilityId directly
      const response = await dispatch(deleteSlotAsync(availabilityId));

      console.log('Delete Slot Response:', response);

      // Check if the response indicates success (status 200)
      if (response?.meta?.requestStatus === 'fulfilled' && response.payload?.status === 200) {
        setToastMessage('Slot deleted successfully');
        setToastOpen(true);
        setTimeout(() => {
          dispatch(fetchServicesbyUserId(user.id)); // Refresh services list after 2 seconds
        }, 2000); // Timeout before refresh
      } else {
        throw new Error('Failed to delete slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      // setToastMessage(error.message || 'Failed to delete slot');
      // setToastOpen(true);
      dispatch(fetchServicesbyUserId(user.id)); // Refresh services list after 2 seconds

    }
  };

  // Ensure that when no services or slots are available, a message is shown
  const renderNoSlotsMessage = () => {
    if (services.length === 0) {
      return (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 3 }}>
          No slots available. Please add new slots.
        </Typography>
      );
    }
  };

  const handleDeleteService = async () => {
    console.log('Attempting to delete service with serviceId:', deleteServiceId);

    try {
      const response = await dispatch(deleteServiceAsync({ serviceId: deleteServiceId }));
      console.log('Delete Service Response:', response);

      // Check if the response indicates success (status 200)
      if (response?.meta?.requestStatus === 'fulfilled' && response.payload?.status === 200) {
        setToastMessage('Service deleted successfully');
        setToastOpen(true);
        setTimeout(() => {
          dispatch(fetchServicesbyUserId(user.id)); // Refresh services list after 2 seconds
          setConfirmDeleteOpen(false); // Close confirmation dialog after refresh
        }, 2000); // Timeout before refresh
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setToastMessage(error.message || 'Failed to delete service');
      setToastOpen(true);
      setConfirmDeleteOpen(false); // Close confirmation dialog on failure
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Services Provided by {user?.firstName}
      </Typography>

      <Grid container spacing={3}>
        {services.map((service) => {
          // Check if the service has no available slots
          const hasAvailableSlots = service.serviceavailability?.some((availability) => !availability.is_booked);

          return (
            <Grid item xs={12} sm={6} md={4} key={service.service_id}>
              <Card
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  padding: 3,
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%',
                        height: 150,
                        borderRadius: 2,
                        border: '1px solid #ccc',
                        marginBottom: 2,
                        objectFit: 'cover',
                      }}
                      image={service.serviceimages?.[0]?.image_url || 'https://placehold.co/400'}
                      alt={service.name}
                    />
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                      {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginBottom: 2 }}>
                      {service.description}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ marginBottom: 2 }}>
                      ${service.rate}/hr
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                      Available Time Slots:
                    </Typography>
                    {hasAvailableSlots ? (
                      service.serviceavailability?.map((availability) => (
                        <Box
                          key={availability.availability_id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 2,
                            width: '100%',
                          }}
                        >
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {DateTime.fromISO(availability.avail_slots).toLocaleString({
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </Typography>
                          <Chip
                            label={availability.is_booked ? 'Booked' : 'Available'}
                            color={availability.is_booked ? 'error' : 'success'}
                            size="small"
                            sx={{ marginLeft: 2 }}
                          />
                          <Box sx={{ display: 'flex', gap: 1, marginLeft: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditSlot(availability)}
                              disabled={availability.is_booked}
                              sx={{
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                borderRadius: '50px', // Rounded edges
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteSlot(availability.availability_id)}
                              disabled={availability.is_booked}
                              sx={{
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                borderRadius: '50px', // Rounded edges
                              }}
                            >
                              Delete Slot
                            </Button>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        No available time slots
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setDeleteServiceId(service.service_id);
                      setConfirmDeleteOpen(true);
                    }}
                    sx={{
                      width: '100%',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                    }}
                  >
                    Delete Service
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Edit Slot Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Slot</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DateTimePicker
                label="Available Slot"
                value={slotValue}
                minDateTime={DateTime.now()}
                onChange={(newValue) => setSlotValue(newValue)}
              />
            </LocalizationProvider>

            <TextField
              label="Max Hours"
              type="number"
              value={maxHrs}
              onChange={(e) => setMaxHrs(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveSlot} color="primary">Save</Button>
          <Button
            onClick={() => {
              handleDeleteSlot(currentAvailability.availability_id);
              handleClose();
            }}
            color="error"
          >
            Delete Slot
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting Service */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '300px',
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this service? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteService} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Snackbar */}
      {/* <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success">
          {toastMessage}
        </Alert>
      </Snackbar> */}

      {renderNoSlotsMessage()}
    </Box>
  );
};

export default Services;
