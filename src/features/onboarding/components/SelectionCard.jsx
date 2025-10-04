import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const SelectionCard = ({ label, image, isSelected, onClick }) => (
  <Paper
    onClick={onClick}
    elevation={isSelected ? 8 : 2}
    sx={{
      position: 'relative', p: 2, borderRadius: 3, textAlign: 'center',
      cursor: 'pointer', overflow: 'hidden', height: '100px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s ease-in-out',
      border: isSelected ? '2px solid' : '2px solid transparent',
      borderColor: isSelected ? 'primary.main' : 'transparent',
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
      backgroundImage: image ? `url(${image})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
    }}
  >
    {image && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />}
    <Typography sx={{ position: 'relative', color: image ? 'common.white' : 'text.primary', fontWeight: 'bold' }}>
      {label}
    </Typography>
    {isSelected && <CheckCircleIcon sx={{ position: 'absolute', top: 8, right: 8, color: 'primary.main', bgcolor: 'white', borderRadius: '50%' }} />}
  </Paper>
);