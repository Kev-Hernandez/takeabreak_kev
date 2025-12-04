// src/pages/LoginPage.jsx

import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import monitorange from '../assets/monitorange.png';
import LoginForm from '../features/authentication/components/LoginForm';
import AuthLayout from '../layouts/AuthLayout';

const LoginPage = () => {
  return (
    <AuthLayout>
      {/* Tarjeta de Cristal (Igual que el Home) */}
      <Paper 
        elevation={6} 
        sx={{
          p: { xs: 4, sm: 5 }, 
          borderRadius: '30px', // Bordes más redondos
          // EFECTO CRISTAL:
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%', 
          maxWidth: '450px',
          boxSizing: 'border-box'
        }}
      >
        {/* Imagen del Muñeco (Flotando un poco) */}
        <Box 
          component="img"
          src={monitorange} 
          alt="Muñeco-head" 
          sx={{ 
            width: '140px', 
            height: 'auto',
            mb: 2,
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
            // Pequeña animación de flotar para darle vida
            animation: 'float 4s ease-in-out infinite' 
          }}
        />
        
        {/* Títulos en Blanco */}
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          sx={{ 
            color: '#ffffff', 
            fontFamily: 'Fredoka, sans-serif', // Usando la fuente del home
            fontWeight: 'bold', 
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Take a Break
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center"
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            mb: 4,
            fontWeight: 'normal'
          }}
        >
          Bienvenido de nuevo
        </Typography>
        
        {/* Contenedor del formulario con la clase 'glass-form' para pintar los inputs de blanco */}
        <Box className="glass-form" sx={{ width: '100%' }}>
          <LoginForm />
          
          {/* Botones extra o links manuales si los tienes fuera del form */}
        </Box>

      </Paper>
      
      {/* Definimos la animación de flotar aquí mismo por si no está global */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </AuthLayout>
  );
};

export default LoginPage;