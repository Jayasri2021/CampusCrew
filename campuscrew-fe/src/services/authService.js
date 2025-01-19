import axios from "axios";

// Set up base API URL and headers
const API_URL = axios.create({
  baseURL: 'https://campuscrewpfw.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach user_id to requests if it exists in localStorage
API_URL.interceptors.request.use((config) => {
  const userId = localStorage.getItem('user_id'); // Change from token to user_id
  if (userId) {
    config.headers.Authorization = `Bearer ${userId}`; // Use user_id instead of token
  }
  return config;
}, (error) => Promise.reject(error));

// Login function
export const login = async (userData) => {
  try {
    // console.log("login",userData)
    const response = await API_URL.post('/login', userData);
    console.log("login daata",response);

    return response.data; // Return the entire response for additional data (user_id and message)
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Sign-up function
export const signUp = async (userData) => {
  try {
    const response = await API_URL.post('/createUser', userData);
    console.log("signup daata",response);
    return response.data; // Return the entire response for additional data (user_id and message)
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
    throw { message };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('is_pfw'); // Clear the user_id from localStorage instead of token
};
