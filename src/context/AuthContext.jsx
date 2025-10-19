// 📁 Archivo: src/context/AuthContext.jsx (NUEVO ARCHIVO)

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Crear el "Proveedor" (el "cerebro")
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para saber si estamos cargando al usuario
  const navigate = useNavigate();

  // 3. Efecto para cargar al usuario desde sessionStorage al iniciar
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      // Limpiar en caso de datos corruptos
      sessionStorage.clear();
    }
    setIsLoading(false); // Terminamos de cargar
  }, []);

  // 4. Función de Login
  const login = async (formData) => {
    // La lógica de tu LoginForm se muda aquí
    const response = await apiClient.post('/api/v1/auth/login', formData);
    const data = response.data;

    // Guardar en el estado de React
    setUser(data.usuario);
    setToken(data.token);
    
    // Guardar en sessionStorage para persistencia
    sessionStorage.setItem('user', JSON.stringify(data.usuario));
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('idUsuario', data.usuario._id || data.usuario.id);
  };

  // 5. Función de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
    navigate('/login');
  };

  // 6. Exponer los datos y funciones
  const value = {
    user,
    token,
    isLoadingUser: isLoading, // Lo exponemos con un nombre claro
    login,
    logout,
    // Función para actualizar el usuario desde otros componentes (como el onboarding)
    updateUser: (updatedUserData) => {
      setUser(updatedUserData);
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children} {/* Solo renderiza la app cuando sabemos si hay usuario o no */}
    </AuthContext.Provider>
  );
};

// 7. Hook personalizado para consumir el contexto fácilmente
export const useAuthContext = () => {
  return useContext(AuthContext);
};