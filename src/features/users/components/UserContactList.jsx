// fileName: src/features/users/components/UserContactList.jsx (VERSIÓN CON TABS)

import React, { useState, useEffect } from 'react';
import { 
  InputAdornment, Badge, Typography, Divider, Box, AppBar, Tabs, Tab 
} from '@mui/material'; // 1. Importamos Tabs, Tab, AppBar, Box
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../../../api/apiClient';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';   // 2. Icono para Aceptar
import CloseIcon from '@mui/icons-material/Close'; // 2. Icono para Rechazar

import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext';

import {
  ListContainer, Header, SearchTextField, ContactList, ContactItem, StyledAvatar
} from './UserContactList.styles';

const UserContactList = () => {
  // 3. Quitamos handleSearchChange, la búsqueda será 100% local
  const { users, selectedUser, handleSelectUser, currentUserId } = useChatContext();
  const { setThemeMode } = useThemeContext(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0); // 4. Estado para la pestaña activa

  // Estado para la pestaña "Explorar"
  const [allUsers, setAllUsers] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [errorExplore, setErrorExplore] = useState('');

  // 5. Nuevo estado para la pestaña "Solicitudes"
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState('');

  // 6. useEffect ahora carga AMBAS listas (explorar y solicitudes)
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingExplore(true);
      setErrorExplore('');
      try {
        const response = await apiClient.get('/api/v1/users/');
        setAllUsers(response.data);
      } catch (err) {
        setErrorExplore('No se pudieron cargar los usuarios.');
      } finally {
        setLoadingExplore(false);
      }
    };

    const fetchRequests = async () => {
      setLoadingRequests(true);
      setErrorRequests('');
      try {
        // !!! (NECESITAS CREAR ESTE ENDPOINT)
        const response = await apiClient.get('/api/v1/friends/requests');
        setRequests(response.data);
      } catch (err) {
        setErrorRequests('No se pudieron cargar las solicitudes.');
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchAllUsers();
    fetchRequests();
  }, []);

  // --- Handlers de Acciones ---

  const handleSendRequest = async (recipientId) => {
    try {
      const response = await apiClient.post('/api/v1/friends/request', { recipientId });
      alert(response.data.message);
      setAllUsers(prevUsers => prevUsers.filter(u => u._id !== recipientId));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo enviar la solicitud.');
    }
  };

  // 7. Nuevos Handlers para Aceptar/Rechazar (NECESITAS CREAR ESTOS ENDPOINTS)
  const handleRequestResponse = async (senderId, action) => {
    const endpoint = action === 'accept' ? '/api/v1/friends/accept' : '/api/v1/friends/reject';
    try {
      await apiClient.post(endpoint, { senderId });
      // Si fue exitoso, elimina la solicitud de la lista local
      setRequests(prev => prev.filter(req => req.sender._id !== senderId));
      alert(`Solicitud ${action === 'accept' ? 'aceptada' : 'rechazada'}`);
      // Idealmente, si aceptas, también deberías refrescar la lista de amigos (users)
    } catch (err) {
      alert('No se pudo procesar la solicitud.');
    }
  };


  // --- Handlers de UI ---

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Búsqueda ahora es solo local
  };

  const handleTabChange = (event, newValue) => {
    setSearchTerm(''); // Resetea la búsqueda al cambiar de pestaña
    setCurrentTab(newValue);
  };

  const handleUserClick = (user) => {
    handleSelectUser(user);
    setThemeMode('neutral');
  };

  // --- Lógica de Filtrado ---
  
  const lowerSearchTerm = searchTerm.toLowerCase();

  // A. Filtramos Amigos
  const filteredFriends = users
    .filter(u => u._id !== currentUserId)
    .filter(u =>
      u.nombre.toLowerCase().includes(lowerSearchTerm) ||
      u.apellido.toLowerCase().includes(lowerSearchTerm)
    );

  // B. Filtramos Globales (Excluyendo amigos y a sí mismo)
  const friendIds = new Set(users.map(u => u._id));
  friendIds.add(currentUserId); 
  
  const filteredGlobal = allUsers
    .filter(u => !friendIds.has(u._id))
    .filter(u =>
      u.nombre.toLowerCase().includes(lowerSearchTerm) ||
      u.apellido.toLowerCase().includes(lowerSearchTerm)
    );

  // C. Filtramos Solicitudes (asumiendo que el sender es un objeto)
  const filteredRequests = requests.filter(req =>
    req.sender.nombre.toLowerCase().includes(lowerSearchTerm) ||
    req.sender.apellido.toLowerCase().includes(lowerSearchTerm)
  );

  // --- Componente de Renderizado de Lista ---

  const renderListContent = () => {
    if (currentTab === 0) { // Amigos
      return filteredFriends.map((user) => (
        <ContactItem
          key={user._id}
          onClick={() => handleUserClick(user)}
          isSelected={selectedUser?._id === user._id}
        >
          <Badge variant="dot" color="success">
            <StyledAvatar src={user.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${user.avatar}` : ''} alt={user.nombre} />
          </Badge>
          <div>
            <Typography variant="subtitle2" sx={{ color: '#E0E1DD' }}>{user.nombre} {user.apellido}</Typography>
            <Typography variant="caption" sx={{ color: '#A9A9A9' }}>Chatear</Typography>
          </div>
        </ContactItem>
      ));
    }

    if (currentTab === 1) { // Explorar
      if (loadingExplore) return <Typography sx={{ p: 2, color: '#A9A9A9' }}>Cargando...</Typography>;
      if (errorExplore) return <Typography sx={{ p: 2, color: 'error.main' }}>{errorExplore}</Typography>;
      return filteredGlobal.map((user) => (
        <ContactItem key={user._id} isSelected={false}>
          <StyledAvatar src={user.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${user.avatar}` : ''} alt={user.nombre} />
          <div style={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#E0E1DD' }}>{user.nombre} {user.apellido}</Typography>
          </div>
          <IconButton title="Enviar solicitud" size="small" onClick={() => handleSendRequest(user._id)}>
            <AddIcon fontSize="small" sx={{ color: '#E0E1DD' }} />
          </IconButton>
        </ContactItem>
      ));
    }

    if (currentTab === 2) { // Solicitudes
      if (loadingRequests) return <Typography sx={{ p: 2, color: '#A9A9A9' }}>Cargando...</Typography>;
      if (errorRequests) return <Typography sx={{ p: 2, color: 'error.main' }}>{errorRequests}</Typography>;
      if (filteredRequests.length === 0) return <Typography sx={{ p: 2, color: '#A9A9A9' }}>No hay solicitudes pendientes.</Typography>;
      
      return filteredRequests.map((req) => (
        <ContactItem key={req._id} isSelected={false}>
          <StyledAvatar src={req.sender.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${req.sender.avatar}` : ''} alt={req.sender.nombre} />
          <div style={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#E0E1DD' }}>{req.sender.nombre} {req.sender.apellido}</Typography>
          </div>
          <IconButton title="Aceptar" size="small" onClick={() => handleRequestResponse(req.sender._id, 'accept')}>
            <CheckIcon fontSize="small" sx={{ color: '#00F5D4' }} />
          </IconButton>
          <IconButton title="Rechazar" size="small" onClick={() => handleRequestResponse(req.sender._id, 'reject')}>
            <CloseIcon fontSize="small" sx={{ color: '#FF4136' }} />
          </IconButton>
        </ContactItem>
      ));
    }
    return null;
  };

  return (
    <ListContainer>
      {/* 8. Reemplazamos el Header por la barra de Pestañas (Tabs) */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'transparent', // Fondo transparente
          boxShadow: 'none', // Sin sombra
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)' // Borde sutil
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary" // Color del indicador
          textColor="inherit"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#00F5D4', // Color de la línea de abajo
            },
            '& .MuiTab-root': {
              color: '#A9A9A9', // Color del texto
              minWidth: 'auto',
              fontSize: '0.8rem',
            },
            '& .Mui-selected': {
              color: '#FFFFFF !important', // Color del texto seleccionado
            },
          }}
        >
          <Tab label="Amigos" />
          <Tab label="Explorar" />
          <Tab 
            label="Solicitudes" 
            icon={
              requests.length > 0 ? 
              <Badge badgeContent={requests.length} color="error" sx={{ ml: 1.5 }} /> : 
              null
            } 
            iconPosition="end"
            sx={{ flexDirection: 'row-reverse', gap: '4px' }}
          />
        </Tabs>
      </AppBar>
      
      <SearchTextField
        label={`Buscar en ${['Amigos', 'Explorar', 'Solicitudes'][currentTab]}...`}
        variant="outlined"
        fullWidth
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        value={searchTerm}
        onChange={handleSearch}
      />
      
      <ContactList>
        {renderListContent()}
      </ContactList>
    </ListContainer>
  );
};

export default UserContactList;