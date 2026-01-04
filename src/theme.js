import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light Mode - Less Blinding
          primary: { main: '#0957d0' },
          secondary: { main: '#c1e7ff' },
          background: { 
            default: '#f0f4f8', // Soft Blue-Grey (Easier on eyes)
            paper: '#ffffff',   // Cards stay white
          },
          text: { primary: '#1f1f1f', secondary: '#444746' },
          divider: '#e0e2e7',
        }
      : {
          // Dark Mode - Pixel/Nest Theme
          primary: { main: '#a8c7fa' },
          secondary: { main: '#004a77' },
          background: { 
            default: '#1b1b1b', // Main Dashboard BG
            paper: '#131314',   // Standard Card BG
          },
          text: { primary: '#e3e3e3', secondary: '#c4c7c5' },
          divider: '#444746',
        }),
  },
  shape: { borderRadius: 28 },
  typography: {
    fontFamily: '"Google Sans", "Roboto", sans-serif',
    h1: { fontWeight: 400 },
    h2: { fontWeight: 400 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: mode === 'dark' ? '1px solid #38393b' : '1px solid #dcdcdc',
        },
      },
    },
    MuiIcon: {
      defaultProps: { baseClassName: 'material-symbols-rounded' },
    },
  },
});