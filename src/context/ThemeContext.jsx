import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Importamos todas las "paletas de pintura" que creaste
import { neutralTheme } from '../themes/neutralTheme';
import { happyTheme } from '../themes/happyTheme';
import { sadTheme } from '../themes/sadTheme';
import { energeticTheme } from '../themes/energeticTheme';
import { creativeTheme } from '../themes/creativeTheme';

// 1. Creamos el contexto que guardará el estado y las funciones
const ThemeContext = createContext();

// 2. Creamos un hook personalizado para que los componentes accedan fácilmente al contexto
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// 3. Creamos nuestro propio ThemeProvider, que será el "maestro pintor"
export const ThemeProvider = ({ children }) => {
  // Estado para saber qué tema está activo. Por defecto, 'neutral'.
  const [themeMode, setThemeMode] = useState('neutral');

  // useMemo es una optimización. Solo recalcula el tema si 'themeMode' cambia.
  const activeTheme = useMemo(() => {
    console.log(`Cambiando tema a: ${themeMode}`); // Log para depurar
    switch (themeMode) {
      case 'happy':
        return happyTheme;
      case 'sad':
        return sadTheme;
      case 'energetic':
        return energeticTheme;
      case 'creative':
        return creativeTheme;
      default:
        return neutralTheme;
    }
  }, [themeMode]);

  // El valor que compartiremos con toda la aplicación
  const value = {
    themeMode,
    setThemeMode, // La función para cambiar el tema
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* Este es el ThemeProvider de Material-UI. 
        Le pasamos el tema que hemos seleccionado dinámicamente.
      */}
      <MuiThemeProvider theme={activeTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};