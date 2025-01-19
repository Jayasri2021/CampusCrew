import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6457a6', // Ultra Violet
      light: '#9dacff', // Vista Blue
      dark: '#5c2751', // Violet (JTC)
    },
    secondary: {
      main: '#4bc0d9', // Aero
      light: '#76e5fc', // Non Photo Blue
    },
    background: {
      default: '#f8f8fb', // Soft muted background
      paper: '#ffffff', // White for components
    },
    text: {
      primary: '#403D50', // Neutral dark for light backgrounds
      secondary: '#6457a6', // Accent violet
      contrastText: '#ffffff', // White text for dark backgrounds
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded edges for list items
          transition: 'all 0.3s ease', // Smooth hover effect
          '&.Mui-selected': {
            backgroundColor: '#6457a6', // Primary color for selected
            color: '#ffffff', // White text
            '&:hover': {
              backgroundColor: '#5c2751', // Slightly darker on hover
            },
          },
        },
      },
    },
  },
});

export default theme;
