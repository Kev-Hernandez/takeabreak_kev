import { useNavigate } from 'react-router-dom';
import muñequito from '../assets/muñequito.png';
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Formas decorativas */}
      <div className="decorative-shape shape-1"></div>
      <div className="decorative-shape shape-2"></div>
      <div className="decorative-shape shape-3"></div>
      <div className="decorative-shape shape-4"></div>

      {/* Círculo con efecto de pulso */}
      <div className="pulse-circle"></div>

      {/* Contenido lado izquierdo */}
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

      {/* Contenido lado derecho */}
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

        {/* Pie de página */}
        <div className="footer">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" className="footer-link">Términos de uso</a>
        </div>
      </div>
    </div>
  );
}