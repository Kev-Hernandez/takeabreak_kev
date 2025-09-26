// fileName: src/context/ChatContext.jsx (VERSIÓN FINAL Y CORRECTA)

import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';

// 1. Creamos el contexto
const ChatContext = createContext();

// DESPUÉS (VERSIÓN CON PROTECCIÓN)
export const useChatContext = () => {
  const context = useContext(ChatContext);

  // Esta es la trampa: si un componente fuera del Provider usa el hook,
  // el contexto será 'undefined' y lanzaremos un error claro.
  if (context === undefined) {
    throw new Error('useChatContext debe ser usado dentro de un ChatProvider');
  }

  return context;
};

// 3. Creamos el proveedor del contexto, que contendrá toda la lógica
export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?._id) {
      setCurrentUserId(storedUser._id);
    }

    const fetchActiveUsers = async () => {
      try {
        const response = await apiClient.get('/api/v1/users');
        const data = response.data;
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchActiveUsers();
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
  
  const value = {
    users: filteredUsers,
    selectedUser,
    currentUserId,
    handleSelectUser,
    handleSearchChange,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};