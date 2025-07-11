import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

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
    severity: 'success'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id) {
        throw new Error('No user ID found');
      }

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
        contraseña: '' // Siempre vacío por seguridad
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
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id) throw new Error('No user ID found');

      // Solo enviar los campos que se pueden actualizar
      const updateData = {
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.email,
        descripcion: profile.descripcion,
        ...(profile.contraseña ? { contraseña: profile.contraseña } : {})
      };

      const response = await fetch(`http://localhost:3001/api/web/auth/profile/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      showSnackbar('Perfil actualizado con éxito', 'success');
      
      // Actualizar datos en localStorage
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        ...updateData,
        contraseña: undefined // No guardar la contraseña en localStorage
      }));

      // Recargar los datos del perfil
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
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mi Perfil
        </Typography>
        
        <Grid container spacing={3}>
          {/* Avatar se mantiene igual */}
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={profile.nombre}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={profile.apellido}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              type="email"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              name="contraseña"
              value={profile.contraseña}
              onChange={handleChange}
              type="password"
              helperText="Dejar en blanco para mantener la contraseña actual"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={profile.descripcion}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>

          {/* Campo de solo lectura para mostrar información adicional */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Género"
              value={profile.sexo}
              disabled
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              fullWidth
            >
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar se mantiene igual */}
    </Box>
  );
};

export default Profile;