// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import muñequito from '../assets/muñequito.png'; 
import './home.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      
      {/* Tarjeta de Cristal Ancha */}
      <div className="hero-card">
        
        {/* --- IZQUIERDA: Texto y Botones --- */}
        <div className="left-content">
          
          {/* Contenedor del Título + Barras de Audio */}
          <div className="title-wrapper">
            <h1 className="main-title">Take a Break</h1>
            
            {/* Las barritas bailando */}
            <div className="sound-wave">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>

          <p className="subtitle">
            Tu momento para respirar, escuchar y avanzar hacia tu bienestar emocional.
          </p>
          
          <div className="buttons-container">
            <button className="login-button" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
            <button className="register-button" onClick={() => navigate('/register')}>
              Registrarse
            </button>
          </div>
        </div>

        {/* --- DERECHA: Imagen --- */}
        <div className="right-content">
           <img 
            src={muñequito} 
            alt="Mascota escuchando música" 
            className="character-image"
          />
        </div>

      </div>
      
      {/* Footer flotante */}
      <div style={{ position: 'absolute', bottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
        © 2025 Take a Break
      </div>
    </div>
  );
}