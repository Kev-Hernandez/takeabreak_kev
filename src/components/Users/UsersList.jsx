import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogContent,
  IconButton,
  Drawer,
  InputAdornment,
  Badge,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';

// Íconos que te faltaban importar
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SearchIcon from '@mui/icons-material/Search';

import Profile from './Profile';
import Chat from '../chat/Chat';
import UsersOn from '../chat/UsersOn';
 // Asegúrate que la ruta sea correcta

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para drawer usuarios activos
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/web/usuarios/activos');
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleSelectChat = (user) => {
    setSelectedUser(user);
  };

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  // Funciones para abrir/cerrar drawer de usuarios activos
  const handleOpenActiveUsers = () => {
    setShowActiveUsers(true);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Al seleccionar usuario desde drawer de usuarios activos
  const handleSelectUserFromDrawer = (user) => {
    setSelectedUser(user);
    handleCloseDrawer();
  };

  

  return (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      bgcolor: 'background.default',
    }}
  >
    {/* MENÚ LATERAL - ESTILO MINIMALISTA */}
    <Box
      sx={{
        width: menuOpen ? 240 : 72,
        bgcolor: 'primary.dark',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: menuOpen ? 'flex-start' : 'center',
        gap: 1,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={() => setMenuOpen(!menuOpen)}
        sx={{
          mb: 2,
          color: 'common.white',
          alignSelf: menuOpen ? 'flex-end' : 'center',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        {menuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      {[
        { icon: <HomeIcon />, text: 'Inicio', action: () => navigate('/') },
        { icon: <AccountCircleIcon />, text: 'Perfil', action: handleOpenProfile },
        { icon: <GroupIcon />, text: 'Usuarios activos', action: handleOpenActiveUsers }
      ].map((item, index) => (
        <Button
          key={index}
          startIcon={item.icon}
          variant="text"
          onClick={item.action}
          sx={{
            width: '100%',
            px: menuOpen ? 2 : 1,
            py: 1.5,
            justifyContent: menuOpen ? 'flex-start' : 'center',
            color: 'common.white',
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {menuOpen && (
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              {item.text}
            </Typography>
          )}
        </Button>
      ))}
    </Box>

    {/* COLUMNA DE CHATS - ESTILO MODERNO */}
    <Box
      sx={{
        flex: 1,
        maxWidth: 380,
        p: 3,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontWeight: 600,
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ChatBubbleOutlineIcon /> Chats
      </Typography>

      <TextField
        label="Buscar contactos"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'background.default'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <Box sx={{ 
        overflowY: 'auto', 
        flex: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'primary.light',
          borderRadius: 3,
        }
      }}>
        {filteredUsers.map((user) => (
          <Box
            key={user._id}
            onClick={() => handleSelectChat(user)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              bgcolor: selectedUser?._id === user._id ? 'primary.light' : 'transparent',
              '&:hover': {
                bgcolor: selectedUser?._id === user._id ? 'primary.light' : 'action.hover',
              },
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
              sx={{
                '& .MuiBadge-badge': {
                  boxShadow: '0 0 0 2px white',
                }
              }}
            >
              <Avatar 
                src={user.profilePicture} 
                alt={user.nombre}
                sx={{ 
                  width: 48, 
                  height: 48,
                  bgcolor: 'primary.main',
                }}
              />
            </Badge>
            {menuOpen && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" noWrap sx={{ color: 'black' }}>
                  {user.nombre} {user.apellido}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.lastMessage || 'Chatear'}
                </Typography>
              </Box>
            )}
            {!menuOpen && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" noWrap sx={{ color: 'black' }}>
                  {user.nombre} {user.apellido}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.lastMessage || 'Chatear'}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>

    {/* ÁREA DE CHAT PRINCIPAL */}
    <Box
      sx={{
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      {selectedUser ? (
        <Chat
          recipientUser={selectedUser}
          style={{ flex: 1 }}
        />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center',
          }}
        >
          <ChatBubbleIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            Selecciona un chat
          </Typography>
          <Typography variant="body1" color="text.disabled">
            Elige un contacto para comenzar la conversación
          </Typography>
        </Box>
      )}
    </Box>

{/* MODAL DE PERFIL - FONDO TRANSPARENTE */}
<Dialog
  open={openProfile}
  onClose={handleCloseProfile}
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: 'transparent',  // fondo transparente
      boxShadow: 'none',                // quitar sombra para mayor transparencia
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.57)', // opcional: fondo oscuro semi-transparente detrás del modal
    },
  }}
>
  <Profile />
</Dialog>

    {/* DRAWER USUARIOS ACTIVOS - ESTILO MODERNO */}
    <Drawer 
      anchor="right" 
      open={drawerOpen} 
      onClose={handleCloseDrawer}
      PaperProps={{
        sx: {
          width: 350,
          p: 3,
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Usuarios activos
        </Typography>
        <IconButton onClick={handleCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      <UsersOn
        users={filteredUsers}
        onSelectUser={handleSelectUserFromDrawer}
        currentUserId={null}
      />
    </Drawer>
  </Box>
);
};

export default UsersList;
