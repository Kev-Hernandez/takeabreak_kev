// src/features/authentication/components/LoginForm.jsx (EDITADO)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
// ✅ 1. Importa el hook del AuthContext
import { useAuthContext } from '../../../context/AuthContext';
//import apiClient from '../../../api/apiClient'; // Se mantiene por si AuthContext no lo importa, aunque lo ideal es que AuthContext maneje apiClient
import './login.css';

const LoginForm = () => {
  const navigate = useNavigate();
  // ✅ 2. Obtiene la función 'login' del contexto
  const { login } = useAuthContext();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores previos
    try {
      // ✅ 3. Llama a la función 'login' del contexto.
      // Esta función ahora se encarga de llamar a la API y guardar en sessionStorage.
      await login(formData);
      
      // ✅ 4. Navega al dashboard.
      navigate('/dashboard'); 
      
      // ❌ 5. Se elimina 'window.location.reload()'.
      
    } catch (error) {
      if(error.response){
        setErrors({ submit: error.response.data.mensaje || 'Error en el inicio de sesión' });
      } else {
        setErrors({ submit: 'Error de conexión con el servidor' });
      }
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