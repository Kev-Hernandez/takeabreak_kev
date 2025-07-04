import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👉 Importa BrowserRouter
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/takeabreak_kev"> {/* 👉 Envuelve App con esto */}
      <App />
    </BrowserRouter>
  </StrictMode>
)
