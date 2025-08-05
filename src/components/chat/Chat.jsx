import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Paper, Typography, 
  List, ListItem, Avatar, Drawer 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Historial from './Historial';
import HistoryIcon from '@mui/icons-material/History';

const Chat = ({ recipientUser }) => {
  const [userId] = useState('665123456789abcd0123abcd'); // kenia
  const [recipientId, setRecipientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistorial, setShowHistorial] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (recipientUser?._id) {
      setRecipientId(recipientUser._id);
      setMessages([]); // Limpiar mensajes previos al cambiar de chat
      fetchChatHistory(recipientUser._id);
    } else {
      setRecipientId(null);
    }
  }, [recipientUser]);

  const fetchChatHistory = async (recipientId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/web/chat/history/${userId}/${recipientId}`);
      if (!response.ok) throw new Error('Error al obtener historial');
      const data = await response.json();
      console.log('Historial recibido:', data);
      const formattedMessages = data.mensajes.map(msg => {
          console.log('Comparando remitenteId vs userId:', msg.remitenteId, userId, msg.remitenteId === userId);
          return {
            remitenteId: msg.remitenteId,
            text: msg.texto,
            timestamp: new Date(msg.fecha).toLocaleTimeString(),
            date: new Date(msg.fecha).toLocaleDateString(),
            sender: msg.remitenteId === userId ? 'user' : 'otro'
          }
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    socket.onopen = () => console.log('✅ Conectado al WebSocket');
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isRelevant =
          (data.remitenteId === userId && data.recipientId === recipientId) ||
          (data.remitenteId === recipientId && data.recipientId === userId);
        if (!isRelevant) return;
        const isMine = data.remitenteId === userId;
        setMessages((prev) => [
          ...prev,
          {
            remitenteId: data.remitenteId,
            recipientId: data.recipientId,
            remitenteNombre: data.remitenteNombre,
            text: data.text,
            timestamp: data.timestamp,
            date: data.date,
            sender: isMine ? 'user' : 'otro'
          }
        ]);
      } catch (err) {
        console.error('❌ Error al parsear mensaje:', err);
      }
    };
    socket.onerror = (err) => console.error('WebSocket error:', err);
    socket.onclose = () => console.log('❌ WebSocket cerrado');
    setSocket(socket);
    return () => socket.close();
  }, [userId, recipientId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN || !recipientId) return;
    const payload = { userId, recipientId, text: newMessage.trim() };
    socket.send(JSON.stringify(payload));
    setNewMessage('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header con botón Historial */}
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Chat con {recipientUser?.nombre} {recipientUser?.apellido}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            onClick={() => {
              setShowHistorial(true);
              setDrawerOpen(true);
            }} 
            startIcon={<HistoryIcon />} 
            variant="outlined"
          >
            Historial
          </Button>
        </Box>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {showHistorial ? <Historial messages={messages} /> : null}
      </Drawer>

      {!recipientId ? (
        <Box sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
            Selecciona un usuario para comenzar a chatear.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Lista de mensajes */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    px: 0,
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1,
                      maxWidth: '70%',
                      position: 'relative'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.500',
                        flexShrink: 0
                      }}
                    >
                      {message.sender?.[0]?.toUpperCase() || '?'}
                    </Avatar>

                    <Paper
                      elevation={3}
                      sx={{
                        p: 1.5,
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                        color: message.sender === 'user' ? 'white' : 'black',
                        borderRadius: 2,
                        position: 'relative',
                        wordBreak: 'break-word',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          width: 0,
                          height: 0,
                          top: '12px',
                          borderStyle: 'solid',
                          borderWidth: '8px 8px 8px 0',
                          borderColor: message.sender === 'user' 
                            ? `transparent ${theme => theme.palette.primary.main} transparent transparent`
                            : 'transparent #e0e0e0 transparent transparent',
                          right: message.sender === 'user' ? '-8px' : 'auto',
                          left: message.sender === 'user' ? 'auto' : '-8px',
                          transform: message.sender === 'user' ? 'rotate(180deg)' : 'none',
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 0.5 }}>{message.text}</Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, opacity: 0.7, textAlign: 'right' }}>
                        {message.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Input para enviar mensaje */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleSendMessage}
                sx={{ minWidth: 56 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Chat;
