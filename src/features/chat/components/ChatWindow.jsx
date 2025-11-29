import React, { useState, useEffect, useRef } from 'react';
import { Typography, Drawer, Tooltip, Avatar, ListItem, Box, Button, IconButton } from '@mui/material';
import { Delete as DeleteIcon, PeopleOutline as PeopleOutlineIcon, Send as SendIcon, MusicNote as MusicNoteIcon } from '@mui/icons-material';
import Historial from './ChatHistory';
import { useChat } from '../hooks/useChat';
import { useChatContext } from '../../../context/ChatContext';
import apiClient from '../../../api/apiClient';

// 1. Importamos tus componentes estilizados
import {
  ChatContainer, Header, HistoryButton, MessagesArea, MessageList, MessageBubble,
  Timestamp, MessageInputContainer, StyledTextField, SendButton
} from './ChatWindow.styles';

// --- 🎨 MAPA DE COLORES ---
const THEME_COLORS = {
  'alegría': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'felicidad': 'linear-gradient(135deg, #fce38a 0%, #f38181 100%)',
  'amor': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #feada6 100%)',
  'gratitud': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'esperanza': 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'calma': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  
  'enojo': 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
  'frustración': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'estres': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'ansiedad': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',

  'tristeza': 'linear-gradient(135deg, #accbee 0%, #e7f0fd 100%)',
  'aburrimiento': 'linear-gradient(135deg, #d7d2cc 0%, #304352 100%)',
  'culpa': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  'verguenza': 'linear-gradient(135deg, #e65c00 0%, #F9D423 100%)',
  'envidia': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',

  'depresion_profunda': 'linear-gradient(135deg, #0f2027 0%, #203a43 100%, #2c5364 100%)',
  'desesperacion_inevitable': 'linear-gradient(135deg, #2C3E50 0%, #000000 100%)',
  'suicida': 'linear-gradient(135deg, #000000 0%, #434343 100%)',
  'autolesion': 'linear-gradient(135deg, #191919 0%, #2c3e50 100%)',
  'psicopata': 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',

  'neutral': '#ffffff', 
  'neutral_generico': '#ffffff',
  'default': '#ffffff'
};

