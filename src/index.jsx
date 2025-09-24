import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👉 Importa BrowserRouter
import './styles/index.css'

//rutas
import { Routes, Route } from 'react-router-dom';
import Profile from './components/Users/Profile';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/chat/Chat';
import UsersList from './components/Users/UsersList';
import ProtectedRoute from './middleware/protectedViws';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/takeabreak_kev"> {/* 👉 Envuelve App con esto */}
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
      
            //rutas protegidas
            <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersList />} />
            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            </Route>
      
          </Routes>
    </BrowserRouter>
  </StrictMode>
)
