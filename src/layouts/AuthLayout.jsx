// src/layouts/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100%',
      position: 'relative' 
    }}>
      
      {/* Las figuras decorativas */}
      <div className="decorative-shape shape-1" />
      <div className="decorative-shape shape-2" />
      <div className="decorative-shape shape-3" />
      <div className="decorative-shape shape-4" />

      {/* Contenedor de la tarjeta blanca (Login/Register) */}
      <div style={{ 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '450px', // Tope de anchura para que no se estire feo
        padding: '20px' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;