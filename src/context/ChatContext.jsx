// fileName: src/context/ChatContext.jsx (VERSIÓN CORREGIDA PARA AMIGOS + VIBES)

import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext debe ser usado dentro de un ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // Lista de AMIGOS
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // ✅ NUEVO: MAPA DE VIBES DE AMIGOS
  // Almacena { 'id_usuario': 'emocion_actual' }
  const [vibeMap, setVibeMap] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?._id) {
      setCurrentUserId(storedUser._id);
    }

    const fetchMyFriends = async () => {
      try {
        // Asegúrate de que este endpoint exista en tu backend
        const response = await apiClient.get('/api/v1/friends/my-friends');
        const data = response.data;
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    
    fetchMyFriends();
  }, []);

  const handleSelectUser = (user) => {
    if(user._id !== currentUserId) {
      setSelectedUser(user);
    }
  };

  const handleSearchChange = (searchTerm) => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((user) =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  
  const addFriendToContext = (newFriend) => {
    setUsers(prevUsers => {
      if (prevUsers.find(u => u._id === newFriend._id)) return prevUsers;
      return [...prevUsers, newFriend];
    });
    setFilteredUsers(prevFiltered => {
      if (prevFiltered.find(u => u._id === newFriend._id)) return prevFiltered;
      return [...prevFiltered, newFriend];
    });
  };

  // ✅ NUEVA FUNCIÓN: ACTUALIZAR EL VIBE DE UN AMIGO
  const updateUserVibe = (userId, emotion) => {
    if (!userId || !emotion) return;
    setVibeMap(prev => {
        // Evitamos renderizados innecesarios si la emoción es la misma
        if (prev[userId] === emotion) return prev;
        return { ...prev, [userId]: emotion.trim() };
    });
  };
  
  const value = {
    users: filteredUsers,
    selectedUser,
    currentUserId,
    handleSelectUser,
    handleSearchChange,
    addFriendToContext,
    vibeMap,          // Exportamos el mapa de vibes
    updateUserVibe,   // Exportamos la función para actualizarlo
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};