import { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

// 1. IMPORTAMOS TU NUEVA IMAGEN
import monitolibro from '../../../assets/monitolibro.png';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', edad: '', sexo: ''
  });

  const [errors, setErrors] = useState({});

  // ... (Toda tu lógica de validación se queda igual) ...
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    else if (formData.nombre.length < 2) newErrors.nombre = 'Mínimo 2 caracteres';
    
    if (!formData.apellido) newErrors.apellido = 'Apellidos requeridos';
    
    if (!formData.email) newErrors.email = 'Email requerido';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = 'Correo inválido';

    if (!formData.password) newErrors.password = 'Contraseña requerida';
    else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Requiere mayúscula, minúscula, número y símbolo';
    }

    if (!formData.edad) newErrors.edad = 'Edad requerida';
    
    if (!formData.sexo) newErrors.sexo = 'Sexo requerido';

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
          preferences: { generos: [], autores: [] },
          plataforma: []
        };
        
        await apiClient.post('/api/v1/auth/register', dataToSend);
        navigate('/login?registered=true');
      } catch (error) {
        if (error.response){
          setErrors({ submit: error.response.data.mensaje || 'Error en el registro' });
        } else {
          setErrors({ submit: 'Error de conexión con el servidor' });
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* 2. AQUÍ ESTÁ EL MONITO CON VIDA (Animación) */}
      <Box 
        component="img"
        src={monitolibro} 
        alt="Personaje leyendo"
        sx={{
          width: '120px', 
          height: 'auto',
          mb: 2, // Margen abajo
          filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Definimos la animación flotante por si no está global */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* 3. FORMULARIO LIMPIO (Sin Cards ni Shapes extra, el padre ya tiene el cristal) */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
            margin="dense"
            required fullWidth
            label="Nombre" name="nombre"
            value={formData.nombre} onChange={handleChange}
            error={!!errors.nombre} helperText={errors.nombre}
            />
            <TextField
            margin="dense"
            required fullWidth
            label="Apellidos" name="apellido"
            value={formData.apellido} onChange={handleChange}
            error={!!errors.apellido} helperText={errors.apellido}
            />
        </Box>

        <TextField
          margin="dense"
          required fullWidth
          label="Correo Electrónico" name="email"
          value={formData.email} onChange={handleChange}
          error={!!errors.email} helperText={errors.email}
        />
        <TextField
          margin="dense"
          required fullWidth
          label="Contraseña" name="password" type="password"
          value={formData.password} onChange={handleChange}
          error={!!errors.password} helperText={errors.password}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
            margin="dense"
            required fullWidth
            label="Edad" name="edad" type="number"
            value={formData.edad} onChange={handleChange}
            error={!!errors.edad} helperText={errors.edad}
            />
            <TextField
            select
            label="Sexo" name="sexo"
            value={formData.sexo} onChange={handleChange}
            fullWidth margin="dense" required
            error={!!errors.sexo} helperText={errors.sexo}
            >
            <MenuItem value="masculino">Masculino</MenuItem>
            <MenuItem value="femenino">Femenino</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
            </TextField>
        </Box>

        {errors.submit && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {errors.submit}
          </Typography>
        )}

        <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
                mt: 3, mb: 2, 
                bgcolor: 'white', 
                color: '#e73c7e', 
                fontWeight: 'bold',
                borderRadius: '50px',
                '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)' }
            }}
        >
          REGISTRARSE
        </Button>
        
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/login')}
          sx={{ color: 'white', textTransform: 'none' }}
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Register;