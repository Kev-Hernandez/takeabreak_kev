import { createTheme } from '@mui/material/styles';

export const sadTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5A9BD5', // Un azul suave y desaturado como acento
    },
    background: {
      default: '#2C3E50', // Un fondo de "niebla" azul-gris
      paper: '#34495E',   // Un poco más claro para los contenedores
    },
    text: {
      primary: '#BDC3C7',   // Un gris muy claro, casi blanco
      secondary: '#95A5A6', // Un gris más suave
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
  components: { // Mantenemos los mismos overrides
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