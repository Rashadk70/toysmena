import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#57B9FF',
      light: '#85CCFF',
      dark: '#3D81B2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#424242',
      light: '#6D6D6D',
      dark: '#1B1B1B',
      contrastText: '#fff',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#424242',
        },
      },
    },
  },
});

export default theme;
