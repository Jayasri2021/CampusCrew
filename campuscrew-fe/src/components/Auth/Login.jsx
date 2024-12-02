import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice';
import PageWrapper from '../UI/PageWrapper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);


  const navigate = useNavigate();

  useEffect(() => {
    if ((user && user.id)) {
      navigate('/dashboard');
      console.log('hi i am login page ') // Redirect to dashboard if user is logged in

    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { email, password };
    console.log("Login Payload:", payload);
    dispatch(loginUser(payload));
  };

  const getErrorMessage = () => {
    if (error === 'User not found') {
      return 'Email not registered';
    }
    if (error === 'Invalid email or password') {
      return 'Wrong password';
    }
    return error || null;
  };

  const errorMessage = getErrorMessage();

  return (
    <PageWrapper isAuthPage={true}>
      <Box component="form" onSubmit={handleSubmit} className="auth-container" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Campus Crew
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          Login
        </Typography>

        <TextField
          data-test="login-email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          data-test="login-password"
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
          <Button data-test="login-button" variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        )}

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Don’t have an account? Sign Up
            </Typography>
          </Link>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Login;
