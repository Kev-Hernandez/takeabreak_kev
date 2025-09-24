// src/components/layout/SideBar.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ onOpenProfile, onOpenActiveUsers, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <HomeIcon />, text: 'Inicio', action: () => navigate('/') },
    { icon: <AccountCircleIcon />, text: 'Perfil', action: onOpenProfile },
    { icon: <GroupIcon />, text: 'Usuarios activos', action: onOpenActiveUsers }
  ];

  return (
    <Box
      sx={{
        width: menuOpen ? 240 : 72,
        bgcolor: 'primary.dark',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'width 0.3s',
        height: '100vh', 
      }}
    >
      <IconButton onClick={() => setMenuOpen(!menuOpen)} sx={{ mb: 2, color: 'common.white', alignSelf: menuOpen ? 'flex-end' : 'center' }}>
        {menuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>
      
      {menuItems.map((item) => (
        <Button
          key={item.text}
          startIcon={item.icon}
          onClick={item.action}
          sx={{ 
            width: '100%', 
            justifyContent: menuOpen ? 'flex-start' : 'center', 
            color: 'common.white', 
            py: 1.5,
            px: 1
          }}
        >
          {menuOpen && <Typography variant="body2" sx={{ ml: 1, whiteSpace: 'nowrap' }}>{item.text}</Typography>}
        </Button>
      ))}

      {/* Espaciador que empuja el botón de logout hacia abajo */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Botón de Logout, ahora con el onClick corregido */}
      <Button
        startIcon={<LogoutIcon />}
        onClick={onLogout} // <-- ESTA ES LA LÍNEA QUE FALTABA
        sx={{
          width: '100%',
          justifyContent: menuOpen ? 'flex-start' : 'center',
          color: 'common.white',
          py: 1.5,
          px: 1,
          '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.2)' }
        }}
      >
        {menuOpen && <Typography variant="body2" sx={{ ml: 1 }}>Cerrar Sesión</Typography>}
      </Button>
    </Box>
  );
};

export default Sidebar;