// 📂 Archivo: src/features/users/components/ExploreUsers.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';

const ExploreUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Cargar la lista de todos los usuarios cuando el componente se monta
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // (Necesitaremos crear este endpoint en el backend después)
        const response = await apiClient.get('/api/v1/users/');
        setAllUsers(response.data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // 2. La función para enviar la solicitud de amistad que definimos antes
  const handleSendRequest = async (recipientId) => {
    try {
      const response = await apiClient.post('/api/v1/friends/request', { recipientId });
      alert(response.data.message);
      // Aquí actualizaremos la UI para mostrar "Solicitud Enviada"
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo enviar la solicitud.');
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  // 3. Renderizar la lista de usuarios con el botón para agregar
  return (
    <div>
      <h2>Explorar Usuarios</h2>
      {allUsers.map(user => (
        <div key={user._id}>
          <p>{user.nombre}</p>
          <button onClick={() => handleSendRequest(user._id)}>
            ➕ Agregar Amigo
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExploreUsers;