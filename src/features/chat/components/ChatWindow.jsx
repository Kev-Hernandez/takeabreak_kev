// fileName: src/features/chat/components/ChatWindow.jsx

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, Avatar, Drawer, Tooltip, IconButton } from '@mui/material';
import { Send as SendIcon, History as HistoryIcon, Delete as DeleteIcon, PeopleOutline as PeopleOutlineIcon } from '@mui/icons-material';
import Historial from './ChatHistory';
import { useChat } from '../../../hooks/useChat'; // <-- Ruta actualizada al nuevo hook

const ChatWindow = ({ recipientUser }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id || storedUser._id);
      setUserName(storedUser.nombre);
    }
  }, []);
  
  const { messages, sendMessage, clearHistory } = useChat(userId, recipientUser);

  const handleSendMessage = () => {
    sendMessage(newMessage, userName);
    setNewMessage('');
  };

  const handleClearHistory = async () => {
    const confirmed = window.confirm('¿Seguro que quieres borrar el historial del chat?');
    if (confirmed) {
      await clearHistory();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', borderRadius: 7, borderTop:3 }}>
      {/* Header */}
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 0, boxShadow: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chat con {recipientUser?.nombre} {recipientUser?.apellido}
        </Typography>
        <Button onClick={() => setDrawerOpen(true)} startIcon={<HistoryIcon />} variant="contained" sx={{ bgcolor: 'background.paper', color: 'text.primary', '&:hover': { bgcolor: 'background.default' } }}>
          Historial
        </Button>
      </Paper>

      {/* Sidebar Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: '400px' }, p: 2 } }}>
        <Historial messages={messages} />
        <Button variant="contained" color="error" onClick={handleClearHistory} sx={{ mt: 2, width: '100%' }} startIcon={<DeleteIcon />}>
          Limpiar historial
        </Button>
      </Drawer>

      {/* Empty State o Contenido del Chat */}
      {!recipientUser?._id ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <PeopleOutlineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Selecciona un usuario para comenzar a chatear
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          {/* Messages Area */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'background.paper' }}>
            <List>
              {messages.map((message, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', px: 0, py: 0.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: message.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1.5, maxWidth: '80%' }}>
                    <Tooltip title={message.remitenteNombre || 'Anónimo'} placement="top">
                      <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {(message.remitenteNombre)?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </Tooltip>
                    <Paper elevation={1} sx={{ p: 1.5, bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100', color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary', borderRadius: 4, borderBottomRightRadius: message.sender === 'user' ? 2 : 4, borderBottomLeftRadius: message.sender === 'user' ? 4 : 2 }}>
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" sx={{ fontSize: 10, opacity: 0.8, display: 'block', textAlign: 'right' }}>
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
          {/* Message Input */}
          <Paper sx={{ p: 2, borderRadius: 7, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField fullWidth multiline maxRows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe un mensaje..." variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }} />
              <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ChatWindow;