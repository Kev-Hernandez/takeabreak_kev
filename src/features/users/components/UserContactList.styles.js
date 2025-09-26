import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Avatar } from '@mui/material';

// --- Contenedor Principal ---

export const ListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: 380,
  padding: theme.spacing(3),
  borderRight: '1px solid #1B263B', // Borde con color de tema oscuro
  backgroundColor: '#0D1B2A', // Fondo principal
  color: '#E0E1DD', // Texto principal
  display: 'flex',
  flexDirection: 'column',
}));

export const Header = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontWeight: 700,
}));

// --- Barra de Búsqueda ---

export const SearchTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputLabel-root': {
    color: '#A9A9A9', // Texto secundario
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1B263B',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#4f5b6b',
    },
    '&:hover fieldset': {
      borderColor: '#00F5D4', // Acento primario al pasar el ratón
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00F5D4',
    },
    '& .MuiInputBase-input': {
      color: '#E0E1DD',
    },
    '& .MuiSvgIcon-root': {
      color: '#A9A9A9',
    },
  },
}));

// --- Elementos de la Lista de Contactos ---

export const ContactList = styled(Box)({
  overflowY: 'auto',
  flex: 1,
  // Estilo para la barra de scroll
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#0D1B2A',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#1B263B',
    borderRadius: '3px',
  },
});

export const ContactItem = styled(Box, {shouldForwardProp: (prop) => prop !== 'isSelected',})(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
  // Estilo condicional si el item está seleccionado
  backgroundColor: isSelected ? 'rgba(0, 245, 212, 0.15)' : 'transparent',
  border: isSelected ? '1px solid #00F5D4' : '1px solid transparent',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
}));

export const StyledAvatar = styled(Avatar)({
  border: `2px solid #00F5D4`, // Borde de acento en el avatar
});