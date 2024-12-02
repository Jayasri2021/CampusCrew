import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'url(https://www.pfw.edu/sites/default/files/styles/featured/public/images/mastodon-hero-background.jpg?itok=gZVMwR8a)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: 4,
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))',
            zIndex: 1,
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 2 }}>
          {/* PFW Logo */}
          <Box
            component="img"
            src="https://i.ebayimg.com/images/g/u1kAAOSwn5pgPusY/s-l1200.jpg"
            alt="Purdue Fort Wayne Logo"
            sx={{ height: 80, mb: 4 }}
          />

          {/* CampusCrew Branding */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              letterSpacing: 2,
              mb: 2,
              animation: 'fadeIn 2s',
            }}
          >
            Welcome to CampusCrew
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              mb: 4,
              animation: 'fadeIn 2s',
              animationDelay: '0.5s',
            }}
          >
            Connecting PFW Students and the Community for Affordable Services!
          </Typography>

          {/* Call-to-Actions */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, borderRadius: 3, fontSize: '1rem' }}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item>
              <ScrollLink to="info-section" smooth duration={500}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1rem',
                    color: 'white',
                    borderColor: 'white',
                  }}
                >
                  Explore More
                </Button>
              </ScrollLink>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Info Section */}
      <Box
        id="info-section"
        sx={{
          py: 8,
          px: 4,
          backgroundColor: '#f4f4f4',
          animation: 'fadeInUp 2s',
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}
          >
            Why Choose CampusCrew?
          </Typography>
          <Grid container spacing={4}>
            {/* For PFW Students */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  For PFW Students
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  - Provide services and earn while studying.
                  <br />- Build your professional network.
                  <br />- Gain hands-on experience.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/signup')}
                >
                  Start Offering Services
                </Button>
              </Box>
            </Grid>

            {/* For Non-PFW Users */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  For Non-PFW Users
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  - Access affordable services.
                  <br />- Support local students.
                  <br />- Get high-quality, personalized service.
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/signup')}
                >
                  Avail Services
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
