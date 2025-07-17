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
  TextField,
  CircularProgress,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import Profile from './Profile';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/web/usuarios/activos');
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const getInitials = (user) => {
    return (user.nombre[0] || '') + (user.apellido[0] || '');
  };

  const isUserOnline = (user) => {
    return user._id.charCodeAt(0) % 2 === 0;
  };

  // Función para abrir modal perfil
  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

  // Función para cerrar modal perfil
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
  <Box
    sx={{
      maxWidth: 720,
      margin: '30px auto',
      p: 4,
      bgcolor: '#f9f9fb',
      borderRadius: 3,
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    {/* Navegación superior */}
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
      <Button
        variant="outlined"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        sx={{
          borderRadius: 5,
          px: 3,
          py: 1.5,
          fontWeight: '600',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#1976d2',
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.6)',
            transform: 'scale(1.05)',
          },
        }}
      >
        Inicio
      </Button>

      <Button
        variant="outlined"
        startIcon={<AccountCircleIcon />}
        onClick={handleOpenProfile}
        sx={{
          borderRadius: 5,
          px: 3,
          py: 1.5,
          fontWeight: '600',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#1976d2',
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.6)',
            transform: 'scale(1.05)',
          },
        }}
      >
        Mi Perfil
      </Button>
    </Box>

    {/* Botón de chat general */}
    <Button
      variant="contained"
      startIcon={<ChatIcon />}
      onClick={() => navigate('/chat')}
      sx={{
        mx: 'auto',
        width: '100%',
        maxWidth: 380,
        py: 2,
        fontWeight: '700',
        fontSize: '1.1rem',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.7)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.07)',
          boxShadow: '0 10px 24px rgba(25, 118, 210, 0.9)',
        },
      }}
    >
      Unirse al Chat General
    </Button>

    {/* Buscador de usuarios */}
    <TextField
      fullWidth
      label="Buscar usuario por nombre o email"
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchChange}
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
      }}
    />

    {/* Lista de usuarios (chats privados) */}
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: '#0d47a1',
          fontWeight: 'bold',
          letterSpacing: 1,
        }}
      >
        Chats Privados
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress color="primary" size={36} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', py: 4, color: '#555' }}
        >
          No hay usuarios activos en este momento
        </Typography>
      ) : (
        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user._id}
              button
              onClick={() => navigate(`/chat/${user._id}`)}
              sx={{
                mb: 2,
                borderRadius: 3,
                transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': {
                  backgroundColor: '#e8f0fe',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.25)',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color={isUserOnline(user) ? 'success' : 'default'}
                  sx={{ boxShadow: '0 0 0 2px white' }}
                >
                  <Avatar
                    src={user.fotoUrl || ''}
                    alt={`${user.nombre} ${user.apellido}`}
                    sx={{ bgcolor: '#1565c0', fontWeight: '700' }}
                  >
                    {!user.fotoUrl && getInitials(user)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={`${user.nombre} ${user.apellido}`}
                secondary={user.email}
                sx={{ ml: 3 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${user._id}`);
                }}
                sx={{
                  borderRadius: 4,
                  px: 3,
                  fontWeight: '600',
                  color: '#1565c0',
                  borderColor: '#1565c0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    color: 'white',
                    borderColor: '#1565c0',
                    boxShadow: '0 6px 12px rgba(21, 101, 192, 0.7)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Chatear
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>

    {/* Modal de perfil */}
    <Dialog
      open={openProfile}
      onClose={handleCloseProfile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          bgcolor: '#fdfdfd',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.3s ease-in-out',
        },
      }}
    ><DialogTitle>
  <IconButton
    aria-label="close"
    onClick={handleCloseProfile}
    sx={{ position: 'absolute', right: 8, top: 8 }}
  > <CloseIcon />
  </IconButton>
      </DialogTitle>
        <DialogContent>
            <Profile />
        </DialogContent>
    </Dialog>
  </Box>
);
};

export default UsersList;
