// src/pages/LoginPage.jsx

import { Box, Typography, Container, Paper } from '@mui/material';
import monitorange from '../assets/monitorange.png';
import '../styles/login.css';
import LoginForm from '../features/authentication/components/LoginForm'; // <-- IMPORTANTE

const LoginPage = () => {
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
          style={{ maxHeight: '200px' }}
        />
        <Paper elevation={0} className="MuiPaper-root login-paper">
          <Typography className="MuiTypography-root login-title">
            Take a Break
          </Typography>
          <Typography className="MuiTypography-root login-subtitle">
            Iniciar Sesión
          </Typography>
          
          {/* Aquí se renderiza el componente del formulario */}
          <LoginForm />

        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;