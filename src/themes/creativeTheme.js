import { createTheme } from '@mui/material/styles';

export const creativeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F72585', // Un magenta o rosa neón muy llamativo
    },
    background: {
      default: '#240046', // Un morado muy profundo
      paper: '#3c096c',   // Un morado más claro para los contenedores
    },
    text: {
      primary: '#E9D8FD',   // Un lavanda muy claro como texto principal
      secondary: '#BE92F3',
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