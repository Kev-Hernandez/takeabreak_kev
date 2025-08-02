import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Drawer,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import Profile from './Profile';
import Chat from '../chat/Chat';
import UsersOn from '../chat/UsersOn'; // Asegúrate que la ruta sea correcta

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
        flexDirection: 'row',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: '#f3f3e5ff',
      }}
    >
      {/* MENÚ LATERAL HAMBURGUESA */}
      <Box
        sx={{
          width: menuOpen ? 220 : 60,
          bgcolor: '#f3f3e5ff',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: menuOpen ? 'flex-start' : 'center',
          gap: 3,
          boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease',
        }}
      >
        <Box
          sx={{
            mt: 2,
            mb: 2,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: menuOpen ? 'flex-end' : 'center',
            width: '100%',
            color: '#1976d2',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          title={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <MenuIcon />
        </Box>

        <Button
          startIcon={<HomeIcon />}
          variant="text"
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: menuOpen ? 'flex-start' : 'center',
            width: '100%',
            px: menuOpen ? 4 : 0,
          }}
          title="Inicio"
        >
          {menuOpen && 'Inicio'}
        </Button>

        <Button
          startIcon={<AccountCircleIcon />}
          variant="text"
          onClick={handleOpenProfile}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: menuOpen ? 'flex-start' : 'center',
            width: '100%',
            px: menuOpen ? 4 : 0,
          }}
          title="Perfil"
        >
          {menuOpen && 'Perfil'}
        </Button>

        <Button
          startIcon={<GroupIcon />}
          variant="text"
          onClick={handleOpenActiveUsers}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: menuOpen ? 'flex-start' : 'center',
            width: '100%',
            px: menuOpen ? 4 : 0,
          }}
          title="Usuarios activos"
        >
          {menuOpen && 'Usuarios activos'}
        </Button>
      </Box>

      {/* COLUMNA CENTRAL: CHATS */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 360,
          p: 2,
          borderRight: '1px solid #ddd',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
          Chats
        </Typography>

        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Box sx={{ overflowY: 'auto', flex: 1 }}>
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
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <Avatar src={user.profilePicture} alt={user.nombre} />
              <Typography variant="body1" sx={{ color: '#333' }}>
                {user.nombre} {user.apellido}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* PANEL DERECHO */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column', // para que Chat pueda crecer verticalmente
          bgcolor: '#f3f3e5ff',
          minWidth: 0, // para prevenir overflow
        }}
      >
        {selectedUser ? (
          <Chat
            recipientUser={selectedUser}
            style={{ width: '100%', flex: 1 }}
          />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Selecciona un usuario para comenzar a chatear.
            </Typography>
          </Box>
        )}
      </Box>

      {/* MODAL DE PERFIL */}
      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            bgcolor: '#f3f3e5ff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
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

      {/* DRAWER USUARIOS ACTIVOS */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <UsersOn
          users={filteredUsers}
          onSelectUser={handleSelectUserFromDrawer}
          currentUserId={null} // Si tienes el ID del usuario actual, pásalo aquí
        />
      </Drawer>
    </Box>
  );
};

export default UsersList;
