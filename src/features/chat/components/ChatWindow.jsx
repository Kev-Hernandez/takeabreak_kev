// src/features/chat/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, TextField, IconButton, Tooltip, Drawer, Button, ListItem, Chip } from '@mui/material'; // Agregamos Chip
import { Send, MusicNote, MoreVert, Delete, PeopleOutline, AutoAwesome } from '@mui/icons-material'; // Agregamos AutoAwesome

import GlassCard from '../../../components/common/GlassCard';
import { APP_COLORS, THEME_COLORS } from '../../../utils/constants';

import { useChatContext } from '../../../context/ChatContext';
import { useChat } from '../hooks/useChat';
import apiClient from '../../../api/apiClient';
import Historial from './ChatHistory';

const ChatWindow = () => {
  const { selectedUser } = useChatContext();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Estado para el COLOR del tema
  const [themeColor, setThemeColor] = useState(THEME_COLORS['default']);
  // ✅ NUEVO: Estado para el NOMBRE de la emoción
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id || storedUser._id);
      setUserName(storedUser.nombre);
    }
  }, []);

  const { messages, sendMessage, clearHistory } = useChat(userId, selectedUser);

  // --- LÓGICA DE TEMAS Y EMOCIONES ---
  useEffect(() => {
    // Si no hay mensajes o cambiamos de usuario
    if (!messages || messages.length === 0) {
      setThemeColor(THEME_COLORS['default']);
      setCurrentEmotion('Neutral'); // Reseteamos nombre
      return;
    }

    const ultimoMensaje = messages[messages.length - 1];
    
    if (ultimoMensaje?.emocion) {
      const emocionRaw = ultimoMensaje.emocion.trim(); // ej: "alegría"
      
      // 1. Buscamos el color
      const nuevoTema = THEME_COLORS[emocionRaw] || THEME_COLORS['default'];
      setThemeColor(nuevoTema);

      // 2. ✅ Guardamos el nombre bonito (Primera letra mayúscula)
      const nombreFormateado = emocionRaw.charAt(0).toUpperCase() + emocionRaw.slice(1);
      setCurrentEmotion(nombreFormateado);
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ... (Handlers de envío, historial y música siguen IGUAL) ...
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage, userName);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('¿Borrar historial?')) {
      await clearHistory();
      setThemeColor(THEME_COLORS['default']);
      setCurrentEmotion('Neutral');
      setDrawerOpen(false);
    }
  };

  const pedirRecomendacion = async () => {
    if (!selectedUser?._id) return;
    try {
      const recipientId = selectedUser._id || selectedUser.id;
      const response = await apiClient.post('/api/v1/ia/recomendacion-chat', { recipientId });
      const { emocion_dominante, recomendaciones } = response.data;
      alert(`🤖 IA: Siento "${emocion_dominante}".\n🎵 Escucha:\n${recomendaciones.join('\n')}`);
    } catch (error) {
      console.error("Error IA:", error);
      alert("IA musical no disponible.");
    }
  };

  const formatTimestamp = (ts) => {
    try { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } 
    catch (e) { return ''; }
  };

  if (!selectedUser) {
    return (
      <GlassCard sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <PeopleOutline sx={{ fontSize: 60, color: 'rgba(255,255,255,0.5)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Selecciona un amigo para chatear
        </Typography>
      </GlassCard>
    );
  }

  return (
    <GlassCard sx={{ 
      position: 'relative', height: '100%',
      '&::before': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: themeColor, opacity: 0.6, zIndex: -1, transition: 'background 1s ease'
      }
    }}>
      
      {/* HEADER */}
      <Box sx={{ 
        p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${APP_COLORS.glassBorder}`, flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={selectedUser.nombre}>
            <Avatar sx={{ border: '2px solid white', bgcolor: APP_COLORS.secondary }}>
              {selectedUser.nombre[0]}
            </Avatar>
          </Tooltip>
          
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {selectedUser.nombre} {selectedUser.apellido}
            </Typography>
            
            {/* ✅ INDICADOR DE EMOCIÓN */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <AutoAwesome sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Vibe: {currentEmotion}
                </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Tooltip title="Pedir música a la IA">
            <IconButton onClick={pedirRecomendacion} sx={{ color: 'white', mr: 1 }}>
              <MusicNote />
            </IconButton>
          </Tooltip>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* ÁREA DE MENSAJES */}
      <Box sx={{ 
        flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0,
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }
      }}>
        {messages.map((msg, i) => {
          const isMe = msg.sender === 'user';
          return (
            <Box key={i} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <Box sx={{
                p: '12px 18px', borderRadius: '20px',
                bgcolor: isMe ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.4)',
                color: isMe ? '#333' : 'white',
                borderBottomRightRadius: isMe ? 0 : '20px',
                borderBottomLeftRadius: isMe ? '20px' : 0,
                backdropFilter: 'blur(4px)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>{msg.text}</Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.5, px: 1,
                opacity: 0.7, color: 'white', fontSize: '0.7rem'
              }}>
                {formatTimestamp(msg.timestamp)}
              </Typography>
            </Box>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA (BLANCO SÓLIDO) */}
      <Box sx={{ p: 2, pt: 1, flexShrink: 0 }}>
        <Box sx={{ 
          display: 'flex', alignItems: 'center', bgcolor: '#ffffff', 
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)', borderRadius: '30px', 
          p: '8px 15px', border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <TextField 
            fullWidth variant="standard" placeholder="Escribe un mensaje..." 
            multiline maxRows={3} value={newMessage} 
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{ disableUnderline: true, sx: { color: '#000000', px: 1, fontWeight: 500 } }}
            sx={{ '& .MuiInputBase-input::placeholder': { color: '#666', opacity: 1 } }}
          />
          <IconButton 
            onClick={handleSendMessage} disabled={!newMessage.trim()}
            sx={{ 
              bgcolor: APP_COLORS.primary, color: 'white', width: 40, height: 40, ml: 1,
              '&:hover': { bgcolor: '#d6336c', transform: 'scale(1.1)' },
              '&.Mui-disabled': { bgcolor: '#f0f0f0', color: '#ccc' }
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2, height: '100%', bgcolor: '#2b2d42', color: 'white' }}>
          <Typography variant="h6" gutterBottom>Historial</Typography>
          <Historial messages={messages} />
          <Button fullWidth variant="outlined" color="error" startIcon={<Delete />} onClick={handleClearHistory} sx={{ mt: 2 }}>
            Borrar Historial
          </Button>
        </Box>
      </Drawer>
    </GlassCard>
  );
};

export default ChatWindow;