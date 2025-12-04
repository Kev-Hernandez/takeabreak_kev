// src/context/ChatContext.jsx
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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Mapa de Vibes de Amigos
  const [vibeMap, setVibeMap] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?._id) {
      setCurrentUserId(storedUser._id);
    }

    const fetchMyFriends = async () => {
      try {
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

  // ✅ CORRECCIÓN AQUÍ:
  const handleSelectUser = (user) => {
    // Si mandamos null, es para deseleccionar (botón atrás en móvil)
    if (!user) {
      setSelectedUser(null);
      return;
    }

    // Si es un usuario válido, lo seleccionamos
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

  const updateUserVibe = (userId, emotion) => {
    if (!userId || !emotion) return;
    setVibeMap(prev => {
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
    vibeMap,
    updateUserVibe,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};