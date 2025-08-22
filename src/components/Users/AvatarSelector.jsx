import React, { useEffect, useState } from 'react';
import { Box, Avatar } from '@mui/material';

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/web/avatars')
      .then(res => res.json())
      .then(data => setAvatars(data))
      .catch(err => console.error('Error al cargar avatares:', err));
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
      {avatars.map((avatar) => {
        console.log("Avatar URL:", avatar.url);
        return (
          <Avatar
            key={avatar.name}
            src={`http://localhost:3001${avatar.url}`}
            alt={avatar.name}
            sx={{
              width: 60,
              height: 60,
              cursor: 'pointer',
              border: selectedAvatar === avatar.url ? '3px solid #1976d2' : '3px solid transparent',
              transition: 'border 0.3s',
              '&:hover': {
                border: '3px solid #42a5f5',
              },
            }}
            onClick={() => onSelect(avatar.url)}
          />
        );
      })}
    </Box>
  );
};

export default AvatarSelector;
