// 📁 Archivo: src/index.js (VERSIÓN CORREGIDA)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1. Importa todos tus proveedores de contexto
import { ThemeProvider } from './context/ThemeContext'; 
import { AuthProvider } from './context/AuthContext.jsx';

import App from './App.jsx';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);