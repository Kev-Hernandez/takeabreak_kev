// src/layouts/SideBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Home, AccountCircle, Group, Logout, Menu, ChevronLeft, Palette } from '@mui/icons-material';
import GlassCard from '../components/common/GlassCard';
import { useThemeContext } from '../context/ThemeContext';
import { useDashboardContext } from '../context/DashboardContext';
import { APP_COLORS } from '../utils/constants';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setThemeMode } = useThemeContext();
  const { openProfile, toggleUsersDrawer, handleLogout } = useDashboardContext();

  const menuItems = [
    { icon: <Home />, text: 'Inicio', action: () => navigate('/') },
    { icon: <AccountCircle />, text: 'Perfil', action: openProfile },
    { icon: <Group />, text: 'Usuarios', action: toggleUsersDrawer },
  ];

  const themes = [
    { mode: 'neutral', color: '#fff' },
    { mode: 'happy', color: '#FFD700' },
    { mode: 'sad', color: '#87CEEB' },
    { mode: 'energetic', color: '#FF4500' },
  ];

  return (
    <GlassCard sx={{ 
      width: isOpen ? '240px' : '80px', 
      alignItems: 'center', 
      py: 3,
      zIndex: 10
    }}>
      {/* Toggle */}
      <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ color: 'white', mb: 4 }}>
        {isOpen ? <ChevronLeft /> : <Menu />}
      </IconButton>

      {/* Menú */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', px: 2 }}>
        {menuItems.map((item, idx) => (
          <Box 
            key={idx} 
            onClick={item.action}
            sx={{
              display: 'flex', alignItems: 'center', p: 1, borderRadius: '12px', cursor: 'pointer',
              justifyContent: isOpen ? 'flex-start' : 'center',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Box sx={{ color: 'white', display: 'flex' }}>{item.icon}</Box>
            {isOpen && <Typography sx={{ ml: 2, fontWeight: 600 }}>{item.text}</Typography>}
          </Box>
        ))}
      </Box>

      {/* Selector de Temas (Mini) */}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        
      </Box>

      {/* Logout */}
      <IconButton onClick={handleLogout} sx={{ mt: 3, color: '#ff6b6b' }}>
        <Logout />
      </IconButton>
    </GlassCard>
  );
};

export default Sidebar;