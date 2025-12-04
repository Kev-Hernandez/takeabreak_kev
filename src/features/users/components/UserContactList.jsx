// src/features/users/components/UserContactList.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, TextField, InputAdornment, Avatar, Typography, IconButton, Badge, Tooltip, CircularProgress
} from '@mui/material';
import { Search, Add, Check, Close, ChatBubbleOutline } from '@mui/icons-material';

// 1. Importamos el Diseño Nuevo y Constantes
import GlassCard from '../../../components/common/GlassCard';
import { APP_COLORS } from '../../../utils/constants';

// 2. Importamos tu Lógica y Contextos
import apiClient from '../../../api/apiClient';
import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext';

const UserContactList = () => {
  // --- LÓGICA ORIGINAL (RECUPERADA) ---
  const { users, selectedUser, handleSelectUser, currentUserId } = useChatContext();
  const { setThemeMode } = useThemeContext(); 
  
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  // Estados para datos externos (Explorar / Solicitudes)
  const [allUsers, setAllUsers] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Carga inicial de datos
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingExplore(true);
      try {
        const response = await apiClient.get('/api/v1/users/');
        setAllUsers(response.data);
      } catch (err) {
        console.error("Error cargando usuarios", err);
      } finally {
        setLoadingExplore(false);
      }
    };

    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const response = await apiClient.get('/api/v1/friends/requests');
        setRequests(response.data);
      } catch (err) {
        console.error("Error cargando solicitudes", err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchAllUsers();
    fetchRequests();
  }, []);

  // --- HANDLERS (RECUPERADOS) ---

  const handleSendRequest = async (recipientId) => {
    try {
      const response = await apiClient.post('/api/v1/friends/request', { recipientId });
      alert(response.data.message);
      // Actualizamos la lista localmente para no recargar
      setAllUsers(prev => prev.filter(u => u._id !== recipientId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al enviar solicitud.');
    }
  };

  const handleRequestResponse = async (senderId, action) => {
    const endpoint = action === 'accept' ? '/api/v1/friends/accept' : '/api/v1/friends/reject';
    try {
      await apiClient.post(endpoint, { senderId });
      setRequests(prev => prev.filter(req => req.sender._id !== senderId));
      // Nota: Si aceptas, deberías idealmente recargar 'users' del contexto, 
      // pero por ahora actualizamos la UI local.
    } catch (err) {
      alert('No se pudo procesar la solicitud.');
    }
  };

  const handleUserClick = (user) => {
    handleSelectUser(user);
    setThemeMode('neutral'); // Resetea el tema al cambiar de chat
  };

  // --- FILTROS ---
  const lowerSearch = search.toLowerCase();

  // 1. Amigos (Vienen del Contexto)
  const filteredFriends = users.filter(u => 
    (u.nombre.toLowerCase().includes(lowerSearch) || u.apellido.toLowerCase().includes(lowerSearch)) &&
    u._id !== currentUserId
  );

  // 2. Explorar (Todos - Amigos - Yo)
  const friendIds = new Set(users.map(u => u._id));
  friendIds.add(currentUserId);
  const filteredExplore = allUsers
    .filter(u => !friendIds.has(u._id))
    .filter(u => 
      u.nombre.toLowerCase().includes(lowerSearch) || u.apellido.toLowerCase().includes(lowerSearch)
    );

  // 3. Solicitudes
  const filteredRequests = requests.filter(req => 
    req.sender.nombre.toLowerCase().includes(lowerSearch) || 
    req.sender.apellido.toLowerCase().includes(lowerSearch)
  );


  // --- RENDERIZADO (DISEÑO NUEVO) ---
  
  // Función auxiliar para renderizar items con el estilo CRISTAL
  const renderItem = (user, type, extraActions = null) => (
    <Box 
      key={user._id}
      onClick={type === 'friend' ? () => handleUserClick(user) : undefined}
      sx={{
        display: 'flex', alignItems: 'center', p: 1.5, mb: 1, borderRadius: '15px',
        cursor: type === 'friend' ? 'pointer' : 'default',
        bgcolor: selectedUser?._id === user._id ? 'rgba(255,255,255,0.25)' : 'transparent',
        border: selectedUser?._id === user._id ? `1px solid ${APP_COLORS.glassBorder}` : '1px solid transparent',
        transition: 'all 0.2s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', transform: 'translateX(4px)' }
      }}
    >
      <Badge variant="dot" color="success" invisible={type !== 'friend'}>
        <Avatar 
            src={user.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${user.avatar}` : ''} 
            sx={{ width: 42, height: 42, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
            {user.nombre[0]}
        </Avatar>
      </Badge>
      
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 600, color: 'white' }}>
            {user.nombre} {user.apellido}
        </Typography>
        {type === 'friend' && (
            <Typography variant="caption" sx={{ color: APP_COLORS.textDim, display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <ChatBubbleOutline sx={{ fontSize: 12 }}/> Chatear
            </Typography>
        )}
      </Box>

      {/* Botones de Acción (Agregar, Aceptar, Rechazar) */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {extraActions}
      </Box>
    </Box>
  );

  return (
    <GlassCard>
      {/* 1. HEADER CON TABS BLANCOS */}
      <Box sx={{ borderBottom: `1px solid ${APP_COLORS.glassBorder}` }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => { setTab(v); setSearch(''); }} 
          variant="fullWidth"
          sx={{ 
            minHeight: '48px',
            '& .MuiTabs-indicator': { bgcolor: APP_COLORS.secondary, height: '3px', borderRadius: '3px' },
            '& .MuiTab-root': { 
                color: 'rgba(255,255,255,0.6)', 
                textTransform: 'none', 
                fontWeight: 700,
                transition: '0.3s',
                '&.Mui-selected': { color: 'white' }
            }
          }}
        >
          <Tab label="Amigos" />
          <Tab label="Explorar" />
          <Tab 
            label={
              <Badge badgeContent={requests.length} color="error" sx={{ '& .MuiBadge-badge': { right: -12, top: 2 } }}>
                Solicitudes
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* 2. BARRA DE BÚSQUEDA TRANSPARENTE */}
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField
          fullWidth 
          placeholder={`Buscar en ${['amigos', 'todo el mundo', 'solicitudes'][tab]}...`}
          variant="outlined" 
          size="small"
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px', 
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: APP_COLORS.secondary }
            }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.7)' }}/></InputAdornment>
          }}
        />
      </Box>

      {/* 3. LISTA DE USUARIOS (SCROLL INTERNO) */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        px: 2, 
        pb: 2,
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }
      }}>
        
        {/* CASO 0: AMIGOS */}
        {tab === 0 && (
            filteredFriends.length > 0 ? filteredFriends.map(u => renderItem(u, 'friend')) : 
            <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No se encontraron amigos.</Typography>
        )}

        {/* CASO 1: EXPLORAR */}
        {tab === 1 && (
            loadingExplore ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="inherit" /></Box> :
            filteredExplore.length > 0 ? filteredExplore.map(u => renderItem(u, 'explore', (
                <Tooltip title="Enviar Solicitud">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSendRequest(u._id); }} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: APP_COLORS.secondary } }}>
                        <Add fontSize="small"/>
                    </IconButton>
                </Tooltip>
            ))) : <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No hay usuarios nuevos.</Typography>
        )}

        {/* CASO 2: SOLICITUDES */}
        {tab === 2 && (
            loadingRequests ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="inherit" /></Box> :
            filteredRequests.length > 0 ? filteredRequests.map(req => renderItem(req.sender, 'request', (
                <>
                    <Tooltip title="Aceptar">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRequestResponse(req.sender._id, 'accept'); }} sx={{ bgcolor: 'rgba(0,255,0,0.1)', color: '#4caf50', border: '1px solid #4caf50', '&:hover': { bgcolor: '#4caf50', color: 'white' } }}>
                            <Check fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rechazar">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRequestResponse(req.sender._id, 'reject'); }} sx={{ bgcolor: 'rgba(255,0,0,0.1)', color: '#f44336', border: '1px solid #f44336', '&:hover': { bgcolor: '#f44336', color: 'white' } }}>
                            <Close fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </>
            ))) : <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No tienes solicitudes pendientes.</Typography>
        )}

      </Box>
    </GlassCard>
  );
};

export default UserContactList;