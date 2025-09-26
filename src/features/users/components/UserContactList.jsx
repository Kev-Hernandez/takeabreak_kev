// fileName: src/features/users/components/UserContactList.jsx (VERSIÓN FINAL)

import React, { useState } from 'react';
import { InputAdornment, Badge, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../../../api/apiClient';

// 1. Importamos AMBOS hooks de contexto
import { useChatContext } from '../../../context/ChatContext';
import { useThemeContext } from '../../../context/ThemeContext';

import {
  ListContainer, Header, SearchTextField, ContactList, ContactItem, StyledAvatar
} from './UserContactList.styles';

const UserContactList = () => {
  // 2. Usamos ambos contextos para obtener lo que necesitamos de cada uno
  const { users, selectedUser, handleSelectUser, handleSearchChange, currentUserId } = useChatContext();
  const { setThemeMode } = useThemeContext(); // <-- Obtenemos la función para cambiar el tema
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  // 3. Creamos una nueva función que orquesta ambas acciones
  const handleUserClick = (user) => {
    handleSelectUser(user); // Cambia el usuario seleccionado en el ChatContext
    setThemeMode('neutral'); // Resetea el tema en el ThemeContext
  };

  return (
    <ListContainer>
      <Header variant="h6">
        <ChatBubbleOutlineIcon /> Chats
      </Header>
      
      <SearchTextField
        label="Buscar contactos"
        variant="outlined"
        fullWidth
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        value={searchTerm}
        onChange={handleSearch}
      />
      
      <ContactList>
        {users.map((user) => (
          user._id !== currentUserId && (
            <ContactItem
              key={user._id}
              onClick={() => handleUserClick(user)} // <-- 4. El onClick ahora llama a nuestra nueva función
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
          )
        ))}
      </ContactList>
    </ListContainer>
  );
};

export default UserContactList;