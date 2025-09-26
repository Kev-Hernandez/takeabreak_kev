// fileName: src/layouts/SideBar.jsx (VERSIÓN FINAL CON SELECTOR DE TEMA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

// 1. Importamos el hook para acceder al contexto del tema
import { useThemeContext } from '../context/ThemeContext';

import {
  SidebarContainer,
  MenuToggleButton,
  MenuItem,
  LogoutButton,
  MenuLabel,
  Spacer
} from './SideBar.styles';

const Sidebar = ({ onOpenProfile, onOpenActiveUsers, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // 2. Usamos el contexto para obtener el tema actual y la función para cambiarlo
  const { themeMode, setThemeMode } = useThemeContext();

  const menuItems = [
    { icon: <HomeIcon />, text: 'Inicio', action: () => navigate('/') },
    { icon: <AccountCircleIcon />, text: 'Perfil', action: onOpenProfile },
    { icon: <GroupIcon />, text: 'Usuarios activos', action: onOpenActiveUsers }
  ];

  const themeOptions = [
    { name: 'Neutral', mode: 'neutral' },
    { name: 'Feliz', mode: 'happy' },
    { name: 'Triste', mode: 'sad' },
    { name: 'Energético', mode: 'energetic' },
    { name: 'Creativo', mode: 'creative' },
  ];

  return (
    <SidebarContainer open={menuOpen}>
      <MenuToggleButton onClick={() => setMenuOpen(!menuOpen)} open={menuOpen}>
        {menuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </MenuToggleButton>
      
      {menuItems.map((item) => (
        <MenuItem key={item.text} startIcon={item.icon} onClick={item.action} open={menuOpen}>
          {menuOpen && <MenuLabel variant="body2">{item.text}</MenuLabel>}
        </MenuItem>
      ))}

      {/* --- NUEVA SECCIÓN: SELECTOR DE TEMAS --- */}
      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      {menuOpen && <Typography variant="caption" sx={{ color: '#A9A9A9', px: 2, mb: 1 }}>Temas de Chat</Typography>}
      <Box sx={{ width: '100%'}}>
        {themeOptions.map((theme) => (
          <MenuItem
            key={theme.mode}
            // 3. El onClick llama a setThemeMode con el nombre del tema
            onClick={() => setThemeMode(theme.mode)}
            open={menuOpen}
            // Estilo para resaltar el tema activo
            sx={{
              backgroundColor: themeMode === theme.mode ? 'rgba(0, 245, 212, 0.2)' : 'transparent',
              color: themeMode === theme.mode ? '#00F5D4' : '#A9A9A9'
            }}
          >
            {menuOpen && <MenuLabel variant="body2">{theme.name}</MenuLabel>}
          </MenuItem>
        ))}
      </Box>
      {/* --- FIN DE LA NUEVA SECCIÓN --- */}

      <Spacer />

      <LogoutButton startIcon={<LogoutIcon />} onClick={onLogout} open={menuOpen}>
        {menuOpen && <MenuLabel variant="body2">Cerrar Sesión</MenuLabel>}
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;