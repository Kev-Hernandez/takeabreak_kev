import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Avatar, Snackbar, Alert, 
  MenuItem, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, 
  DialogActions, Slide, CircularProgress 
} from '@mui/material';
import { Save, Email, Lock, Edit, Close, Person, Description, Transgender } from '@mui/icons-material';

import GlassCard from '../../../components/common/GlassCard';
import { APP_COLORS } from '../../../utils/constants';
import apiClient from '../../../api/apiClient';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    nombre: '', apellido: '', email: '', password: '', descripcion: '', genero: '', avatar: '',
  });
  
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState(''); // Guardamos la URL base limpia
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      const idUsuario = sessionStorage.getItem('idUsuario');
      if (!idUsuario) return;

      // 1. Determinar la URL base del servidor (sin /api/v1)
      let baseUrl = apiClient.defaults.baseURL || '';
      // Si la base termina en /api/v1, lo quitamos para apuntar a la raíz (public)
      baseUrl = baseUrl.replace(/\/api\/v1\/?$/, ''); 
      if (baseUrl && !baseUrl.endsWith('/')) baseUrl += '/';
      
      setServerUrl(baseUrl); // Guardamos ej: http://localhost:4000/

      // 2. Cargar Perfil
      try {
        const profileRes = await apiClient.get(`/api/v1/users/${idUsuario}`);
        setProfile(prev => ({ ...prev, ...profileRes.data, password: '' }));
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }

      // 3. Cargar Avatares (Independiente)
      setLoadingAvatars(true);
      try {
        const avatarsRes = await apiClient.get(`/api/v1/users/utils/avatars`);
        if (Array.isArray(avatarsRes.data)) {
          // Guardamos SOLO los nombres de archivo
          setAvailableAvatars(avatarsRes.data);
          console.log("Avatares cargados:", avatarsRes.data);
        }
      } catch (error) {
        console.error("Error cargando avatares:", error);
      } finally {
        setLoadingAvatars(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleAvatarSelect = (fileName) => {
    setProfile(prev => ({ ...prev, avatar: fileName }));
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idUsuario = sessionStorage.getItem('idUsuario');
      const data = { ...profile };
      if (!data.password) delete data.password;
      await apiClient.put(`/api/v1/users/${idUsuario}`, data);
      setSnackbar({ open: true, message: 'Perfil actualizado ✨', severity: 'success' });
      setProfile(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar', severity: 'error' });
    }
  };

  // Construcción segura de la URL de la imagen actual
  const currentAvatarUrl = profile.avatar 
    ? `${serverUrl}public/avatares/${profile.avatar}` 
    : '';

  // --- ESTILOS ---
  const glassInputStyles = {
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: APP_COLORS.secondary },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '15px',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: APP_COLORS.secondary },
    },
    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 0, md: 2 } }}>
      <GlassCard sx={{ 
        p: { xs: 3, md: 5 }, maxWidth: 900, width: '100%', alignItems: 'stretch', display: 'block' 
      }}>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Mi Perfil
          </Typography>
          <Box sx={{ height: 4, width: 60, bgcolor: APP_COLORS.secondary, borderRadius: 2, mx: 'auto', mt: 1 }} />
        </Box>

        <Grid container spacing={4}>
          {/* AVATAR */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={currentAvatarUrl}
                sx={{
                  width: 160, height: 160,
                  border: `4px solid ${APP_COLORS.secondary}`,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
              />
              <IconButton
                onClick={() => setIsModalOpen(true)}
                sx={{
                  position: 'absolute', bottom: 5, right: 5,
                  bgcolor: 'white', color: APP_COLORS.primary,
                  '&:hover': { bgcolor: '#f0f0f0' },
                  boxShadow: 3
                }}
              >
                <Edit />
              </IconButton>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {profile.nombre} {profile.apellido}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {profile.email}
              </Typography>
            </Box>
          </Grid>

          {/* FORMULARIO */}
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Nombre" name="nombre" value={profile.nombre} onChange={handleChange} sx={glassInputStyles} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Apellido" name="apellido" value={profile.apellido} onChange={handleChange} sx={glassInputStyles} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Correo" name="email" value={profile.email} onChange={handleChange} sx={glassInputStyles} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nueva Contraseña" name="password" type="password" placeholder="Dejar vacío para no cambiar" value={profile.password} onChange={handleChange} sx={glassInputStyles} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Género" name="genero" value={profile.genero} onChange={handleChange} sx={glassInputStyles}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Transgender /></InputAdornment> }}
                  >
                    {['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'].map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Descripción" name="descripcion" value={profile.descripcion} onChange={handleChange} sx={glassInputStyles} 
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{mt:1.5}}><Description /></InputAdornment> }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button 
                    type="submit" variant="contained" fullWidth size="large"
                    startIcon={<Save />}
                    sx={{ 
                      bgcolor: APP_COLORS.secondary, color: '#000', fontWeight: 'bold', borderRadius: '50px',
                      '&:hover': { bgcolor: '#00dbbe', transform: 'scale(1.02)' }
                    }}
                  >
                    Guardar Cambios
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </GlassCard>

      {/* --- MODAL DE AVATAR --- */}
      <Dialog 
        open={isModalOpen} onClose={() => setIsModalOpen(false)} 
        TransitionComponent={Transition}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }} 
      >
        <GlassCard sx={{ minWidth: 320, border: `1px solid ${APP_COLORS.glassBorder}` }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            Elige tu Avatar
            <IconButton onClick={() => setIsModalOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}><Close /></IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {loadingAvatars ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
            ) : availableAvatars.length === 0 ? (
              <Typography sx={{ color: 'white', textAlign: 'center' }}>No se encontraron avatares.</Typography>
            ) : (
              <Grid container spacing={2}>
                {availableAvatars.map((fileName) => (
                  <Grid item xs={4} key={fileName} display="flex" justifyContent="center">
                    <Avatar 
                      // Aquí construimos la URL completa usando el serverUrl que limpiamos antes
                      src={`${serverUrl}public/avatares/${fileName}`} 
                      onClick={() => handleAvatarSelect(fileName)}
                      sx={{ 
                        width: 70, height: 70, cursor: 'pointer',
                        border: profile.avatar === fileName ? `3px solid ${APP_COLORS.secondary}` : '2px solid transparent',
                        '&:hover': { transform: 'scale(1.1)' }, transition: 'all 0.2s',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }} 
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
        </GlassCard>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '20px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileEditor;