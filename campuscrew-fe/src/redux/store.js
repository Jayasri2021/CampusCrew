import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
  },
});

export default store;
