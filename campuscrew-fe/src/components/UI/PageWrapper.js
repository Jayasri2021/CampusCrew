import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import backgroundImage from '../../assets/mastodon-hero-background.jpg'; // Update with your actual image path

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize theme colors here
    },
  },
});

const PageWrapper = ({ children, isAuthPage }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: isAuthPage
            ? `url(${backgroundImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ py: 5 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PageWrapper;
