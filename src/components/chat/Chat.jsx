import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Paper, Typography, 
  List, ListItem, ListItemText, Avatar, Drawer 
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
    } else {
      setRecipientId(null);
    }
  }, [recipientUser]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => console.log('✅ Conectado al WebSocket');
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isMine = data.remitenteId === userId;
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            sender: isMine ? 'user' : data.remitenteNombre || 'otro'
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
  }, [userId]);

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
      {/* Header con sólo botón Historial a la derecha */}
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
        {showHistorial
          ? <Historial messages={messages} />
          : null
        }
      </Drawer>

      {/* Mensaje cuando no hay usuario seleccionado, ahora sin centrar contenido sino ocupar todo */}
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
                <ListItem key={index} sx={{ 
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  px: 0 
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1
                  }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.500'
                    }}>
                      {message.sender?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                    <Paper sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100'
                    }}>
                      <ListItemText 
                        primary={message.text} 
                        secondary={message.timestamp}
                        primaryTypographyProps={{
                          color: message.sender === 'user' ? 'white' : 'text.primary'
                        }}
                        secondaryTypographyProps={{
                          color: message.sender === 'user' ? 'primary.contrastText' : 'text.secondary',
                          fontSize: 12
                        }}
                      />
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
