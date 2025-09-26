import { createTheme } from '@mui/material/styles';

export const energeticTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F94144', // Un rojo vibrante y enérgico
    },
    background: {
      default: '#121212', // Un fondo casi negro para que el rojo resalte
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',   // Blanco puro para máximo contraste
      secondary: '#CACACA',
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