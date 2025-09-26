// fileName: src/middleware/ProtectedRoute.jsx (VERSIÓN CORREGIDA)

import React from 'react';
import { Navigate } from 'react-router-dom';

// 1. Aceptamos 'children' como una prop.
// 'children' será el componente que envolvamos (en este caso, <DashboardLayout />)
const ProtectedRoute = ({ children }) => {
  console.log('2. Renderizando ProtectedRoute'); // Puedes dejar este log para confirmar
  
  const token = sessionStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al login.
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay token, simplemente renderiza el componente hijo.
  return children;
};

export default ProtectedRoute;