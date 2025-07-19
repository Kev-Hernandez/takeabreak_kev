import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
    width: '95%', // Cambiado de vw a % para mejor control
    maxWidth: '1200px',
    margin: '20px auto', // Margen vertical fijo
    px: { xs: 1, sm: 2, md: 3 },
    py: { xs: 1.5, sm: 2 }, // Padding vertical reducido
    bgcolor: '#f9f9fb',
    borderRadius: 3,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 2, sm: 2.5 }, // Gap reducido
    flex: '0 1 auto', // No crecer más allá de su contenido
    overflow: 'visible', // Quitamos el scroll interno
    boxSizing: 'border-box',
    alignSelf: 'center', // Centrado adicional
    maxHeight: 'calc(100vh - 40px)', // Altura máxima menos márgenes
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
    p: { xs: 1, sm: 2 },
    borderRadius: 3,
    bgcolor: 'white',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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

  {filteredUsers.length === 0 ? (
    <Typography
      variant="body1"
      sx={{ 
        textAlign: 'center', 
        py: 4, 
        color: '#555',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      No hay usuarios activos en este momento
    </Typography>
  ) : (
    <Box sx={{ 
      width: '100%',
      overflowX: 'auto',
      '-webkit-overflow-scrolling': 'touch',
      '&::-webkit-scrollbar': { height: '8px' },
      '&::-webkit-scrollbar-thumb': { 
        backgroundColor: '#1976d2', 
        borderRadius: '4px' 
      },
      pb: 2
    }}>
      {/* Contenedor principal del carrusel con 2 filas */}
      <Box sx={{
        display: 'inline-grid',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(2, auto)',
        gap: 3,
        px: 1,
      }}>
        {filteredUsers.map((user) => (
          <Paper
            key={user._id}
            elevation={3}
            sx={{
              width: 180, // Ancho ligeramente mayor para mejor visualización
              p: 2,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
              }
            }}
          >
            {/* Badge con estado de conexión */}
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color={isUserOnline(user) ? 'success' : 'default'}
              sx={{ 
                '& .MuiBadge-badge': {
                  boxShadow: '0 0 0 2px white',
                }
              }}
            >
              <Avatar
                src={user.fotoUrl || ''}
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: '#1565c0',
                  fontWeight: 700,
                  fontSize: '1.4rem'
                }}
              >
                {!user.fotoUrl && getInitials(user)}
              </Avatar>
            </Badge>

            {/* Nombre completo */}
            <Typography 
              variant="subtitle1" 
              fontWeight="bold" 
              sx={{ 
                mt: 1.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {user.nombre} {user.apellido}
            </Typography>

            {/* Email */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {user.email}
            </Typography>

            {/* Botón de chat */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/chat/${user._id}`)}
              sx={{
                mt: 2,
                borderRadius: 4,
                px: 3,
                fontWeight: '600',
                color: '#1565c0',
                borderColor: '#1565c0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#1565c0',
                  color: 'white',
                  boxShadow: '0 6px 12px rgba(21, 101, 192, 0.3)',
                }
              }}
            >
              Chatear
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
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
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseProfile}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
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
