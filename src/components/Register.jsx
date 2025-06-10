import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    fechaNacimiento: null
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido) {
      newErrors.apellido = 'Los apellidos son requeridos';
    } else if (formData.apellido.length < 2) {
      newErrors.apellido = 'Los apellidos deben tener al menos 2 caracteres';
    }

    if (!formData.correo) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(formData.correo)) {
      newErrors.correo = 'Correo electrónico inválido';
    }

    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 8) {
      newErrors.contraseña = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.contraseña)) {
      newErrors.contraseña = 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial';
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else if (formData.fechaNacimiento > new Date()) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser en el futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const dataToSend = {
          ...formData,
          fechaNacimiento: formData.fechaNacimiento.toISOString()
        };

        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          navigate('/');
        } else {
          const data = await response.json();
          setErrors({ submit: data.message || 'Error en el registro' });
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ submit: 'Error de conexión con el servidor' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box className="register-box">
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
              className="register-input"
              margin="normal"
              required
              fullWidth
              id="nombre"
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              className="register-input"
              margin="normal"
              required
              fullWidth
              id="apellido"
              label="Apellidos"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
            <TextField
              className="register-input"
              margin="normal"
              required
              fullWidth
              id="correo"
              label="Correo Electrónico"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              error={!!errors.correo}
              helperText={errors.correo}
            />
            <TextField
              className="register-input"
              margin="normal"
              required
              fullWidth
              id="contraseña"
              label="Contraseña"
              name="contraseña"
              type="password"
              value={formData.contraseña}
              onChange={handleChange}
              error={!!errors.contraseña}
              helperText={errors.contraseña}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={formData.fechaNacimiento}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, fechaNacimiento: newValue }))
                }
                slotProps={{
                  textField: {
                    className: 'register-input',
                    margin: 'normal',
                    required: true,
                    fullWidth: true,
                    error: !!errors.fechaNacimiento,
                    helperText: errors.fechaNacimiento
                  }
                }}
              />
            </LocalizationProvider>

            {errors.submit && (
              <Typography color="error" align="center">
                {errors.submit}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained" className="register-button">
              Registrarse
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