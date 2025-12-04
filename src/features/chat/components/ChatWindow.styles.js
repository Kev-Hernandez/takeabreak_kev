import { styled } from '@mui/material/styles';
import { Box, Button, Typography, IconButton, TextField, List, Paper } from '@mui/material';
// Importamos nuestro componente de cristal reutilizable
import GlassSurface from '../../../components/common/GlassSurface';

// 1. El contenedor principal del chat (ya es de cristal)
export const ChatContainer = styled(GlassSurface)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // Ocupa toda la altura disponible
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '25px',
});

// 2. El Header (Barra superior con el nombre)
export const Header = styled(GlassSurface)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // Quitamos bordes superiores y redondeamos solo abajo para que encaje
  borderRadius: '0 0 20px 20px', 
  borderTop: 'none', 
  borderLeft: 'none', 
  borderRight: 'none',
  margin: '0 1px', // Pequeño ajuste lateral
  zIndex: 5,
  
  // ✅ ARREGLO CLAVE 1: Evita que el header se aplaste
  flexShrink: 0, 
}));

export const HistoryButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  borderRadius: '20px',
  textTransform: 'none',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
});

// 3. EL ÁREA DE MENSAJES (Aquí está la magia)
export const MessagesArea = styled(Box)({
  // ✅ ARREGLO CLAVE 2: ¡Esto es lo que arregla el salto! 
  // Le dice: "Crece y ocupa todo el espacio vacío".
  flexGrow: 1, 
  
  overflowY: 'auto', 
  padding: '20px', 
  display: 'flex', 
  flexDirection: 'column',
  
  // Esto hace que si hay pocos mensajes, empiecen desde abajo
  '& > :first-of-type': { marginTop: 'auto' }, 

  // Scrollbar bonito y sutil
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' },
});

export const MessageList = styled(List)({
  display: 'flex', flexDirection: 'column', width: '100%', padding: 0, margin: 0,
});

// Burbujas de mensaje (también de cristal)
export const MessageBubble = styled(GlassSurface)(({ theme, owner }) => ({
  padding: '12px 18px',
  maxWidth: '75%',
  wordWrap: 'break-word',
  position: 'relative',
  border: 'none', // Quitamos el borde por defecto para que sea más suave
  
  ...(owner === 'user' ? {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Más sólido para el usuario
    color: '#333',
    borderBottomRightRadius: '4px',
    marginLeft: 'auto',
  } : {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Oscuro transparente para el amigo
    color: '#fff',
    borderBottomLeftRadius: '4px',
    marginRight: 'auto',
  })
}));

export const Timestamp = styled(Typography)({
  fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '4px', color: 'inherit'
});

// 4. El área del Input (Barra de escribir inferior)
export const MessageInputContainer = styled(GlassSurface)({
    padding: '10px 16px',
    margin: '10px 20px 20px 20px', // Margen para que flote abajo
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    
    // ✅ ARREGLO CLAVE 3: Evita que la barra de escribir desaparezca o se aplaste
    flexShrink: 0, 
});

export const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: '20px',
    color: '#ffffff',
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.7)', opacity: 1,
  },
});

export const SendButton = styled(IconButton)({
    backgroundColor: '#ffffff', color: '#e73c7e', width: '40px', height: '40px',
    '&:hover': { backgroundColor: '#f8f8f8', transform: 'scale(1.1)' },
});