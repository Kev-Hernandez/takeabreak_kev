// fileName: src/features/chat/components/UsersOn.jsx (VERSIÓN FINAL)

import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, ListItemButton } from '@mui/material';
import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext'; // <-- 1. Importa el contexto del tema

const UsersOn = ({ onUserSelected }) => {
  const { users, currentUserId, handleSelectUser } = useChatContext();
  const { setThemeMode } = useThemeContext(); // <-- 2. Obtiene la función para cambiar el tema

  const handleUserClick = (user) => {
    handleSelectUser(user);
    setThemeMode('neutral'); // <-- 3. Resetea el tema
    if (onUserSelected) onUserSelected(); 
  }

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>Usuarios activos</Typography>
      {users.length > 0 ? (
        <List>
          {users.map((user) => (
            <ListItem 
              key={user._id} 
              disablePadding
              sx={{ opacity: user._id === currentUserId ? 0.5 : 1 }}
            >
              <ListItemButton
                onClick={() => handleUserClick(user)} // <-- 4. Llama a la nueva función
                disabled={user._id === currentUserId}
              >
                <ListItemText 
                  primary={`${user.nombre} ${user.apellido}`}
                  secondary={user._id === currentUserId ? '(Tú)' : ''}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No hay usuarios activos.</Typography>
      )}
    </Box>
  );
};

export default UsersOn;