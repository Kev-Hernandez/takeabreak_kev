// src/components/common/GlassSurface.jsx
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassSurface = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparencia base
  backdropFilter: 'blur(12px)',                // Efecto borroso
  border: '1px solid rgba(255, 255, 255, 0.2)', // Borde sutil
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)', // Sombra suave
  borderRadius: '20px',                        // Bordes redondos por defecto
  color: '#ffffff',                            // Texto blanco por defecto
  transition: 'all 0.3s ease',
}));

export default GlassSurface;