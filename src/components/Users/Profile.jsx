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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
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
  <Box>
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        maxWidth: 450,
        width: '100%',
        mx: 'auto', // Centrar el Paper horizontalmente
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: '#1976d2', fontWeight: '700', textAlign: 'center', mb: 3 }}
      >
        Mi Perfil
      </Typography>

      {/* Avatar centrado con margen abajo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Avatar
          src={profile.avatar || ''}
          alt={`${profile.nombre} ${profile.apellido}`}
          sx={{
            width: 90,
            height: 90,
            bgcolor: '#1976d2',
            fontSize: 36,
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.5)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 6px 18px rgba(25, 118, 210, 0.7)',
            },
          }}
        >
          {!profile.avatar && <PersonIcon sx={{ fontSize: 54 }} />}
        </Avatar>
      </Box>

      <Grid container spacing={2}>
  {/* Nombre y Apellido lado a lado */}
  <Grid item xs={6}>
    <TextField
      fullWidth
      label="Nombre"
      name="nombre"
      value={profile.nombre}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    />
  </Grid>
  <Grid item xs={6}>
    <TextField
      fullWidth
      label="Apellido"
      name="apellido"
      value={profile.apellido}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Email"
      name="email"
      type="email"
      value={profile.email}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Nueva Contraseña"
      name="password"
      type="password"
      helperText="Dejar en blanco para mantener la contraseña actual"
      value={profile.password}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Descripción"
      name="descripcion"
      multiline
      rows={3}
      value={profile.descripcion}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    />
  </Grid>

  <Grid item xs={12}>
    <TextField
      fullWidth
      select
      label="Género"
      name="genero"
      value={profile.genero}
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#1976d2',
          },
          '&:hover fieldset': {
            borderColor: '#115293',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0d47a1',
            borderWidth: 2,
          },
        },
      }}
    >
      <MenuItem value="Masculino">Masculino</MenuItem>
      <MenuItem value="Femenino">Femenino</MenuItem>
      <MenuItem value="Otro">Otro</MenuItem>
    </TextField>
  </Grid>

  {/* Botón Guardar */}
  <Grid item xs={12} sx={{ mt: 1 }}>
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={handleSubmit}
      fullWidth
      sx={{
        py: 1.4,
        fontWeight: '700',
        fontSize: '1rem',
        borderRadius: 3,
        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.6)',
        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 10px 24px rgba(25, 118, 210, 0.8)',
        },
      }}
    >
      Guardar Cambios
    </Button>
  </Grid>
</Grid>


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
    </Paper>
  </Box>
);

};

export default Profile;
