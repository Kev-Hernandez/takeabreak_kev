import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const UsersOn = ({ users }) => {
  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>Usuarios activos</Typography>
      {users.length > 0 ? (
        <List>
          {users.map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={user.nombre || user.email || `Usuario ${index + 1}`} />
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
