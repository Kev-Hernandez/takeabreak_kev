import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import PaletteIcon from '@mui/icons-material/Palette'; // Icono para el selector de temas

// 1. Importamos AMBOS hooks de contexto
import { useThemeContext } from '../context/ThemeContext';
import { useDashboardContext } from '../context/DashboardContext';

// Importamos los componentes estilizados
import {
  SidebarContainer,
  MenuToggleButton,
  MenuItem,
  LogoutButton,
  MenuLabel,
  Spacer
} from './SideBar.styles';

const Sidebar = () => { // <-- Ya no necesita recibir props
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // 2. Usamos los contextos para obtener todo lo que necesitamos
  const { themeMode, setThemeMode } = useThemeContext();
  const { openProfile, toggleUsersDrawer, handleLogout } = useDashboardContext();

  // 3. Las acciones de los menú items ahora usan las funciones del contexto
  const menuItems = [
    { icon: <HomeIcon />, text: 'Inicio', action: () => navigate('/') },
    { icon: <AccountCircleIcon />, text: 'Perfil', action: openProfile },
    { icon: <GroupIcon />, text: 'Usuarios activos', action: toggleUsersDrawer }
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

      {/* --- SECCIÓN SELECTOR DE TEMAS --- */}
      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      {menuOpen && (
        <Typography variant="caption" sx={{ color: '#A9A9A9', px: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaletteIcon sx={{ fontSize: '1rem' }} /> Temas
        </Typography>
      )}
      <Box sx={{ width: '100%'}}>
        {themeOptions.map((theme) => (
          <MenuItem
            key={theme.mode}
            onClick={() => setThemeMode(theme.mode)}
            open={menuOpen}
            sx={{
              backgroundColor: themeMode === theme.mode ? 'rgba(0, 245, 212, 0.2)' : 'transparent',
              color: themeMode === theme.mode ? '#00F5D4' : '#A9A9A9',
              '&:hover': {
                backgroundColor: themeMode === theme.mode ? 'rgba(0, 245, 212, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            {menuOpen && <MenuLabel variant="body2">{theme.name}</MenuLabel>}
          </MenuItem>
        ))}
      </Box>
      {/* --- FIN DE LA SECCIÓN --- */}

      <Spacer />

      {/* 4. El botón de logout ahora usa 'handleLogout' del contexto */}
      <LogoutButton startIcon={<LogoutIcon />} onClick={handleLogout} open={menuOpen}>
        {menuOpen && <MenuLabel variant="body2">Cerrar Sesión</MenuLabel>}
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;