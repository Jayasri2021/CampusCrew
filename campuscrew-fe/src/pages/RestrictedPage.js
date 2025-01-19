import React from 'react';
import { Typography, Box } from '@mui/material';

const RestrictedPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Access Restricted
    </Typography>
    <Typography variant="body1">
      You don't have the permissions to access this page.
    </Typography>
  </Box>
);

export default RestrictedPage;
