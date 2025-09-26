import { createTheme } from '@mui/material/styles';

export const happyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Un dorado cálido para el acento
    },
    background: {
      default: '#1a1a2e', // Un fondo ligeramente más cálido
      paper: '#16213e',
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#B0B0B0',
    },
  },
  typography: { // Mantenemos la misma tipografía para consistencia
    fontFamily: 'Manrope, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif' },
    h2: { fontFamily: 'Poppins, sans-serif' },
    h3: { fontFamily: 'Poppins, sans-serif' },
    h4: { fontFamily: 'Poppins, sans-serif' },
    h5: { fontFamily: 'Poppins, sans-serif' },
    h6: { fontFamily: 'Poppins, sans-serif' },
  },
  components: { // Mantenemos los mismos overrides de componentes
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