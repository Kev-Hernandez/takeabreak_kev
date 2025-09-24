// src/App.jsx

import { Routes, Route } from 'react-router-dom';

// 1. Importaciones actualizadas a los nuevos componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './middleware/ProtectedRoute';


function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Rutas Protegidas --- */}
      <Route element={<ProtectedRoute />}>
        {/* La única ruta protegida ahora es el Dashboard, que contiene todo lo demás */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      
      {/* Puedes agregar una ruta para páginas no encontradas si lo deseas */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;