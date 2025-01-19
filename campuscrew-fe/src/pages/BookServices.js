import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Tooltip,  Slide,

} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredServicesAsync, bookServiceAsync,fetchServicesAsync  } from '../redux/slices/serviceSlice';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';




const categories = [
  { id: null, name: 'All' },
  { id: 1, name: 'Photography' },
  { id: 2, name: 'Catering' },
  { id: 3, name: 'Carpooling' },
  { id: 4, name: 'Plumbing' },
  { id: 5, name: 'Gardening' },
  { id: 6, name: 'Babysitting' },
  { id: 7, name: 'Haircut and Makeup' },
  { id: 8, name: 'Academics' },


];

const Booking = () => {
  const dispatch = useDispatch();
  const { services, isLoading, error } = useSelector((state) => state.services);
  const [selectedService, setSelectedService] = useState(null);
  const [open, setOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingId, setBookingId] = useState(null); // To store the booking ID for the success message
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // State for success dialog



  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();  // Hook for navigation



  useEffect(() => {
    dispatch(fetchFilteredServicesAsync(categoryFilter));
  }, [dispatch, categoryFilter]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
    setSelectedSlot(null);
    setBookingStatus(null);
  };

  const handleCategoryClick = (categoryId) => {
    setCategoryFilter(categoryId);
  };
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot); // Slot now includes availability_id
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    setTimeout(() => {
      // Reset any other states or logic needed to unlock the page
    }, 1000);  // You can tweak the timeout value if necessary
    setBookingId(null); // Reset booking ID if necessary

  };
  

  const handleBookNow = async () => {
    if (!selectedSlot) {
      setBookingStatus({ success: false, message: 'Please select a slot before booking.' });
      return;
    }
    
    const payload = {
      service_id: selectedService.service_id,
      user_id: user.id, // Replace with actual logged-in user ID
      availability_id: selectedSlot.availability_id, // Include the availability ID
    };
  
    console.log('Booking payload:', payload);
  
    const response = await dispatch(bookServiceAsync(payload));
    if (response?.error) {
      setBookingStatus({ success: false, message: 'Booking failed. Try again later.' });
      toast.error('Booking failed. Please try again.', {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    } else {
      setBookingStatus({ success: true, message: 'Booking successful!' });
      toast.success('Booking successful!', {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      console.log('Booking details',response.payload?.booking.booking_id)
      const bookingId = response.payload?.booking.booking_id; // Assuming booking_id is in the response

      setBookingId(bookingId); // Save booking ID
      setOpenSuccessDialog(true); // Open the success dialog


      setTimeout(() => {
        // Refresh services after 3 seconds
        dispatch(fetchServicesAsync());
        // Pass the booking ID to the confirmation page
      //   navigate(`/booking-confirmation/${bookingId}`, {
      //     state: { bookingId },
      // }); // Navigate to confirmation page
      // navigate('/yourbookings')
      }, 500); // 3 seconds delay
      setOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Choose your required service!
      </Typography>

      {/* Filter Buttons */}
      <Box sx={{ marginBottom: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={category.id === categoryFilter ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {services.length > 0 ? (
      <Grid container spacing={2}>
  {services.map((service) => (
    <Grid item xs={12} sm={6} md={4} key={service.service_id}>
      <Card
        sx={{
          height: '100%',
          padding: 2,
          boxShadow: 3,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
            <Typography variant="h6" gutterBottom>
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {service.description}
            </Typography>
            <Typography variant="subtitle1" color="primary" sx={{ marginTop: 1 }}>
              ${service.rate}/hr
            </Typography>
            <Button
              data-test="book-service-button"
              variant="contained"
              size="small"
              sx={{ marginTop: 2 }}
              onClick={() => handleServiceClick(service)}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
) : (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
  <Typography variant="h4" sx={{ textAlign: 'center' }}>
    No services available currently, Sorry!!
  </Typography>
</Box>
      )}
    

      {selectedService && (
  <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        boxShadow: 10,
        borderRadius: 4,
        overflow: 'hidden',
      },
    }}
    BackdropProps={{
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for the modal backdrop
      },
    }}
  >
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      dynamicHeight
      style={{ marginBottom: '16px' }}
    >
      {selectedService.serviceimages?.map((image, index) => (
        <div key={index}>
          <img
            src={image.image_url || 'https://placehold.co/600x400'} // Fallback to placeholder if no image
            alt={`Service Slide ${index + 1}`}
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      ))}
    </Carousel>

    <DialogTitle
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        fontSize: '1.8rem',
        fontWeight: 'bold',
      }}
    >
      {selectedService.name}
    </DialogTitle>
    <DialogContent
      sx={{
        padding: 3,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' },
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          {selectedService.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <strong>Rate:</strong> ${selectedService.rate}/hr
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Available Slots
        </Typography>
        <Box
        
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            paddingLeft: 1,
          }}
        >
          {selectedService.serviceavailability?.map((slot, index) => (
            <Tooltip
              key={index}
              title={slot.is_booked ? 'Booking not available' : ''}
            >
              <span>
                <Button
                data-test="book-service-slot-select"
                  variant="outlined"
                  onClick={() => handleSlotClick(slot)}
                  disabled={slot.is_booked}
                  sx={{
                    backgroundColor: selectedSlot === slot
                      ? 'rgba(76, 175, 80, 1)' // Full green for selected
                      : 'white', // White background for unselected
                    color: selectedSlot === slot
                      ? 'white' // White text for selected button
                      : 'black', // Black text for unselected button
                    textDecoration: slot.is_booked ? 'line-through' : 'none',
                    '&:hover': {
                      backgroundColor: selectedSlot === slot
                        ? 'rgba(76, 175, 80, 1)' // Keep full green for selected on hover
                        : 'rgba(0, 0, 0, 0.04)', // Light gray hover for unselected
                    },
                  }}
                >
                  {new Date(slot.avail_slots).toLocaleDateString('en-GB', {
                    weekday: 'short',  // E.g., "Fri"
                    day: 'numeric',    // E.g., "23"
                    month: 'short',    // E.g., "Dec"
                    year: 'numeric',   // E.g., "2024"
                  })} {new Date(slot.avail_slots).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Button>
              </span>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </DialogContent>
    <DialogActions sx={{ padding: 3 }}>
      <Button onClick={handleClose} color="primary" variant="outlined" sx={{ borderRadius: 2 }}>
        Close
      </Button>
      <Button
      data-test="book-service-confirm-button"
        onClick={handleBookNow}
        color="secondary"
        variant="contained"
        sx={{ borderRadius: 2 }}
      >
        Book Now
      </Button>
    </DialogActions>
  </Dialog>
)}

<Dialog
  open={openSuccessDialog && bookingId}  // Open only if there's a valid bookingId
  onClose={Boolean(handleCloseSuccessDialog)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      boxShadow: 10,
      borderRadius: 4,
      overflow: 'hidden',
    },
  }}
  BackdropProps={{
    invisible: false, // Ensures backdrop is visible
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for the success dialog backdrop
    },
  }}
>
  <DialogTitle>Booking Successful</DialogTitle>
  <DialogContent>
    <Typography variant="h6" color="primary">
      Thank you for booking with us {user.firstName}!
    </Typography>
    <Typography variant="body1" sx={{ marginTop: 2 }}>
      Your booking ID is: <strong>{bookingId}</strong>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button data-test="book-service-confirm-close-button" onClick={handleCloseSuccessDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
      <ToastContainer />

    </Box>
  );
};

export default Booking;
