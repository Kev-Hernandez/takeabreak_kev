// src/features/users/components/UserContactList.jsx

import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Avatar, Badge } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';

const UserContactList = ({ users, selectedUser, onSelectChat, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <Box sx={{ flex: 1, maxWidth: 380, p: 3, borderRight: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        <ChatBubbleOutlineIcon /> Chats
      </Typography>
      <TextField
        label="Buscar contactos"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        value={searchTerm}
        onChange={handleSearch}
      />
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {users.map((user) => (
          <Box
            key={user._id}
            onClick={() => onSelectChat(user)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2, p: 1.5, mb: 1, borderRadius: 2, cursor: 'pointer',
              bgcolor: selectedUser?._id === user._id ? 'primary.light' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Badge variant="dot" color="success">
              <Avatar src={user.profilePicture} alt={user.nombre} />
            </Badge>
            <Box>
              <Typography variant="subtitle2">{user.nombre} {user.apellido}</Typography>
              <Typography variant="caption" color="text.secondary">{user.lastMessage || 'Chatear'}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserContactList;