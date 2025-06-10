import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [errors, setErrors] = useState({});
  const [emailValidations, setEmailValidations] = useState({
    startLetter: false,
    hasNumber: false,
    allowedChars: false,
    hasAt: false,
    validDomain: false,
    hasDot: false,
    validSystemType: false
  });

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const validateEmail = (email) => {
    const validations = {
      startLetter: /^[a-zA-Z]/.test(email),
      hasNumber: /[0-9]/.test(email),
      allowedChars: /^[a-zA-Z0-9._@-]+$/.test(email),
      hasAt: /@/.test(email),
      validDomain: /@[a-z0-9]+/.test(email),
      hasDot: /\.[a-z]{2,}(?:\.mx)?$/.test(email),
      validSystemType: /\.(com|edu|org|net|gov|mx)$/.test(email)
    };
    setEmailValidations(validations);
    return Object.values(validations).every(v => v);
  };

  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordValidations(validations);
    return Object.values(validations).every(v => v);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.correo) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'Por favor ingrese un correo electrónico válido';
    }

    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (!validatePassword(formData.contraseña)) {
      newErrors.contraseña = 'La contraseña no cumple con los requisitos de seguridad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate('/chat');
        } else {
          const data = await response.json();
          setErrors({ submit: data.message || 'Error en el inicio de sesión' });
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ submit: 'Error de conexión con el servidor' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (name === 'correo') {
      validateEmail(value);
    } else if (name === 'contraseña') {
      validatePassword(value);
    }
  };

  return (
    <Box>
      <Container maxWidth="xs">
        <Paper elevation={0}>
          <Typography align="center">Take a Break</Typography>
          <Typography align="center">Iniciar Sesión</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              id="correo" 
              label="Correo Electrónico" 
              name="correo" 
              autoComplete="email" 
              value={formData.correo} 
              onChange={handleChange} 
              error={!!errors.correo} 
              helperText={errors.correo}
            />
            {formData.correo && (
              <List dense>
                {Object.entries(emailValidations).map(([key, valid]) => (
                  !valid && <ListItem key={key}><ListItemText primary={{
                    startLetter: "Debe comenzar con una letra",
                    hasNumber: "Debe contener al menos un número",
                    allowedChars: "Solo se permiten letras, números y los caracteres . _ @ -",
                    hasAt: "Debe contener @",
                    validDomain: "Debe tener un dominio válido después de @",
                    hasDot: "Debe contener un punto seguido de la extensión",
                    validSystemType: "Debe terminar en .com, .edu, .org, .net, .gov o .mx"
                  }[key]} /></ListItem>
                ))}
              </List>
            )}
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              name="contraseña" 
              label="Contraseña" 
              type="password" 
              id="contraseña" 
              value={formData.contraseña} 
              onChange={handleChange} 
              error={!!errors.contraseña} 
              helperText={errors.contraseña}
            />
            {formData.contraseña && (
              <List dense>
                {Object.entries(passwordValidations).map(([key, valid]) => (
                  !valid && <ListItem key={key}><ListItemText primary={{
                    minLength: "Debe tener al menos 8 caracteres",
                    hasUpperCase: "Debe contener al menos una letra mayúscula",
                    hasLowerCase: "Debe contener al menos una letra minúscula",
                    hasNumber: "Debe contener al menos un número",
                    hasSpecialChar: "Debe contener al menos un carácter especial (!@#$%^&*(),.?\"{}|<>)"
                  }[key]} /></ListItem>
                ))}
              </List>
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
          <Typography variant="body2">
            ¿Aun no te has registrado?
            <Button
              component="a"
              href="/register"
              variant="text"
              sx={{
                ml: 1,
                '&:hover': {
                  cursor: 'pointer'
                }
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