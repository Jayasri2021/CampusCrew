import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signUp, logout } from '../../services/authService';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await login(userData);
      return { 
        userId: response.user_id, 
        firstName: response.first_name,
        isPfw: response.is_pfw,
        message: response.message
      };
    } catch (error) {
      return rejectWithValue(error.error || 'Login failed');
    }
  }
);

// Async thunk for sign-up
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signUp(userData);
      return {   userId: response.user_id, 
        firstName: response.first_name,
        isPfw: response.isPfw,
        message: response.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: {
      id: localStorage.getItem('user_id') || null,
      firstName: localStorage.getItem('first_name') || null,
      isPfw: localStorage.getItem('is_pfw') === 'true' || false,
    },
    isLoading: false, 
    error: null 
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user_id');
      localStorage.removeItem('first_name');
      localStorage.removeItem('is_pfw');
      logout(); // Call logout service to clean up session
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { 
          id: action.payload.userId, 
          firstName: action.payload.firstName, 
          isPfw: action.payload.isPfw 
        };
        localStorage.setItem('user_id', action.payload.userId);
        localStorage.setItem('first_name', action.payload.firstName);
        localStorage.setItem('is_pfw', action.payload.isPfw);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Error during login:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { 
          id: action.payload.userId, 
          firstName: action.payload.firstName, 
          isPfw: action.payload.isPfw 
        };
        // Update localStorage with the latest values
        localStorage.setItem('user_id', action.payload.userId);
        localStorage.setItem('first_name', action.payload.firstName);
        localStorage.setItem('is_pfw', action.payload.isPfw);
      
        console.log("Registered user data:", state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("Error during register:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
