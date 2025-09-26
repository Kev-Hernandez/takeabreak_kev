import { createTheme } from '@mui/material/styles';

export const neutralTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00F5D4', // Cian de acento
    },
    background: {
      default: '#0D1B2A', // Fondo principal
      paper: '#1B263B',   // Fondo para componentes
    },
    text: {
      primary: '#E0E1DD',   // Texto principal
      secondary: '#A9A9A9', // Texto secundario
    },
  },
  typography: {
    fontFamily: 'Manrope, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif' },
    h2: { fontFamily: 'Poppins, sans-serif' },
    h3: { fontFamily: 'Poppins, sans-serif' },
    h4: { fontFamily: 'Poppins, sans-serif' },
    h5: { fontFamily: 'Poppins, sans-serif' },
    h6: { fontFamily: 'Poppins, sans-serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});