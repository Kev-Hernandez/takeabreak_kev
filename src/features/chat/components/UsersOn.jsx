import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, ListItemButton } from '@mui/material';
import { useChatContext } from '../../../context/ChatContext';

const UsersOn = ({ onUserSelected }) => {
  const { users, currentUserId, handleSelectUser } = useChatContext();

  const handleUserClick = (user) => {
    handleSelectUser(user);
    if (onUserSelected) onUserSelected(); // Cierra el drawer al seleccionar
  }

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>Usuarios activos</Typography>
      {users.length > 0 ? (
        <List>
          {users.map((user, index) => (
            <ListItem 
              key={user._id || index} 
              disablePadding
              sx={{ opacity: user._id === currentUserId ? 0.5 : 1 }}
            >
              <ListItemButton
                onClick={() => handleUserClick(user)}
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