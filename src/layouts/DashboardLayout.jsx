import { useState } from 'react';
import { Box, Dialog, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChatProvider } from '../context/ChatContext';
import ProfileEditor from '../features/profile/components/ProfileEditor';
import ChatWindow from '../features/chat/components/ChatWindow';
import UsersOn from '../features/chat/components/UsersOn';
import UserContactList from '../features/users/components/UserContactList';
import Sidebar from './SideBar';

const DashboardLayout = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  }

  return (
    <ChatProvider>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        
        <Sidebar 
          onOpenProfile={() => setOpenProfile(true)} 
          onOpenActiveUsers={() => setDrawerOpen(true)}
          onLogout={handleLogout}
        />
        <UserContactList />
        <ChatWindow />
        <Dialog open={openProfile} onClose={() => setOpenProfile(false)}>
          <ProfileEditor />
        </Dialog>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {/* Le pasamos una función para que se pueda cerrar desde adentro */}
          <UsersOn onUserSelected={() => setDrawerOpen(false)} /> 
        </Drawer>
      </Box>
    </ChatProvider>
  );
};

export default DashboardLayout;