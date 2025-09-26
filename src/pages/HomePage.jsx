// src/pages/HomePage.jsx

import { useNavigate } from 'react-router-dom';
import muñequito from '../assets/muñequito.png'; // Asegúrate que la ruta a los assets sea correcta
import './home.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* ... (el resto del código JSX es idéntico) ... */}
      <div className="left-content">
        <h1 className="main-title">Take a Break</h1>
        <p className="subtitle">
          Tu momento para respirar y avanzar
          <span className="dots">●●●</span>
        </p>
        <img 
          src={muñequito} 
          alt="Muñeco-head" 
          className="character-image"
        />
      </div>
      <div className="right-content">
        <h2 className="right-title">Comienza aquí</h2>
        <div className="buttons-container">
          <button className="login-button" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className="register-button" onClick={() => navigate('/register')}>
            Registrarse
          </button>
        </div>
        <div className="footer">
          <button type="button" className="footer-link" onClick={() => {/* TODO: handle terms of use click */}}>
            Términos de uso
          </button>
        </div>
      </div>
    </div>
  );
}