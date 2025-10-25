// fileName: src/context/ChatContext.jsx (VERSIÓN CORREGIDA PARA AMIGOS)

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
  const [users, setUsers] = useState([]); // <-- Esta es la lista de AMIGOS
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?._id) {
      setCurrentUserId(storedUser._id);
    }

    // 1. AHORA LLAMAMOS AL ENDPOINT DE "AMIGOS"
    const fetchMyFriends = async () => {
      try {
        // !!! (NECESITAS CREAR ESTE ENDPOINT EN TU BACKEND)
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
  
  // 2. AÑADIMOS LA FUNCIÓN PARA ACEPTAR SOLICITUDES
  const addFriendToContext = (newFriend) => {
    // Añade el nuevo amigo al estado de 'users' (amigos)
    setUsers(prevUsers => {
      // Evitar duplicados
      if (prevUsers.find(u => u._id === newFriend._id)) {
        return prevUsers;
      }
      return [...prevUsers, newFriend];
    });

    // Añade también a la lista filtrada para que aparezca de inmediato
    setFilteredUsers(prevFiltered => {
      if (prevFiltered.find(u => u._id === newFriend._id)) {
        return prevFiltered;
      }
      return [...prevFiltered, newFriend];
    });
  };
  
  const value = {
    users: filteredUsers,
    selectedUser,
    currentUserId,
    handleSelectUser,
    handleSearchChange,
    addFriendToContext, // <-- 3. EXPONEMOS LA NUEVA FUNCIÓN
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};