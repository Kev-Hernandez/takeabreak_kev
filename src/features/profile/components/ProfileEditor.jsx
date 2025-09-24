import React, { useEffect, useState } from 'react';
import {Box,Paper,Typography,TextField,Button,Grid,Avatar,Snackbar,Alert,MenuItem,IconButton,InputAdornment,Dialog,DialogTitle,DialogContent,DialogActions,Slide} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

// 1. Importamos nuestro 'apiClient' en lugar de 'axios'
import apiClient from '../../../api/apiClient';

// Animación para el diálogo modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    descripcion: '',
    genero: '',
    avatar: '',
  });

  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

useEffect(() => {
  const fetchProfileAndAvatars = async () => {
    const idUsuario = sessionStorage.getItem('idUsuario');
    try {
      if (!idUsuario) throw new Error('No se encontró el ID del usuario');

      const [profileRes, avatarsRes] = await Promise.all([
        apiClient.get(`/web/usuarios/${idUsuario}`),
        apiClient.get(`/web/avatars`),
      ]);
      
      const profileData = profileRes.data;
      setProfile(prev => ({
        ...prev,
        ...profileData,
        password: '',
        genero: profileData.genero || '',
        avatar: profileData.avatar || '',
      }));
      
      // ======================= INICIO DE LA CORRECCIÓN FINAL =======================
      // Esta línea es el problema. La reemplazamos por una que no incluya '/api'.
      const SERVER_BASE_URL = 'http://localhost:3001'; 
      // ======================= FIN DE LA CORRECCIÓN FINAL =======================

      const avatarUrls = avatarsRes.data.map(avatarFileName => 
        `${SERVER_BASE_URL}/avatares/${avatarFileName}`
      );
      
      setAvailableAvatars(avatarUrls);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      showSnackbar('Error al cargar el perfil o los avatares', 'error');
    }
  };

  fetchProfileAndAvatars();
}, []);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idUsuario = sessionStorage.getItem('idUsuario');
      
      const updateData = { ...profile };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await apiClient.put(`/web/usuarios/${idUsuario}`, updateData);

      showSnackbar('Perfil actualizado con éxito', 'success');
      setProfile(prev => ({ ...prev, password: '' }));

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      showSnackbar('Error al actualizar el perfil', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      p: { xs: 1, sm: 2, md: 3 },
    }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: 900,
        }}
      >
        {/* --- Encabezado --- */}
        <Box sx={{ textAlign: 'center', mb: 4}}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Mi Perfil
          </Typography>
          <Box sx={{
            height: 4,
            width: '60%',
            background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)',
            borderRadius: 2,
            margin: '8px auto 0'
          }} />
        </Box>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* --- Columna Izquierda: Avatar --- */}
          <Grid xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profile.avatar}
                alt={`${profile.nombre} ${profile.apellido}`}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '3px solid white'
                }}
              />
              <IconButton
                color="primary"
                onClick={() => setIsModalOpen(true)}
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'primary.light', color: 'common.white' },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={600}>{profile.nombre} {profile.apellido}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
            </Box>
          </Grid>
          
          {/* --- Columna Derecha: Formulario --- */}
          <Grid xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="Nombre" name="nombre" value={profile.nombre} onChange={handleChange} variant="outlined" size="small" />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField fullWidth label="Apellido" name="apellido" value={profile.apellido} onChange={handleChange} variant="outlined" size="small" />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Correo electrónico" name="email" type="email" value={profile.email} onChange={handleChange} variant="outlined" size="small" InputProps={{ endAdornment: <InputAdornment position="end"><EmailIcon fontSize="small" /></InputAdornment> }} />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Nueva Contraseña" name="password" type="password" helperText="Dejar en blanco para mantener la actual" value={profile.password} onChange={handleChange} variant="outlined" size="small" InputProps={{ endAdornment: <InputAdornment position="end"><LockIcon fontSize="small" /></InputAdornment> }} />
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth select label="Género" name="genero" value={profile.genero} onChange={handleChange} variant="outlined" size="small">
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                    <MenuItem value="Prefiero no decir">Prefiero no decir</MenuItem>
                  </TextField>
                </Grid>
                <Grid xs={12}>
                  <TextField fullWidth label="Descripción" name="descripcion" multiline rows={3} value={profile.descripcion} onChange={handleChange} variant="outlined" size="small" helperText="Cuéntanos algo sobre ti" />
                </Grid>
                <Grid xs={12} sx={{ mt: 1 }}>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} fullWidth size="large" sx={{ py: 1.5, fontWeight: 600 }}>
                    Guardar Cambios
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>

      {/* --- DIÁLOGO MODAL PARA SELECCIONAR AVATAR --- */}
      <Dialog
        open={isModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsModalOpen(false)}
        aria-describedby="avatar-selection-dialog"
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }}>
          Elige tu Avatar
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ p: 1 }}>
            {availableAvatars.map((url) => (
              <Grid key={url} xs={4} sm={3}>
                <Avatar
                  src={url}
                  onClick={() => handleAvatarSelect(url)}
                  sx={{
                    width: 80, height: 80, cursor: 'pointer',
                    border: profile.avatar === url ? '4px solid #1976d2' : '4px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.1)', boxShadow: 3 }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileEditor;