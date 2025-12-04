// src/components/common/GlassCard.jsx
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { APP_COLORS } from '../../utils/constants';

const GlassCard = styled(Box)(({ theme }) => ({
  backgroundColor: APP_COLORS.glassBg,
  backdropFilter: 'blur(16px)', // Blur fuerte para calidad premium
  border: `1px solid ${APP_COLORS.glassBorder}`,
  boxShadow: APP_COLORS.glassShadow,
  borderRadius: '24px',
  color: APP_COLORS.text,
  overflow: 'hidden', // Nada se sale del cristal
  transition: 'all 0.3s ease',
  
  // Por defecto flex column para facilitar layouts internos
  display: 'flex',
  flexDirection: 'column',
}));

export default GlassCard;