const ChatWindow = () => {
  const { selectedUser } = useChatContext();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Estado para el tema actual
  const [themeColor, setThemeColor] = useState(THEME_COLORS['default']);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id || storedUser._id);
      setUserName(storedUser.nombre);
    }
  }, []);
  
  const { messages, sendMessage, clearHistory } = useChat(userId, selectedUser);

  // --- 🌈 RESETEO DE COLOR AL CAMBIAR DE USUARIO ---
  // Este useEffect es CLAVE. Se dispara SOLO cuando cambias de chat (selectedUser).
  useEffect(() => {
      // Siempre que cambies de amigo, empieza en blanco.
      // Si el chat tiene mensajes, el siguiente useEffect lo pintará rápido.
      setThemeColor(THEME_COLORS['default']);
  }, [selectedUser]); // <--- Dependencia crítica

  // --- 🌈 LÓGICA DE COLOR (Mensajes) ---
  useEffect(() => {
    // Si no hay mensajes, nos aseguramos de que sea blanco
    if (!messages || messages.length === 0) {
        setThemeColor(THEME_COLORS['default']);
        return;
    }

    if (messages.length > 0) {
      const ultimoMensaje = messages[messages.length - 1];
      
      // Si el mensaje es local (sin emoción), no tocamos el color actual
      if (!ultimoMensaje.emocion) return;

      let emocion = ultimoMensaje.emocion;
      if(emocion) emocion = emocion.trim();

      const nuevoTema = THEME_COLORS[emocion] || THEME_COLORS['default'];
      setThemeColor(nuevoTema);
    }
  }, [messages]); // Se dispara cuando llegan mensajes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage, userName);
    setNewMessage('');
  };

  const handleClearHistory = async () => {
    const confirmed = window.confirm('¿Seguro que quieres borrar el historial del chat?');
    if (confirmed) {
      await clearHistory();
      setThemeColor(THEME_COLORS['default']);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const pedirRecomendacion = async () => {
    if (!selectedUser?._id) return;

    try {
        const recipientId = selectedUser._id || selectedUser.id;
        const response = await apiClient.post('/api/v1/ia/recomendacion-chat', {
            recipientId: recipientId
        });
        const { emocion_dominante, recomendaciones } = response.data;
        alert(`🤖 IA: Siento un ambiente de "${emocion_dominante}".\n\n🎵 Te recomiendo escuchar:\n${recomendaciones.join('\n')}`);
    } catch (error) {
        console.error("Error pidiendo música:", error);
        alert("La IA musical no está disponible ahora.");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Ahora';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Ahora';
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (error) { return 'Ahora'; }
  };
  
  return (
    <ChatContainer 
        style={{ 
            background: themeColor, 
            transition: 'background 0.5s ease', // Transición un poco más rápida para que el reseteo se sienta bien
            backgroundSize: 'cover', 
            backgroundAttachment: 'fixed', 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}
    >
      <Header>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chat con {selectedUser?.nombre} {selectedUser?.apellido}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Vibe Check Musical">
                <IconButton onClick={pedirRecomendacion} sx={{ color: 'primary.main', mr: 1, bgcolor: 'rgba(255,255,255,0.4)' }}>
                    <MusicNoteIcon />
                </IconButton>
            </Tooltip>
            <HistoryButton onClick={() => setDrawerOpen(true)}>
              Historial
            </HistoryButton>
        </Box>
      </Header>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: '400px' }, p: 2 } }}>
        <Historial messages={messages} />
        <Button variant="contained" color="error" onClick={handleClearHistory} sx={{ mt: 2, width: '100%' }} startIcon={<DeleteIcon />}>
          Limpiar historial
        </Button>
      </Drawer>

      {!selectedUser?._id ? (
        <MessagesArea sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <PeopleOutlineIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Selecciona un usuario para comenzar a chatear
            </Typography>
          </Box>
        </MessagesArea>
      ) : (
        <>
          <MessagesArea style={{ flexGrow: 1, overflowY: 'auto' }}>
            <MessageList>
              {messages.map((message, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', px: 0, py: 0.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: message.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1.5, maxWidth: '80%' }}>
                    <Tooltip title={message.remitenteNombre || 'Anónimo'} placement="top">
                      <Avatar sx={{ bgcolor: message.sender === 'user' ? '#00F5D4' : '#1B263B' }}>
                        {(message.remitenteNombre)?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </Tooltip>
                    
                    <MessageBubble 
                        owner={message.sender}
                        style={{ 
                            backdropFilter: 'blur(5px)', 
                            backgroundColor: message.sender === 'user' ? 'rgba(0, 245, 212, 0.9)' : 'rgba(255, 255, 255, 0.85)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                      <Typography variant="body1" sx={{ color: '#000' }}>{message.text}</Typography>
                      <Timestamp sx={{ color: '#555' }}>
                        {formatTimestamp(message.timestamp)}
                      </Timestamp>
                    </MessageBubble>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </MessageList>
          </MessagesArea>
          
          <div style={{
              width: '100%',
              padding: '15px 20px',
              background: 'rgba(255, 255, 255, 0.25)', 
              backdropFilter: 'blur(10px)',            
              borderTop: '1px solid rgba(255,255,255,0.3)',
              boxSizing: 'border-box'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <StyledTextField 
                fullWidth 
                multiline 
                maxRows={4} 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Escribe un mensaje..." 
                variant="outlined" 
                size="small" 
                sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': { borderRadius: '20px' } 
                }}
              />
              <SendButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendIcon />
              </SendButton>
            </Box>
          </div>
        </>
      )}
    </ChatContainer>
  );
};

export default ChatWindow;