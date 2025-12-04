// src/layouts/SideBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Typography, Dialog, Button, Avatar } from '@mui/material';
import { AccountCircle, Group, Logout, Menu, ChevronLeft, Smartphone, Close, GetApp, AutoAwesome } from '@mui/icons-material';

import GlassCard from '../components/common/GlassCard';
import { useThemeContext } from '../context/ThemeContext';
import { useDashboardContext } from '../context/DashboardContext';
import { APP_COLORS, THEME_COLORS } from '../utils/constants';

// ✅ CAMBIO: Importamos la imagen local
import qrImage from '../assets/qr-apk.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  
  const navigate = useNavigate();
  // Leemos el tema actual (que viene del chat)
  const { themeMode } = useThemeContext(); 
  const { openProfile, toggleUsersDrawer, handleLogout } = useDashboardContext();

  // Menú SIN el botón de Inicio
  const menuItems = [
    { icon: <AccountCircle />, text: 'Perfil', action: openProfile },
    { icon: <Group />, text: 'Usuarios', action: toggleUsersDrawer },
    { icon: <Smartphone />, text: 'App Móvil', action: () => setOpenQr(true) },
  ];

  // Obtenemos el color actual basado en el modo
  const currentVibeColor = THEME_COLORS[themeMode] || THEME_COLORS['default'];
  const vibeName = themeMode === 'default' || themeMode === 'neutral' ? 'Neutral' : themeMode.charAt(0).toUpperCase() + themeMode.slice(1);

  return (
    <>
      <GlassCard sx={{ 
        width: isOpen ? '240px' : '80px', 
        alignItems: 'center', 
        py: 3,
        zIndex: 10,
        justifyContent: 'space-between',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        
        {/* PARTE SUPERIOR */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ color: 'white', mb: 4 }}>
            {isOpen ? <ChevronLeft /> : <Menu />}
          </IconButton>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', px: 2 }}>
            {menuItems.map((item, idx) => (
              <Tooltip key={idx} title={isOpen ? '' : item.text} placement="right">
                <Box 
                  onClick={item.action}
                  sx={{
                    display: 'flex', alignItems: 'center', p: 1.5, borderRadius: '15px', cursor: 'pointer',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'translateX(5px)' },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box sx={{ color: 'white', display: 'flex' }}>{item.icon}</Box>
                  {isOpen && <Typography sx={{ ml: 2, fontWeight: 600, color: 'white' }}>{item.text}</Typography>}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* PARTE INFERIOR: VIBE MONITOR + LOGOUT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: '100%' }}>
          
          {/* MONITOR DE VIBE */}
          <Tooltip title={`Vibe Actual: ${vibeName}`} placement="right">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 1,
              p: 1,
              borderRadius: '20px',
              bgcolor: 'rgba(255,255,255,0.05)',
              border: `1px solid ${APP_COLORS.glassBorder}`,
              width: isOpen ? '80%' : 'auto',
              transition: 'all 0.3s'
            }}>
              {/* Círculo que cambia de color */}
              <Box sx={{ 
                width: 24, height: 24, borderRadius: '50%', 
                background: currentVibeColor,
                boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                animation: 'pulse 2s infinite'
              }} />
              
              {isOpen && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.65rem' }}>
                    TU ESTADO DE ANIMO ES:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                    <AutoAwesome sx={{ fontSize: 12, color: APP_COLORS.secondary }} /> 
                    {vibeName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          <IconButton onClick={handleLogout} sx={{ color: '#ff6b6b', bgcolor: 'rgba(255,0,0,0.1)', '&:hover': { bgcolor: 'rgba(255,0,0,0.2)' } }}>
            <Logout />
          </IconButton>
        </Box>
      </GlassCard>

      {/* Definimos la animación de pulso para el indicador */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>

      {/* MODAL QR (Con imagen local) */}
      <Dialog open={openQr} onClose={() => setOpenQr(false)} PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}>
        <GlassCard sx={{ p: 4, alignItems: 'center', maxWidth: 350, textAlign: 'center', border: `1px solid ${APP_COLORS.glassBorder}`, position: 'relative' }}>
          <IconButton onClick={() => setOpenQr(false)} sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.6)' }}><Close /></IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>Llévanos contigo</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>Escanea para descargar la App.</Typography>
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '20px', boxShadow: '0 0 20px rgba(255,255,255,0.3)', mb: 3 }}>
            {/* ✅ CAMBIO AQUÍ: Usamos qrImage */}
            <img src={qrImage} alt="QR Code" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
          <Button variant="contained" startIcon={<GetApp />} href="#" sx={{ bgcolor: APP_COLORS.secondary, color: '#000', fontWeight: 'bold', borderRadius: '50px', width: '100%', '&:hover': { bgcolor: '#00dbbe' } }}>Descarga Directa</Button>
        </GlassCard>
      </Dialog>
    </>
  );
};

export default Sidebar;