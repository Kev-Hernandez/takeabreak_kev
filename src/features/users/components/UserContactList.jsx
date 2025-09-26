import React, { useState } from 'react';
import { InputAdornment, Badge, Typography, Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useChatContext } from '../../../context/ChatContext';
import apiClient from '../../../api/apiClient';

// 1. Importamos nuestros nuevos componentes estilizados
import {
  ListContainer,
  Header,
  SearchTextField,
  ContactList,
  ContactItem,
  StyledAvatar
} from './UserContactList.styles';

const UserContactList = () => {
  const { users, selectedUser, currentUserId, handleSelectUser, handleSearchChange } = useChatContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  return (
    // 2. Usamos nuestros componentes estilizados en el JSX
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
              onClick={() => handleSelectUser(user)}
              isSelected={selectedUser?._id === user._id} // Pasamos si está seleccionado
            >
              <Badge variant="dot" color="success">
                <StyledAvatar src={user.avatar ? `${apiClient.defaults.baseURL}/public/avatares/${user.avatar}` : ''} alt={user.nombre} />
              </Badge>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#E0E1DD' }}>{user.nombre} {user.apellido}</Typography>
                <Typography variant="caption" sx={{ color: '#A9A9A9' }}>{user.lastMessage || 'Chatear'}</Typography>
              </Box>
            </ContactItem>
          )
        ))}
      </ContactList>
    </ListContainer>
  );
};

export default UserContactList;