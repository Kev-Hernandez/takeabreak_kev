import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, IconButton, Typography, Box, Button } from '@mui/material';
import { Smartphone, Close, GetApp } from '@mui/icons-material';

// Importamos tus recursos
import muñequito from '../assets/muñequito.png'; 
import GlassCard from '../components/common/GlassCard'; 
import { APP_COLORS } from '../utils/constants';
import './home.css';

// ✅ IMPORTAMOS TU CÓDIGO QR LOCAL
import qrImage from '../assets/qr-apk.jpg'; 

export default function HomePage() {
  const navigate = useNavigate();
  const [openQr, setOpenQr] = useState(false); 

  return (
    <div className="home-container">
      
      {/* Botón Flotante App Móvil */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <Button 
          startIcon={<Smartphone />} 
          onClick={() => setOpenQr(true)}
          sx={{ 
            color: 'white', 
            bgcolor: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
          }}
        >
          App Móvil
        </Button>
      </Box>

      {/* Tarjeta Principal */}
      <div className="hero-card">
        <div className="left-content">
          <div className="title-wrapper">
            <h1 className="main-title">Take a Break</h1>
            <div className="sound-wave">
              <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
            </div>
          </div>

          <p className="subtitle">
            Tu momento para respirar, escuchar y avanzar hacia tu bienestar emocional.
          </p>
          
          <div className="buttons-container">
            <button className="login-button" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
            <button className="register-button" onClick={() => navigate('/register')}>
              Registrarse
            </button>
          </div>
        </div>

        <div className="right-content">
           <img src={muñequito} alt="Mascota escuchando música" className="character-image"/>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
        © 2025 Take a Break
      </div>

      {/* --- MODAL DEL CÓDIGO QR --- */}
      <Dialog 
        open={openQr} 
        onClose={() => setOpenQr(false)}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } }}
      >
        <GlassCard sx={{ 
          p: 4, alignItems: 'center', maxWidth: 350, textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.4)', position: 'relative'
        }}>
          <IconButton 
            onClick={() => setOpenQr(false)}
            sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            ¡Llévanos contigo!
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            Escanea el código para descargar la App en tu celular.
          </Typography>

          {/* Contenedor del QR */}
          <Box sx={{ 
            p: 2, bgcolor: 'white', borderRadius: '20px', 
            boxShadow: '0 0 20px rgba(255,255,255,0.3)', mb: 3
          }}>
            {/* ✅ USAMOS LA VARIABLE IMPORTADA */}
            <img 
              src={qrImage} 
              alt="QR Code" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </Box>

          <Button 
            variant="contained" 
            startIcon={<GetApp />}
            href="#" 
            sx={{ 
              bgcolor: APP_COLORS.secondary, color: '#000', fontWeight: 'bold',
              borderRadius: '50px', width: '100%'
            }}
          >
            Descarga Directa
          </Button>

        </GlassCard>
      </Dialog>
    </div>
  );
}