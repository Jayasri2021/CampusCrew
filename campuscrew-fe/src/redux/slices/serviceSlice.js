import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createService, getAllServices, bookService, fetchBookingsByUserId, editSlotAPI, deleteSlotAPI, deleteService,deleteBookingAPI } from '../../services/serviceService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

// Async thunk for creating a service
export const createServiceAsync = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await createService(serviceData);
      if (response?.status === 201) {
        return response.data; // Service created succesfetchBookingsByUserIdAsyncsfully
      } else {
        return rejectWithValue(response?.data?.error || 'Failed to create service');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching all services
export const fetchServicesAsync = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const services = await getAllServices();
      return services; // List of services
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching filtered services
export const fetchFilteredServicesAsync = createAsyncThunk(
  'services/fetchFilteredServices',
  async (categoryId, { rejectWithValue }) => {
    try {
      const services = await getAllServices(categoryId);
      return services; // Filtered list of services
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for booking a service
export const bookServiceAsync = createAsyncThunk(
  'services/bookService',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookService(bookingData);
      if (response?.status === 201) {
        return response.data; // Booking successful
        // Refresh the available slots after booking is successful
      } else {
        return rejectWithValue(response?.data?.error || 'Failed to book service');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching services by userId
export const fetchServicesbyUserId = createAsyncThunk(
  'services/fetchServicesbyUserId',
  async (userId) => {
    const response = await fetch(`https://campuscrewpfw.up.railway.app/api/fetchService?user_id=${userId}`);
    const data = await response.json();
    return data.services;
  }
);

// Async thunk for fetching bookings by user ID
export const fetchBookingsByUserIdAsync = createAsyncThunk(
  'service/fetchBookingsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const bookings = await fetchBookingsByUserId(userId);
      return bookings; // Successfully fetched bookings
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

//fetch booking details by booking ids
export const fetchBookingDetailsAsync = createAsyncThunk(
  'services/fetchBookingDetails',
  async (bookingId) => {
    const response = await fetch(`/api/bookings/${bookingId}`);
    const data = await response.json();
    return data;
  }
);

// Edit slot thunk (Redux Async Action)
export const editSlotAsync = createAsyncThunk(
  'services/editSlot', // Action type
  async (payload, { rejectWithValue }) => {
    try {
      // Here, we're passing the availability_id from the payload to the API
      const { availability_id, avail_slots, max_hrs } = payload;
      const formattedPayload = {
        avail_slots, // You can convert the date format if necessary, ensure it's consistent with what the API expects
        max_hrs, // Assuming max_hrs is a required field
      };
      
      const response = await editSlotAPI(availability_id, formattedPayload);
      return response; // On success, return the response data (e.g., success message)
    } catch (error) {
      console.error('Failed to edit slot:', error);
      return rejectWithValue(error?.message || 'Failed to edit slot');
    }
  }
);

// export const deleteSlotAsync = createAsyncThunk(
//   'services/deleteSlot',
//   async (availabilityId, { rejectWithValue }) => {
//     try {
//       const response = await delete(`/deleteService/${availabilityId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// Async thunk for deleting a service
export const deleteServiceAsync = createAsyncThunk(
  'services/deleteService',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await deleteService(serviceId);  // calling the deleteService function
      return response.data;  // Successfully deleted
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete service');
    }
  }
);


// Async thunk for deleting a slot
export const deleteSlotAsync = createAsyncThunk(
  'services/deleteSlot', // API for deleting a slot
  async (availabilityId, { rejectWithValue }) => {
    try {
      // Call the deleteSlotAPI with the correct availabilityId
      const response = await deleteSlotAPI(availabilityId);  
      // Pass availabilityId directly
      console.log("availabilityId in service slice", availabilityId);
      return response.data; // Successfully deleted
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete slot');
    }
  }
);


// Async thunk for deleting a booking
export const deleteBookingAsync = createAsyncThunk(
  'services/deleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await deleteBookingAPI(bookingId);
      return response.data; // Successfully deleted
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete booking');
    }
  }
);




// Service slice
const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    isLoading: false,
    error: null,
    bookingStatus: null,
    status: 'idle', // default status for services
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createServiceAsync
      .addCase(createServiceAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createServiceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.push(action.payload); // Add the newly created service
      })
      .addCase(createServiceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message
      })

      // Handle fetchServicesAsync
      .addCase(fetchServicesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload; // Update services with fetched data
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message
      })

      // Handle fetchFilteredServicesAsync
      .addCase(fetchFilteredServicesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilteredServicesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload; // Update services with filtered data
      })
      .addCase(fetchFilteredServicesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message
      })

      // Handle bookServiceAsync
      .addCase(bookServiceAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.bookingStatus = null;
      })
      .addCase(bookServiceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingStatus = 'success';
        // Refresh the available slots after booking is successful
        console.log("booking sucessful")
      })
      .addCase(bookServiceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.bookingStatus = 'failure';
        state.error = action.payload;
        console.log("error in booking")
        
      })

      // Handle fetchServicesbyUserId
      .addCase(fetchServicesbyUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServicesbyUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload;
      })
      .addCase(fetchServicesbyUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBookingsByUserIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchBookingsByUserIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.bookings = action.payload; // Update bookings with fetched data
      })
      .addCase(fetchBookingsByUserIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.payload; // Store error message
      })
      .addCase(fetchBookingDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingDetails = action.payload;
      })
      .addCase(fetchBookingDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(editSlotAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editSlotAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editSlotAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })  // Handle deleteServiceAsync
      .addCase(deleteServiceAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(service => service.id !== action.payload.id); // Remove deleted service
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle deleteSlotAsync
      .addCase(deleteSlotAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSlotAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle slot deletion (if you have a specific list for slots)
        state.error = null;
      })
      .addCase(deleteSlotAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle deleteBookingAsync
      .addCase(deleteBookingAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBookingAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted booking from the bookings list
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload.id);
      })
      .addCase(deleteBookingAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
