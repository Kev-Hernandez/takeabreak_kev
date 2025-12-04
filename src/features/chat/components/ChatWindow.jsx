import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, TextField, IconButton, Tooltip, Drawer, Button, ListItem } from '@mui/material';
import { Send, MusicNote, MoreVert, Delete, PeopleOutline, AutoAwesome } from '@mui/icons-material';

import GlassCard from '../../../components/common/GlassCard';
import { APP_COLORS, THEME_COLORS } from '../../../utils/constants';

import { useChatContext } from '../../../context/ChatContext';
import { useChat } from '../hooks/useChat';
import apiClient from '../../../api/apiClient';
import Historial from './ChatHistory';
import { useThemeContext } from '../../../context/ThemeContext';

const ChatWindow = () => {
  const { selectedUser } = useChatContext();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // --- 3 ESTADOS SEPARADOS PARA NO CONFUNDIRSE ---
  const [chatBackground, setChatBackground] = useState(THEME_COLORS['default']); // 1. Fondo (Ambiente)
  const [friendEmotion, setFriendEmotion] = useState('Neutral');                 // 2. Header (Amigo)
  // El 3ro (Tu Vibe) se maneja directo con setThemeMode

  const { setThemeMode } = useThemeContext(); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id || storedUser._id);
      setUserName(storedUser.nombre);
    }
  }, []);

  const { messages, sendMessage, clearHistory, refreshMessages } = useChat(userId, selectedUser);

  // Helper para saber quién es quién
  const isMe = (sender) => {
    if (!sender || !userId) return false;
    const sId = String(sender._id || sender);
    const uId = String(userId);
    return sId === uId || sender === 'user';
  };

  // --- LÓGICA MAESTRA DE 3 CANALES ---
  useEffect(() => {
    if (!messages || messages.length === 0) {
      setChatBackground(THEME_COLORS['default']);
      setFriendEmotion('Neutral');
      return;
    }

    // CANAL 1: EL AMBIENTE (FONDO)
    // Reacciona al ÚLTIMO mensaje de CUALQUIERA (Tuyo o de él)
    const ultimoMensajeGeneral = messages[messages.length - 1];
    if (ultimoMensajeGeneral?.emocion) {
      const em = ultimoMensajeGeneral.emocion.trim();
      setChatBackground(THEME_COLORS[em] || THEME_COLORS['default']);
    }

    // CANAL 2: TU VIBE (SIDEBAR)
    // Busca TU último mensaje hacia atrás
    if (userId) {
      const miUltimo = [...messages].reverse().find(msg => isMe(msg.sender) && msg.emocion);
      if (miUltimo) {
        setThemeMode(miUltimo.emocion.trim());
      }
    }

    // CANAL 3: VIBE DEL AMIGO (HEADER)
    // Busca EL ÚLTIMO mensaje de ÉL/ELLA hacia atrás.
    // Así, si tú escribes "Feliz", el header de él sigue diciendo "Triste" (su último estado).
    const ultimoAmigo = [...messages].reverse().find(msg => !isMe(msg.sender) && msg.emocion);
    
    if (ultimoAmigo) {
      const emAmigo = ultimoAmigo.emocion.trim();
      setFriendEmotion(emAmigo.charAt(0).toUpperCase() + emAmigo.slice(1));
    } else {
      // Si el amigo no ha dicho nada con emoción aún
      setFriendEmotion('Neutral');
    }

  }, [messages, userId, setThemeMode]); // Se ejecuta al recibir mensajes


  // --- Resto de lógica (Igual que antes) ---
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const ultimo = messages[messages.length - 1];
    if (isMe(ultimo.sender) && !ultimo.emocion) {
        const interval = setInterval(() => { if (refreshMessages) refreshMessages(); }, 2000);
        return () => clearInterval(interval);
    }
  }, [messages, userId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage, userName);
    setNewMessage('');
    if(refreshMessages) setTimeout(refreshMessages, 1000); 
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
      setChatBackground(THEME_COLORS['default']);
      setFriendEmotion('Neutral');
      setThemeMode('neutral');
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
    } catch (error) { console.error(error); alert("IA no disponible"); }
  };

  const formatTimestamp = (ts) => {
    try { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  };

  if (!selectedUser) {
    return (
      <GlassCard sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <PeopleOutline sx={{ fontSize: 60, color: 'rgba(255,255,255,0.5)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>Selecciona un amigo</Typography>
      </GlassCard>
    );
  }

  return (
    <GlassCard sx={{ 
      position: 'relative', height: '100%',
      '&::before': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: chatBackground, // Usamos la variable específica del fondo
        opacity: 0.6, zIndex: -1, transition: 'background 1s ease'
      }
    }}>
      
      {/* HEADER */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${APP_COLORS.glassBorder}`, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={selectedUser.nombre}>
            <Avatar sx={{ border: '2px solid white', bgcolor: APP_COLORS.secondary }}>{selectedUser.nombre[0]}</Avatar>
          </Tooltip>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {selectedUser.nombre} {selectedUser.apellido}
            </Typography>
            
            {/* AQUÍ MOSTRAMOS LA EMOCIÓN DEL AMIGO, NO LA TUYA */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <AutoAwesome sx={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    Vibe: {friendEmotion} 
                </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Pedir música"><IconButton onClick={pedirRecomendacion} sx={{ color: 'white', mr: 1 }}><MusicNote /></IconButton></Tooltip>
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}><MoreVert /></IconButton>
        </Box>
      </Box>

      {/* MESSAGES */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '4px' } }}>
        {messages.map((msg, i) => {
          const isMeMsg = isMe(msg.sender);
          return (
            <Box key={i} sx={{ alignSelf: isMeMsg ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
              <Box sx={{
                p: '12px 18px', borderRadius: '20px',
                bgcolor: isMeMsg ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.4)',
                color: isMeMsg ? '#333' : 'white',
                borderBottomRightRadius: isMeMsg ? 0 : '20px', borderBottomLeftRadius: isMeMsg ? '20px' : 0,
                backdropFilter: 'blur(4px)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>{msg.text}</Typography>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', textAlign: isMeMsg ? 'right' : 'left', mt: 0.5, px: 1, opacity: 0.7, color: 'white', fontSize: '0.7rem' }}>
                {formatTimestamp(msg.timestamp)}
              </Typography>
            </Box>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT */}
      <Box sx={{ p: 2, pt: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#ffffff', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', borderRadius: '30px', p: '8px 15px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <TextField 
            fullWidth variant="standard" placeholder="Escribe un mensaje..." multiline maxRows={3} 
            value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress}
            InputProps={{ disableUnderline: true, sx: { color: '#000000', px: 1, fontWeight: 500 } }}
            sx={{ '& .MuiInputBase-input::placeholder': { color: '#666', opacity: 1 } }}
          />
          <IconButton onClick={handleSendMessage} disabled={!newMessage.trim()} sx={{ bgcolor: APP_COLORS.primary, color: 'white', width: 40, height: 40, ml: 1, '&:hover': { bgcolor: '#d6336c', transform: 'scale(1.1)' }, '&.Mui-disabled': { bgcolor: '#f0f0f0', color: '#ccc' } }}>
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2, height: '100%', bgcolor: '#2b2d42', color: 'white' }}>
          <Typography variant="h6" gutterBottom>Historial</Typography>
          <Historial messages={messages} />
          <Button fullWidth variant="outlined" color="error" startIcon={<Delete />} onClick={handleClearHistory} sx={{ mt: 2 }}>Borrar Historial</Button>
        </Box>
      </Drawer>
    </GlassCard>
  );
};

export default ChatWindow;