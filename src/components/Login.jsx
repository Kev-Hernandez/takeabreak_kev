import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Container, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Estado para datos del formulario (sin validaciones ni errores)
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });

  const [errors, setErrors] = useState({});

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí no hacemos validaciones, solo enviamos directamente
    try {
      const response = await fetch('http://localhost:3001/api/web/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.correo,         // Cambié "correo" por "email" aquí
          contraseña: formData.contraseña
        }),
      });

      if (response.ok) {
        // Login correcto, ir a chat
        navigate('/chat');
      } else {
        // Mostrar error si algo falla en backend
        const data = await response.json();
        setErrors({ submit: data.mensaje || 'Error en el inicio de sesión' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error de conexión con el servidor' });
    }
  };

  // Actualiza el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Box className="login-box">
      {/* Formas decorativas */}
      <div className="decorative-shape shape-1"></div>
      <div className="decorative-shape shape-2"></div>
      <div className="decorative-shape shape-3"></div>
      <div className="decorative-shape shape-4"></div>

      {/* Círculo con efecto de pulso */}
      <div className="pulse-circle"></div>
      <Container maxWidth="xs" className="login-container">
        <Paper elevation={0} className="login-paper" sx={{ padding: 3 }}>
          <Typography align="center" variant="h3" gutterBottom className="login-title">
            Take a Break
          </Typography>
          <Typography align="center" variant="h5" gutterBottom className="login-subtitle">
            Iniciar Sesión
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="login-form"
          >
            <TextField
              className="login-input"
              margin="normal"
              required
              fullWidth
              id="correo"
              label="Correo Electrónico"
              name="correo"
              autoComplete="email"
              value={formData.correo}
              onChange={handleChange}
            />

            <TextField
              className="login-input"
              margin="normal"
              required
              fullWidth
              name="contraseña"
              label="Contraseña"
              type="password"
              id="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
            />

            {/* Mostrar error general si existe */}
            {errors.submit && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {errors.submit}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            ¿Aún no te has registrado?
            <Button
              component="a"
              href="/register"
              variant="text"
              sx={{
                ml: 1,
                '&:hover': { cursor: 'pointer' },
              }}
            >
              Regístrate
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
