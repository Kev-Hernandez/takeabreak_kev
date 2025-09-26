// fileName: src/features/chat/components/ChatWindow.jsx (VERSIÓN CON STYLED COMPONENTS)

import React, { useState, useEffect } from 'react';
import { Typography, Drawer, Tooltip, Avatar, ListItem, Box, Button } from '@mui/material';
import { Delete as DeleteIcon, PeopleOutline as PeopleOutlineIcon, Send as SendIcon } from '@mui/icons-material';
import Historial from './ChatHistory';
import { useChat } from '../../../hooks/useChat';
import { useChatContext } from '../../../context/ChatContext';

// 1. Importamos nuestros nuevos componentes estilizados
import {
  ChatContainer, Header, HistoryButton, MessagesArea, MessageList, MessageBubble,
  Timestamp, MessageInputContainer, StyledTextField, SendButton
} from './ChatWindow.styles';

const ChatWindow = () => {
  const { selectedUser } = useChatContext();
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
  
  const { messages, sendMessage, clearHistory } = useChat(userId, selectedUser);

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
    // 2. Usamos nuestros componentes estilizados en el JSX
    <ChatContainer>
      <Header>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chat con {selectedUser?.nombre} {selectedUser?.apellido}
        </Typography>
        <HistoryButton onClick={() => setDrawerOpen(true)}>
          Historial
        </HistoryButton>
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
          <MessagesArea>
            <MessageList>
              {messages.map((message, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', px: 0, py: 0.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: message.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1.5, maxWidth: '80%' }}>
                    <Tooltip title={message.remitenteNombre || 'Anónimo'} placement="top">
                      <Avatar sx={{ bgcolor: message.sender === 'user' ? '#00F5D4' : '#1B263B' }}>
                        {(message.remitenteNombre)?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    </Tooltip>
                    <MessageBubble owner={message.sender}>
                      <Typography variant="body1">{message.text}</Typography>
                      <Timestamp>
                        {formatTimestamp(message.timestamp)}
                      </Timestamp>
                    </MessageBubble>
                  </Box>
                </ListItem>
              ))}
            </MessageList>
          </MessagesArea>
          
          <MessageInputContainer>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <StyledTextField fullWidth multiline maxRows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe un mensaje..." variant="outlined" size="small" />
              <SendButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendIcon />
              </SendButton>
            </Box>
          </MessageInputContainer>
        </>
      )}
    </ChatContainer>
  );
};

export default ChatWindow;