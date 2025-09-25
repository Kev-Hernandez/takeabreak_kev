import { useState } from 'react';
import {Box, TextField, Button, Typography, Container, Paper, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../../styles/register.css';
import apiClient from '../../../api/apiClient';

const Register = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    edad: '',
    sexo: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    else if (formData.nombre.length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';

    if (!formData.apellido) newErrors.apellido = 'Los apellidos son requeridos';
    else if (formData.apellido.length < 2) newErrors.apellido = 'Los apellidos deben tener al menos 2 caracteres';

    if (!formData.email) newErrors.email = 'El correo electrónico es requerido';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) newErrors.password = 'Debe tener al menos 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Debe tener mayúscula, minúscula, número y símbolo';
    }

    if (!formData.edad) newErrors.edad = 'La edad es requerida';
    else if (isNaN(formData.edad) || formData.edad <= 0) newErrors.edad = 'Edad inválida';

    if (!formData.sexo) newErrors.sexo = 'El sexo es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});


    if (validateForm()) {
      try {
        const dataToSend = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          edad: Number(formData.edad),
          sexo: formData.sexo,
          preferences: {
            generos: [],
            autores: []
          },
          plataforma: []
        };
        
        await apiClient.post('/api/register', dataToSend);
          navigate('/');
          window.location.reload(); // Recargar para actualizar el estado de autenticación
      } catch (error) {
        if (error.response){
          setErrors({ submit: error.response.data.mensaje || 'Error en el registro' });
        } else {
          setErrors({ submit: 'Error de conexión con el servidor' });
        }
      }
    }else{
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box className="register-box">
      <div className="decorative-shape shape-1"></div>
      <div className="decorative-shape shape-2"></div>
      <div className="decorative-shape shape-3"></div>
      <div className="decorative-shape shape-4"></div>
      <Container maxWidth="xs" className="register-container">
        
        <Paper elevation={0} className="register-paper">
          <Typography component="h1" variant="h3" align="center" className="register-title">
            Take a Break
          </Typography>
          <Typography component="h2" variant="h5" align="center" className="register-subtitle">
            Registro
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate className="register-form">
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              className="register-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Apellidos"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
              className="register-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              className="register-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              className="register-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
              error={!!errors.edad}
              helperText={errors.edad}
              className="register-input"
            />
            <TextField
              select
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!errors.sexo}
              helperText={errors.sexo}
              className="register-input"
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>

            {errors.submit && (
              <Typography color="error" align="center">
                {errors.submit}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained" className="register-submit">
              REGISTRARSE
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              className="register-link"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
