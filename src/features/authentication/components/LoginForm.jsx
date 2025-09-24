// src/features/authentication/components/LoginForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginForm = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('user', JSON.stringify(data.usuario));
        sessionStorage.setItem('idUsuario', data.usuario._id || data.usuario.id);
        sessionStorage.setItem('token', data.token);
        navigate('/dashboard'); // O a la nueva ruta del Dashboard
      } else {
        const data = await response.json();
        setErrors({ submit: data.mensaje || 'Error en el inicio de sesión' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión con el servidor' });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
        <TextField
          className="login-input"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          className="login-input"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.submit && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {errors.submit}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" className="login-submit">
          Iniciar Sesión
        </Button>
      </Box>
      <Button
        fullWidth
        variant="text"
        onClick={() => navigate('/register')}
        className="login-link"
      >
        ¿Aún no te has registrado? Regístrate aquí
      </Button>
    </>
  );
};

export default LoginForm;