import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Revisa si el token existe en el almacenamiento local
  const token = sessionStorage.getItem('token');

  // 2. Si NO hay token, redirige al usuario a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 3. Si SÍ hay token, permite que se muestre la página solicitada
  // El componente <Outlet /> renderiza el componente hijo (ej. <Dashboard />)
  return <Outlet />;
};

export default ProtectedRoute;