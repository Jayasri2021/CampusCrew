import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authSlice';
import PageWrapper from '../UI/PageWrapper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './SignUp.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPfw, setIsPfw] = useState("false");

  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is logged in (if user exists in the state)
    if ((user && user.id)) {
      navigate('/login');
      console.log('Redirecting to dashboard cuz its logged in ') // Redirect to dashboard if user is logged in
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for valid PFW email
    if (isPfw === "true" && !email.endsWith('@pfw.edu')) {
      toast.error('Please use a valid PFW email.', { autoClose: 3000 });
      return;
    }

    const payload = { firstName, lastName, email, password, isPfw: isPfw === "true" };
    dispatch(registerUser(payload));
  };

  useEffect(() => {
    // After successful registration, navigate to the dashboard
    if (!isLoading && !error && (user && user.id)
    ) {
      navigate('/login'); // Redirect to dashboard
      console.log('Redirecting to dashboard cuz sucessfull ', localStorage.getItem('user_id')) // Redirect to dashboard if user is logged in

    }
  }, [isLoading, error, user, navigate]);

  return (
    <PageWrapper isAuthPage={true}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Box component="form" onSubmit={handleSubmit} className="auth-container">
        <Typography variant="h3" component="h1" className="sign-up-header">
          Campus Crew
        </Typography>

        <Typography variant="h4" component="h2" className="sign-up-header">
          Sign Up
        </Typography>

        <TextField
          data-test="signup-fname"
          label="First Name"
          variant="outlined"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          data-test="signup-lname"
          label="Last Name"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <Typography variant="subtitle1" gutterBottom className="toggle-group-label">
          Are you a PFW Student?
        </Typography>
        <ToggleButtonGroup
          data-test="signup-isPfw"
          value={isPfw}
          exclusive
          onChange={(e, value) => setIsPfw(value || "false")}
          className="toggle-group"
        >
          <ToggleButton value="true" className="toggle-button">Yes</ToggleButton>
          <ToggleButton value="false" className="toggle-button">No</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          data-test="signup-email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          data-test="signup-password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button data-test="signup-button" variant="contained" color="primary" type="submit" className="sign-up-button">
            Sign Up
          </Button>
        )}

        {error === "Email is already in use" && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            *User already exists*
          </Typography>
        )}

        <Box className="link">
          <Link to="/login" className="link-text">
            <Typography variant="body2" color="primary">
              Already have an account? Login
            </Typography>
          </Link>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default SignUp;
