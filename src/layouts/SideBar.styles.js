import { styled } from '@mui/material/styles';
import { Box, IconButton, Button, Typography } from '@mui/material';

// --- Contenedor Principal ---

// Creamos un prop 'open' personalizado para que el componente sepa si está abierto o cerrado
export const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? 240 : 72, // Ancho condicional
  backgroundColor: '#1B263B', // Color de fondo secundario
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición suave
  height: '100vh',
  boxShadow: '4px 0px 15px rgba(0,0,0,0.2)',
}));

// --- Botones y Elementos ---

export const MenuToggleButton = styled(IconButton)(({ theme, open }) => ({
  marginBottom: theme.spacing(2),
  color: '#E0E1DD',
  alignSelf: open ? 'flex-end' : 'center',
  transition: 'transform 0.3s',
  '&:hover': {
    color: '#00F5D4', // Brillo de acento
    transform: 'rotate(90deg)',
  }
}));

export const MenuItem = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: '100%',
  justifyContent: open ? 'flex-start' : 'center',
  color: '#A9A9A9', // Texto secundario para indicar inactividad
  padding: theme.spacing(1.5, open ? 2 : 1),
  marginBottom: theme.spacing(1),
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '& .MuiSvgIcon-root': {
    transition: 'color 0.2s ease-in-out',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 212, 0.1)',
    color: '#00F5D4',
    '& .MuiSvgIcon-root': {
      color: '#00F5D4',
    },
  },
}));

export const LogoutButton = styled(MenuItem)({ // Hereda los estilos de MenuItem
  '&:hover': {
    backgroundColor: 'rgba(255, 82, 82, 0.2)', // Rojo para acción de salida
    color: '#FF5252',
    '& .MuiSvgIcon-root': {
      color: '#FF5252',
    },
  },
});

export const MenuLabel = styled(Typography)({
  marginLeft: '16px',
  whiteSpace: 'nowrap',
  fontWeight: 500,
});

// Un simple Box para empujar el botón de logout hacia abajo
export const Spacer = styled(Box)({
  flexGrow: 1,
});