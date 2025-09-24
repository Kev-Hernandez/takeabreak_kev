// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Box, Dialog, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Importaciones de componentes de features y layout
import ProfileEditor from '../features/profile/components/ProfileEditor';
import ChatWindow from '../features/chat/components/ChatWindow';
import UsersOn from '../features/chat/components/UsersOn';
import UserContactList from '../features/users/components/UserContactList';
import Sidebar from '../components/layout/SideBar';

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Estado para el ID del usuario actual
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el ID del usuario actual al cargar el componente
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser?._id) {
      setCurrentUserId(storedUser._id);
    }

    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/web/usuarios/activos');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchActiveUsers();
  }, []);

  const handleSearchChange = (searchTerm) => {
    const filtered = users.filter((user) =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUserFromDrawer = (user) => {
    setSelectedUser(user);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      <Sidebar 
        onOpenProfile={() => setOpenProfile(true)} 
        onOpenActiveUsers={() => setDrawerOpen(true)}
        onLogout={handleLogout}
      />

      <UserContactList
        users={filteredUsers}
        selectedUser={selectedUser}
        onSelectChat={setSelectedUser}
        onSearchChange={handleSearchChange}
      />

      <Box sx={{ flex: 2, display: 'flex' }}>
        <ChatWindow recipientUser={selectedUser} />
      </Box>

      {/* MODAL DE PERFIL */}
      <Dialog open={openProfile} onClose={() => setOpenProfile(false)}>
        <ProfileEditor />
      </Dialog>
      
      {/* DRAWER DE USUARIOS ACTIVOS */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UsersOn
          users={filteredUsers}
          onSelectUser={handleSelectUserFromDrawer}
          currentUserId={currentUserId} // <-- CORREGIDO: Se pasa el ID del estado
        />
      </Drawer>
    </Box>
  );
};

export default DashboardPage;