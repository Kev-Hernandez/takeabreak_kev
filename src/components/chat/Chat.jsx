import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Paper, Typography, 
  List, ListItem, ListItemText, Avatar, Drawer 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import GroupIcon from '@mui/icons-material/Group'; // ícono para Usuarios activos
import Historial from './Historial'; // Ajusta ruta si está en otra carpeta
import UsersOn from './UsersOn'; // Importa UsersOn (ajusta ruta según tu estructura)

const Chat = () => {
  const [userId, setUserId] = useState('665123456789abcd0123abcd'); // kenia
  const [recipientId, setRecipientId] = useState('6851b5a3a1819311862502df');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistorial, setShowHistorial] = useState(true); // controla si muestra historial o usuarios
  const [usuariosActivos, setUsuariosActivos] = useState([
    { nombre: 'Ana' },
    { nombre: 'Carlos' },
    { email: 'otro@correo.com' }
  ]);
  const [socket, setSocket] = useState(null);

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
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
    const payload = { userId, recipientId, text: newMessage.trim() };
    socket.send(JSON.stringify(payload));
    setNewMessage('');
  };

  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.date]) grouped[msg.date] = [];
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Take a Break - Chat</Typography>
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
          <Button 
            onClick={() => {
              setShowHistorial(false);
              setDrawerOpen(true);
            }}
            startIcon={<GroupIcon />}
            variant="outlined"
          >
            Usuarios activos
          </Button>
        </Box>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {showHistorial
          ? <Historial groupedMessages={groupMessagesByDate()} />
          : <UsersOn users={usuariosActivos} />
        }
      </Drawer>

      {/* Aquí va el listado de mensajes y el input para enviar mensajes */}

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
    </Box>
  );
};

export default Chat;
