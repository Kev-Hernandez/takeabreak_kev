import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Button,
  Divider,
  ButtonGroup 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/web/usuarios/activos');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ButtonGroup variant="contained" aria-label="navigation button group">
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Inicio
          </Button>
          <Button
            startIcon={<AccountCircleIcon />}
            onClick={() => navigate('/profile')}
          >
            Mi Perfil
          </Button>
        </ButtonGroup>
      </Box>

      {/* Chat options */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ChatIcon />}
          onClick={() => navigate('/chat')}
          sx={{ py: 2 }}
        >
          Unirse al Chat General
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Chats Privados
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        {/* Rest of the users list remains the same */}
        <List>
          {users.map((user) => (
            <ListItem 
              key={user._id}
              button 
              onClick={() => navigate(`/chat/${user._id}`)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={`${user.nombre} ${user.apellido}`}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>

        {users.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            No hay usuarios activos en este momento
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UsersList;