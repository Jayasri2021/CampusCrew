import axios from 'axios';

// Base API configuration
const API_URL = axios.create({
  baseURL: 'https://campuscrewpfw.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// API for creating a service
export const createService = async (serviceData) => {
  try {
    const response = await API_URL.post('/createService', serviceData);
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to create service';
    throw { message, status: error.response?.status || 500 };
  }
};



// API for fetching all services with optional category filter
export const getAllServices = async (categoryId = null) => {
  try {
    const endpoint = categoryId ? `/fetchService?category_id=${categoryId}` : '/fetchService';
    const response = await API_URL.get(endpoint);
    return response.data.services;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch services';
    throw { message, status: error.response?.status || 500 };
  }
};

// API for booking a service
export const bookService = async (bookingData) => {
  try {
    const response = await API_URL.post('/createBooking', bookingData);
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to book service';
    throw { message, status: error.response?.status || 500 };
  }
};


// API for fetching bookings by user ID
export const fetchBookingsByUserId = async (userId) => {
  try {
    const response = await API_URL.get(`/bookings/${userId}`);
    return response.data.bookings; // Extract and return the bookings
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch bookings';
    throw { message, status: error.response?.status || 500 };
  }
};

// API for editing a service
export const editService = async (serviceId, updatedServiceData) => {
  try {
    const response = await API_URL.put(`/editService/${serviceId}`, updatedServiceData);
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to edit service';
    throw { message, status: error.response?.status || 500 };
  }
};

// Fetch services by user ID
export const fetchServicesByUserIdAPI = async (userId) => {
  const response = await API_URL.get(`/fetchService?user_id=${userId}`);
  return response.data;
};

// Edit slot API
export const editSlotAPI = async (availabilityId, payload) => {
  try {
    console.log('Edit Slot Payload:', availabilityId, payload);
    const response = await API_URL.put(`/editSlot/${availabilityId}`, payload);
    return response.data; // Ensure we return the response data for further handling in the async flow
  } catch (error) {
    console.error('Error in editing slot:', error);
    throw error; // Pass the error through to be handled by the calling code
  }
};


// API for deleting a service
export const deleteService = async (serviceId) => {
  try {
    // Ensure serviceId is a string, not an object
    const idToDelete = serviceId?.serviceId || serviceId;  // If serviceId is an object, it tries to extract the actual ID

    const link = `/deleteService/${idToDelete}`;
    console.log("API request URL: ", link);  // Log the constructed URL for debugging

    const response = await API_URL.delete(link);
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to delete service';
    throw { message, status: error.response?.status || 500 };
  }
};


// API for deleting a slot
export const deleteSlotAPI = async (availabilityId) => {
  try {
    console.log("availabilityId in deleteSlotAPI", availabilityId);  // Directly log the availabilityId
    const link = `/deleteSlotTiming/${availabilityId}`;  // Directly use the availabilityId in the URL
    console.log("API request URL: ", link);  // Log the constructed URL

    const response = await API_URL.delete(link);  // Use the link variable in the API call
    console.log("Delete slot response:", response);  // Log the response
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to delete slot';
    throw { message, status: error.response?.status || 500 };
  }
};


// API for deleting a booking
export const deleteBookingAPI = async (bookingId) => {
  try {
    const response = await API_URL.delete(`/deleteBooking/${bookingId}`);
    return { status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Failed to delete booking';
    throw { message, status: error.response?.status || 500 };
  }
};

