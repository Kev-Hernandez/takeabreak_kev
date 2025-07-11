import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  ListItemButton 
} from '@mui/material';

const UsersOn = ({ users, onSelectUser, currentUserId }) => {
  const handleUserSelect = (selectedUser) => {
    // No permitir seleccionarse a sí mismo
    if (selectedUser._id !== currentUserId) {
      onSelectUser(selectedUser);
    }
  };

  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>Usuarios activos</Typography>
      {users.length > 0 ? (
        <List>
          {users.map((user, index) => (
            <ListItem 
              key={user._id || index} 
              disablePadding
              sx={{
                opacity: user._id === currentUserId ? 0.5 : 1,
                cursor: user._id === currentUserId ? 'default' : 'pointer'
              }}
            >
              <ListItemButton
                onClick={() => handleUserSelect(user)}
                disabled={user._id === currentUserId}
              >
                <ListItemText 
                  primary={user.nombre || user.email || `Usuario ${index + 1}`}
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
