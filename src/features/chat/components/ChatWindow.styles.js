import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, IconButton, TextField, Button, List } from '@mui/material';

// --- Contenedores Principales ---

export const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#0D1B2A', // Fondo principal oscuro
  flex: 2,
});

export const Header = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 0,
  backgroundColor: '#1B263B', // Fondo secundario
  color: '#E0E1DD', // Texto principal
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HistoryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#E0E1DD',
  '&:hover': {
    backgroundColor: 'rgba(0, 245, 212, 0.2)', // Brillo de acento
    color: '#00F5D4',
  },
}));

export const MessagesArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
});

// --- Elementos del Chat ---

export const MessageList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
});

export const MessageBubble = styled(Paper)(({ theme, owner }) => ({
  padding: '10px 14px',
  borderRadius: '16px',
  maxWidth: '75%',
  wordWrap: 'break-word',
  // Lógica condicional para el estilo basado en el dueño del mensaje
  ...(owner === 'user' ? {
    backgroundColor: '#00F5D4', // Acento primario para el usuario
    color: '#0D1B2A', // Texto oscuro para contraste
    borderBottomRightRadius: '4px',
  } : {
    backgroundColor: '#1B263B', // Fondo secundario para el otro
    color: '#E0E1DD', // Texto principal
    borderBottomLeftRadius: '4px',
  })
}));

export const Timestamp = styled(Typography)({
  fontSize: '10px',
  opacity: 0.8,
  display: 'block',
  textAlign: 'right',
  marginTop: '4px'
});

// --- Input de Mensaje ---

export const MessageInputContainer = styled(Paper)({
    padding: '12px 16px',
    backgroundColor: '#1B263B',
    borderRadius: '0 0 28px 28px', // Bordes redondeados solo abajo
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.2)',
});

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#0D1B2A',
    borderRadius: '12px',
    '& fieldset': {
      border: '1px solid #4f5b6b', // Borde sutil
    },
    '&:hover fieldset': {
      borderColor: '#00F5D4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00F5D4',
    },
  },
  '& .MuiInputBase-input': {
    color: '#E0E1DD',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#A9A9A9',
    opacity: 1,
  },
});

export const SendButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#00F5D4',
    color: '#0D1B2A',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#00F5D4',
        transform: 'scale(1.1)',
        boxShadow: `0 0 15px #00F5D4`, // Efecto de brillo
    },
    '&:disabled': {
        backgroundColor: '#1B263B',
    }
}));