import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  const [profile, setProfile] = useState({
    nombre: '',
    email: '',
    avatar: '',
    descripcion: '',
    contraseña: '',
    apellido: '',
    sexo: '',
    preferences: { generos: [], autores: [] },
    plataforma: []
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id) throw new Error('No user ID found');

      const response = await fetch(`http://localhost:3001/api/web/auth/profile/${userData.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setProfile({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        email: data.email || '',
        avatar: data.avatar || '',
        descripcion: data.descripcion || '',
        sexo: data.sexo || '',
        preferences: data.preferences || { generos: [], autores: [] },
        plataforma: data.plataforma || [],
        contraseña: '', // Siempre vacío por seguridad
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showSnackbar('Error al cargar el perfil', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id) throw new Error('No user ID found');

      const updateData = {
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.email,
        descripcion: profile.descripcion,
        ...(profile.contraseña ? { contraseña: profile.contraseña } : {}),
      };

      const response = await fetch(`http://localhost:3001/api/web/auth/profile/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showSnackbar('Perfil actualizado con éxito', 'success');

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userData,
          ...updateData,
          contraseña: undefined, // No guardar la contraseña
        })
      );

      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Error al actualizar el perfil', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 600,
        margin: '40px auto',
        bgcolor: '#f0f4ff',
        borderRadius: 4,
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: 'white',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#1976d2', fontWeight: '700', mb: 4, textAlign: 'center' }}
        >
          Mi Perfil
        </Typography>

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Avatar con icono o imagen */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={profile.avatar || ''}
              alt={`${profile.nombre} ${profile.apellido}`}
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#1976d2',
                fontSize: 40,
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.5)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 18px rgba(25, 118, 210, 0.7)',
                },
              }}
            >
              {!profile.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
            </Avatar>
          </Grid>

          {/* Campos de formulario */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              name="nombre"
              value={profile.nombre}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'border-color 0.3s ease',
                },
                '& .MuiOutlinedInput-root:hover': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              name="apellido"
              value={profile.apellido}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'border-color 0.3s ease',
                },
                '& .MuiOutlinedInput-root:hover': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'border-color 0.3s ease',
                },
                '& .MuiOutlinedInput-root:hover': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nueva Contraseña"
              name="contraseña"
              type="password"
              value={profile.contraseña}
              onChange={handleChange}
              fullWidth
              helperText="Dejar en blanco para mantener la contraseña actual"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'border-color 0.3s ease',
                },
                '& .MuiOutlinedInput-root:hover': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              name="descripcion"
              multiline
              rows={4}
              value={profile.descripcion}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'border-color 0.3s ease',
                },
                '& .MuiOutlinedInput-root:hover': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Género"
              value={profile.sexo}
              disabled
              fullWidth
              variant="outlined"
              sx={{
                bgcolor: '#f5f7fa',
                borderRadius: 3,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              fullWidth
              sx={{
                py: 1.8,
                fontWeight: '700',
                fontSize: '1.1rem',
                borderRadius: 4,
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.7)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 26px rgba(25, 118, 210, 0.9)',
                },
              }}
            >
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
