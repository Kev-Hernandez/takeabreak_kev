// src/pages/RegisterPage.jsx

import { Box, Typography, Container, Paper } from '@mui/material';
import '../styles/register.css';
import RegisterForm from '../features/authentication/components/RegisterForm'; // <-- IMPORTANTE

const RegisterPage = () => {
  return (
    <Box className="register-box">
      {/* Figuras decorativas */}
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

          {/* Aquí se renderiza el componente del formulario de registro */}
          <RegisterForm />

        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;