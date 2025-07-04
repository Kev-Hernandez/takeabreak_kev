import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import monitorange from '../assets/monitorange.png';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/web/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.correo,
          contraseña: formData.contraseña,
        }),
      });

      if (response.ok) {
        navigate('/chat');
      } else {
        const data = await response.json();
        setErrors({ submit: data.mensaje || 'Error en el inicio de sesión' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error de conexión con el servidor' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box className="login-box">
      {/* Figuras decorativas */}
      <div className="decorative-shape shape-1" />
      <div className="decorative-shape shape-2" />
      <div className="decorative-shape shape-3" />
      <div className="decorative-shape shape-4" />

      <Container className="login-container">
        <img 
          src={monitorange} 
          alt="Muñeco-head" 
          className="character-loginimage"
        />
        <Paper elevation={0} className="MuiPaper-root login-paper">
          <Typography className="MuiTypography-root login-title">
            Take a Break
          </Typography>
          <Typography className="MuiTypography-root login-subtitle">
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

            {errors.submit && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {errors.submit}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-submit"
            >
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
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
