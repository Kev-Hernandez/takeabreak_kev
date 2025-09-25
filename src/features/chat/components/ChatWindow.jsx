import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Paper, Typography,
  List, ListItem, Avatar, Drawer, Tooltip, IconButton
} from '@mui/material';
import {
  Send as SendIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  PeopleOutline as PeopleOutlineIcon
} from '@mui/icons-material';
import Historial from './ChatHistory';
import apiClient from '../../../api/apiClient';


const ChatWindow = ({ recipientUser }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [recipientId, setRecipientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistorial, setShowHistorial] = useState(true);
  const [socket, setSocket] = useState(null);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.id) {
      setUserId(storedUser.id);
      setUserName(storedUser.nombre);
    }
  }, []);

  // Actualizar recipientId cuando recipientUser cambie
  useEffect(() => {
    if (recipientUser?._id) {
      setRecipientId(recipientUser._id);
    } else {
      setRecipientId(null);
      setMessages([]); // Limpia mensajes si no hay destinatario
    }
  }, [recipientUser]);

  // Obtener historial de chat cuando cambien userId o recipientId
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId || !recipientId) return;

      try {
        console.log('Fetching chat history for', userId, recipientId);
        const response = await apiClient.get(`/api/v1/chat/history/${userId}/${recipientId}`);
        const data = response.data;
        const formattedMessages = data.mensajes.map(msg => ({
          remitenteId: msg.remitenteId,
          remitenteNombre: msg.remitenteNombre || '',
          text: msg.texto,
          timestamp: msg.fecha,
          date: new Date(msg.fecha).toLocaleDateString(),
          sender: msg.remitenteId === userId ? 'user' : 'otro'
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [userId, recipientId]);

  // WebSocket para mensajes en tiempo real
  useEffect(() => {
    if (!userId || !recipientId) return;

    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('✅ Conectado al WebSocket');
      ws.send(JSON.stringify({
        type: 'init',
        userId: userId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isRelevant =
          (data.remitenteId === userId && data.recipientId === recipientId) ||
          (data.remitenteId === recipientId && data.recipientId === userId);
        if (!isRelevant) return;

        const isMine = data.remitenteId === userId;
        setMessages(prev => [
          ...prev,
          {
            remitenteId: data.remitenteId,
            remitenteNombre: data.remitenteNombre || '',
            recipientId: data.recipientId,
            text: data.text,
            timestamp: data.timestamp || new Date().toISOString(),
            date: data.date,
            sender: isMine ? 'user' : 'otro'
          }
        ]);
      } catch (err) {
        console.error('❌ Error al parsear mensaje:', err);
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('❌ WebSocket cerrado');
    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [userId, recipientId]);

  // Enviar mensaje
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN || !recipientId) return;

    const payload = {
      userId,
      recipientId,
      remitenteNombre: userName,
      text: newMessage.trim()
    };
    socket.send(JSON.stringify(payload));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  //para borrar historial
const handleClearHistory = async () => {
  const confirmed = window.confirm('¿Seguro que quieres borrar el historial del chat?');
  if (!confirmed) return;
  if (!userId || !recipientId) return;

  try {
    await apiClient.delete(`/api/v1/chat/history/${userId}/${recipientId}`);
    const response = await apiClient.get(`/api/v1/chat/history/${userId}/${recipientId}`);
    const data = response.data;
    setMessages(data.mensajes.map(msg => ({
      remitenteId: msg.remitenteId,
      remitenteNombre: msg.remitenteNombre || '',
      text: msg.texto,
      timestamp: msg.fecha, // Mantén el formato original
      sender: msg.remitenteId === userId ? 'user' : 'otro'
    })));
  } catch (error) {
    console.error('Error al borrar el historial:', error);
  }
};

//para ver la hora de los mensajes
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Ahora';
  
  try {
    let date;
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      date = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return 'Ahora';
    }
    if (isNaN(date.getTime())) return 'Ahora';
    const options = {
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
    let timeString = date.toLocaleTimeString('en-US', options);
    return timeString;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Ahora';
  }
};

  console.log('Chat render - recipientUser:', recipientUser);
  console.log('Chat render - recipientId:', recipientId);

return (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh',
    bgcolor: 'background.default',
    borderRadius: 7,
    borderTop:3,
  }}>
    {/* Header */}
    <Paper 
      sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: 0,
        boxShadow: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Chat con {recipientUser?.nombre} {recipientUser?.apellido}
      </Typography>
      <Button
        onClick={() => {
          setShowHistorial(true);
          setDrawerOpen(true);
        }}
        startIcon={<HistoryIcon />}
        variant="contained"
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'background.default'
          }
        }}
      >
        Historial
      </Button>
    </Paper>

    {/* Sidebar Drawer */}
    <Drawer 
      anchor="right" 
      open={drawerOpen} 
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '400px' },
          p: 2
        }
      }}
    >
      {showHistorial && <Historial messages={messages} />}
      <Button 
        variant="contained" 
        color="error"
        onClick={handleClearHistory}
        sx={{ 
          mt: 2,
          width: '100%'
        }}
        startIcon={<DeleteIcon />}
      >
        Limpiar historial
      </Button>
    </Drawer>

    {/* Empty State */}
    {!recipientId ? (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.paper'
      }}>
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
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}>
          <List sx={{ pb: 0 }}>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  px: 0,
                  py: 0.5
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1.5,
                    maxWidth: { xs: '90%', sm: '80%', md: '70%' }
                  }}
                >
                  <Tooltip 
                    title={message.remitenteNombre || message.sender || 'Anónimo'} 
                    placement="top"
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: message.sender === 'user' 
                          ? 'primary.main' 
                          : 'secondary.main',
                        flexShrink: 0
                      }}
                    >
                      {(message.remitenteNombre || message.sender)?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                  </Tooltip>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: message.sender === 'user' 
                          ? 'primary.main' 
                          : 'grey.100',
                        color: message.sender === 'user' 
                          ? 'primary.contrastText' 
                          : 'text.primary',
                        borderRadius: 4,
                        borderBottomRightRadius: message.sender === 'user' ? 2 : 4,
                        borderBottomLeftRadius: message.sender === 'user' ? 4 : 2,
                        wordBreak: 'break-word',
                        position: 'relative',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {message.text}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: 10, 
                          opacity: 0.8, 
                          display: 'block',
                          textAlign: 'right',
                          color: message.sender === 'user' 
                            ? 'primary.contrastText' 
                            : 'text.secondary'
                        }}
                      >
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Paper>
                    {index === messages.length - 1 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: 10, 
                          color: 'text.disabled',
                          alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          mt: 0.5
                        }}
                      >
                        {message.status || 'Enviado'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Message Input */}
        <Paper 
          sx={{ 
            p: 2, 
            borderRadius: 7,
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  bgcolor: 'background.default'
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground'
                }
              }}
            >
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
