// src/pages/RegisterPage.jsx

import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import RegisterForm from '../features/authentication/components/RegisterForm';
import AuthLayout from '../layouts/AuthLayout';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <Paper 
        elevation={6} 
        sx={{
          // Espaciado interno
          p: { xs: 4, sm: 5 }, 
          borderRadius: '30px',
          
          // --- ESTILOS CRISTAL (Glassmorphism) ---
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // Transparente
          backdropFilter: 'blur(12px)', // Borroso detrás
          border: '1px solid rgba(255, 255, 255, 0.3)', // Borde brillante
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          
          // Layout flexible
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%', 
          maxWidth: '550px', // Un poco más ancho que el login para que quepan los datos
          boxSizing: 'border-box'
        }}
      >
        {/* Título Principal */}
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            color: '#ffffff', 
            fontFamily: 'Fredoka, sans-serif', 
            fontWeight: 'bold', 
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Take a Break
        </Typography>
        
        {/* Subtítulo */}
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            mb: 3,
            fontWeight: 'normal'
          }}
        >
          Crea tu cuenta para empezar
        </Typography>

        {/* IMPORTANTE: Envolvemos el formulario con la clase "glass-form".
           Esto activará los estilos blancos para los inputs que pusimos en index.css 
        */}
        <Box className="glass-form" sx={{ width: '100%' }}>
          <RegisterForm />
        </Box>

      </Paper>
    </AuthLayout>
  );
};

export default RegisterPage;