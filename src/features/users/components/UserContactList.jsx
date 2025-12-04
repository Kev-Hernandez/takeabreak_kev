// src/features/users/components/UserContactList.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, TextField, InputAdornment, Avatar, Typography, IconButton, Badge, Tooltip, CircularProgress
} from '@mui/material';
import { Search, Add, Check, Close, ChatBubbleOutline, AutoAwesome } from '@mui/icons-material';

import GlassCard from '../../../components/common/GlassCard';
import { APP_COLORS, THEME_COLORS } from '../../../utils/constants';

import apiClient from '../../../api/apiClient';
import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext';

const UserContactList = () => {
  // 1. Traemos vibeMap del contexto (donde se guardan las emociones en vivo)
  const { users, selectedUser, handleSelectUser, currentUserId, vibeMap } = useChatContext();
  const { setThemeMode } = useThemeContext(); 
  
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingExplore(true);
      try {
        const response = await apiClient.get('/api/v1/users/');
        setAllUsers(response.data);
      } catch (err) { console.error(err); } finally { setLoadingExplore(false); }
    };
    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const response = await apiClient.get('/api/v1/friends/requests');
        setRequests(response.data);
      } catch (err) { console.error(err); } finally { setLoadingRequests(false); }
    };
    fetchAllUsers();
    fetchRequests();
  }, []);

  const handleSendRequest = async (recipientId) => {
    try {
      const res = await apiClient.post('/api/v1/friends/request', { recipientId });
      alert(res.data.message);
      setAllUsers(prev => prev.filter(u => u._id !== recipientId));
    } catch (err) { alert('Error al enviar solicitud'); }
  };

  const handleRequestResponse = async (senderId, action) => {
    const endpoint = action === 'accept' ? '/api/v1/friends/accept' : '/api/v1/friends/reject';
    try {
      await apiClient.post(endpoint, { senderId });
      setRequests(prev => prev.filter(req => req.sender._id !== senderId));
    } catch (err) { alert('Error al procesar solicitud'); }
  };

  const handleUserClick = (user) => {
    handleSelectUser(user);
    // Al cambiar de chat, tu sidebar vuelve a mostrar TU estado (o neutro si prefieres)
    // No cambiamos el setThemeMode aquí para mantener tu vibe personal persistente.
  };

  const lowerSearch = search.toLowerCase();
  
  // Filtros
  const filteredFriends = users.filter(u => 
    (u.nombre.toLowerCase().includes(lowerSearch) || u.apellido.toLowerCase().includes(lowerSearch)) && 
    u._id !== currentUserId
  );
  
  const friendIds = new Set(users.map(u => u._id));
  friendIds.add(currentUserId);
  
  const filteredExplore = allUsers.filter(u => 
    !friendIds.has(u._id) && 
    (u.nombre.toLowerCase().includes(lowerSearch) || u.apellido.toLowerCase().includes(lowerSearch))
  );
  
  const filteredRequests = requests.filter(req => 
    req.sender.nombre.toLowerCase().includes(lowerSearch)
  );

  // --- RENDERIZADO DEL ÍTEM ---
  const renderItem = (user, type, extraActions = null) => {
    
    // A) LOGICA DE VIBE REAL
    // 1. Buscamos si hay una emoción "en vivo" (vibeMap)
    // 2. Si no, usamos la de la base de datos (user.emocion)
    // 3. Si no, default.
    const liveVibe = vibeMap[user._id];
    const dbVibe = user.emocion?.trim();
    
    const rawEmotion = liveVibe || dbVibe || 'default';
    const isNeutral = rawEmotion === 'neutral' || rawEmotion === 'default';
    
    // Configuración visual
    const emotionColor = THEME_COLORS[rawEmotion] || 'transparent';
    const emotionName = rawEmotion.charAt(0).toUpperCase() + rawEmotion.slice(1);

    return (
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
        {/* AVATAR + BOLITA DE ESTADO */}
        <Box sx={{ position: 'relative' }}>
          <Badge variant="dot" color="success" invisible={type !== 'friend'}>
            <Avatar 
                src={user.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${user.avatar}` : ''} 
                sx={{ width: 45, height: 45, border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
            >
                {user.nombre[0]}
            </Avatar>
          </Badge>

          {/* Círculo indicador de Vibe (Solo si tiene emoción activa) */}
          {type === 'friend' && !isNeutral && (
             <Tooltip title={`Vibe: ${emotionName}`}>
                <Box sx={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 14, height: 14, borderRadius: '50%',
                  background: emotionColor, // El color del tema
                  border: '2px solid #fff',
                  boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                  zIndex: 2,
                  animation: 'pulse-dot 2s infinite'
                }} />
             </Tooltip>
          )}
        </Box>
        
        {/* TEXTO */}
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
              {user.nombre} {user.apellido}
          </Typography>
          
          {/* Subtítulo dinámico */}
          {type === 'friend' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                 {!isNeutral ? (
                   // CASO CON EMOCIÓN
                   <>
                     <AutoAwesome sx={{ fontSize: 12, color: APP_COLORS.secondary }} />
                     <Typography variant="caption" sx={{ 
                       color: 'rgba(255,255,255,0.9)', fontWeight: 500,
                       background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
                       px: 0.5, borderRadius: '4px'
                     }}>
                       {emotionName}
                     </Typography>
                   </>
                 ) : (
                   // CASO NEUTRO
                   <Typography variant="caption" sx={{ color: APP_COLORS.textDim, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     <ChatBubbleOutline sx={{ fontSize: 12 }}/> Chatear
                   </Typography>
                 )}
              </Box>
          ) : null}
        </Box>
  
        {/* ACCIONES */}
        <Box sx={{ display: 'flex', gap: 1 }}>{extraActions}</Box>
      </Box>
    );
  };

  return (
    <GlassCard>
      <Box sx={{ borderBottom: `1px solid ${APP_COLORS.glassBorder}` }}>
        <Tabs value={tab} onChange={(e, v) => { setTab(v); setSearch(''); }} variant="fullWidth" sx={{ minHeight: '48px', '& .MuiTabs-indicator': { bgcolor: APP_COLORS.secondary, height: '3px', borderRadius: '3px' }, '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 700, '&.Mui-selected': { color: 'white' } } }}>
          <Tab label="Amigos" />
          <Tab label="Explorar" />
          <Tab label={<Badge badgeContent={requests.length} color="error" sx={{ '& .MuiBadge-badge': { right: -12, top: 2 } }}>Solicitudes</Badge>} />
        </Tabs>
      </Box>
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField fullWidth placeholder="Buscar..." variant="outlined" size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: APP_COLORS.secondary } } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.7)' }}/></InputAdornment> }} />
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '4px' } }}>
        {tab === 0 && (filteredFriends.length > 0 ? filteredFriends.map(u => renderItem(u, 'friend')) : <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No se encontraron amigos.</Typography>)}
        {tab === 1 && (loadingExplore ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="inherit" /></Box> : filteredExplore.length > 0 ? filteredExplore.map(u => renderItem(u, 'explore', (<Tooltip title="Enviar Solicitud"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSendRequest(u._id); }} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: APP_COLORS.secondary } }}><Add fontSize="small"/></IconButton></Tooltip>))) : <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No hay usuarios nuevos.</Typography>)}
        {tab === 2 && (loadingRequests ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="inherit" /></Box> : filteredRequests.length > 0 ? filteredRequests.map(req => renderItem(req.sender, 'request', (<><Tooltip title="Aceptar"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRequestResponse(req.sender._id, 'accept'); }} sx={{ bgcolor: 'rgba(0,255,0,0.1)', color: '#4caf50', border: '1px solid #4caf50', '&:hover': { bgcolor: '#4caf50', color: 'white' } }}><Check fontSize="small"/></IconButton></Tooltip><Tooltip title="Rechazar"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRequestResponse(req.sender._id, 'reject'); }} sx={{ bgcolor: 'rgba(255,0,0,0.1)', color: '#f44336', border: '1px solid #f44336', '&:hover': { bgcolor: '#f44336', color: 'white' } }}><Close fontSize="small"/></IconButton></Tooltip></>))) : <Typography align="center" sx={{ mt: 4, color: APP_COLORS.textDim }}>No tienes solicitudes pendientes.</Typography>)}
      </Box>
      <style>{`@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }`}</style>
    </GlassCard>
  );
};

export default UserContactList;