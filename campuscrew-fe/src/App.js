import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import SignUp from './components/Auth/SignUp';
import theme from './theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import HeroSection from './components/UI/HeroSection';
import Dashboard from './pages/Dashboard';
import RestrictedPage from './pages/RestrictedPage';
import YourServices from './pages/YourServices';
import YourBookings from './pages/YourBookings';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/restrictedPage" element={<RestrictedPage />} />
        <Route path="/yourservices" element={<YourServices/>} />
        <Route path="/yourbookings" element={<YourBookings/>} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landingPage"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default App;
