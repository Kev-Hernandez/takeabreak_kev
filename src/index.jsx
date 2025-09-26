import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom' ;
import App from './App.jsx';

// 1. Importa tu nuevo ThemeProvider desde la carpeta de contextos
import { ThemeProvider } from './context/ThemeContext'; 

// Importa tus estilos globales al final para que puedan sobreescribir otros estilos si es necesario
import './styles/global.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    {/* 2. Envuelve toda la aplicación con tu ThemeProvider.
        Este componente ahora contiene tanto la lógica del tema como el
        ThemeProvider de Material-UI adentro. */}
    <ThemeProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);