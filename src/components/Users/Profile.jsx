import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Snackbar,
  Alert,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

import axios from 'axios';


const Profile = () => {
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    descripcion: '',
    genero: '',
    avatar: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const idUsuario = localStorage.getItem('idUsuario');
        if (!idUsuario) throw new Error('No user ID found');

        const res = await axios.get(`http://localhost:3001/api/web/usuarios/${idUsuario}`);
        const data = res.data;

        setProfile({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          password: '',
          descripcion: data.descripcion || '',
          genero: data.genero || '',
          avatar: data.avatar || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        showSnackbar('Error al cargar el perfil', 'error');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idUsuario = localStorage.getItem('idUsuario');
      if (!idUsuario) throw new Error('No user ID found');

      const updateData = {
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.email,
        descripcion: profile.descripcion,
        genero: profile.genero,
      };
      if (profile.password) {
        updateData.password = profile.password;
      }

      await axios.put(`http://localhost:3001/api/web/usuarios/${idUsuario}`, updateData);

      showSnackbar('Perfil actualizado con éxito', 'success');
      setProfile((prev) => ({ ...prev, password: '' }));

    } catch (error) {
      console.error('Error updating profile:', error);
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
    alignItems: 'flex-start',
    p: { xs: 1, sm: 2, md: 3 },
    bgcolor: 'transparent',
     // Permite scroll si el contenido es muy grande
  }}>
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        width: '95%', // Más flexible que 100%
        maxWidth: 900, // Más ancho para pantallas grandes
        minWidth: 300, // Mínimo para evitar problemas en zoom extremo
        position: 'relative',
        overflow: 'auto', // Cambiado a visible para mejor manejo de zoom
        my: 3,
        
      }}
    >
      {/* Encabezado */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            position: 'relative',
            display: 'inline-block',
            fontSize: { xs: '1.7rem', sm: '2rem', md: '2.125rem' }, // Tamaño responsive
            '&:after': {
              content: '""',
              display: 'block',
              width: '60%',
              height: 4,
              background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)',
              margin: '12px auto 0',
              borderRadius: 2
            }
          }}
        >
          Mi Perfil
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Grid container spacing={{ xs: 2, md: 4 }}> {/* Espaciado responsive */}
        {/* Columna izquierda - Avatar */}
        <Grid item xs={12} md={4} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Box sx={{
            position: 'relative',
            mb: 2,
            '&:hover': {
              '& .MuiAvatar-root': {
                transform: 'scale(1.03)'
              }
            }
          }}>
            <Avatar
              src={profile.avatar || ''}
              alt={`${profile.nombre} ${profile.apellido}`}
              sx={{
                width: { xs: 120, md: 150 },
                height: { xs: 120, md: 150 },
                bgcolor: 'primary.main',
                fontSize: { xs: 40, md: 50 },
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                transition: 'all 0.3s ease',
                border: '3px solid white'
              }}
            >
              {!profile.avatar && <PersonIcon sx={{ fontSize: { xs: 50, md: 70 } }} />}
            </Avatar>
            <IconButton
              color="primary"
              sx={{
                position: 'absolute',
                bottom: 6,
                right: 6,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'common.white'
                },
                p: 0.8
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            {profile.nombre} {profile.apellido}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
            {profile.genero || 'Sin especificar'}
          </Typography>
        </Grid>

        {/* Columna derecha - Formulario */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}> {/* Reducido el espaciado entre campos */}
            {/* Nombre y Apellido */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={profile.nombre}
                onChange={handleChange}
                variant="outlined"
                size="small" // Cambiado a small para ahorrar espacio
                sx={{ 
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' } // Tamaño de texto responsive
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={profile.apellido}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                  }
                }}
              />
            </Grid>

            {/* Email - Con más espacio */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" size="small">
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Contraseña */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="password"
                type="password"
                helperText="Dejar en blanco para mantener la contraseña actual"
                value={profile.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" size="small">
                        <LockIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Género */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Género"
                name="genero"
                value={profile.genero}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiSelect-select': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                  }
                }}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
                <MenuItem value="Prefiero no decir">Prefiero no decir</MenuItem>
              </TextField>
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                multiline
                rows={3} // Reducido de 4 a 3 para ahorrar espacio
                value={profile.descripcion}
                onChange={handleChange}
                variant="outlined"
                size="small"
                helperText="Cuéntanos algo sobre ti"
                sx={{ 
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                  }
                }}
              />
            </Grid>

            {/* Botón Guardar */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                fullWidth
                size="medium" // Cambiado a medium para mejor proporción
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: { xs: '0.9375rem', sm: '1rem' },
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                    background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)'
                  }
                }}
              >
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Notificación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 4 }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderRadius: 1,
            alignItems: 'center',
            fontSize: { xs: '0.875rem', sm: '0.9375rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  </Box>
);

};

export default Profile;
