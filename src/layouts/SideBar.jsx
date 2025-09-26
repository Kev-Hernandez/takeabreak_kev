// fileName: src/layouts/SideBar.jsx (VERSIÓN CON STYLED COMPONENTS)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

// 1. Importamos nuestros nuevos componentes estilizados
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

  const menuItems = [
    { icon: <HomeIcon />, text: 'Inicio', action: () => navigate('/') },
    { icon: <AccountCircleIcon />, text: 'Perfil', action: onOpenProfile },
    { icon: <GroupIcon />, text: 'Usuarios activos', action: onOpenActiveUsers }
  ];

  // 2. Usamos los componentes estilizados en el JSX
  return (
    <SidebarContainer open={menuOpen}>
      <MenuToggleButton onClick={() => setMenuOpen(!menuOpen)} open={menuOpen}>
        {menuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </MenuToggleButton>
      
      {menuItems.map((item) => (
        <MenuItem
          key={item.text}
          startIcon={item.icon}
          onClick={item.action}
          open={menuOpen}
        >
          {menuOpen && <MenuLabel variant="body2">{item.text}</MenuLabel>}
        </MenuItem>
      ))}

      <Spacer />

      <LogoutButton
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        open={menuOpen}
      >
        {menuOpen && <MenuLabel variant="body2">Cerrar Sesión</MenuLabel>}
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;