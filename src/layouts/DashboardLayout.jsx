// src/layouts/DashboardLayout.jsx
import { Box, Dialog, Drawer } from '@mui/material';
import { ChatProvider } from '../context/ChatContext';
import { DashboardProvider, useDashboardContext } from '../context/DashboardContext';
import { APP_COLORS } from '../utils/constants';

// Componentes
import Sidebar from './SideBar';
import UserContactList from '../features/users/components/UserContactList';
import ChatWindow from '../features/chat/components/ChatWindow';

// Modales
import ProfileEditor from '../features/profile/components/ProfileEditor';
import UsersOn from '../features/chat/components/UsersOn';
import OnboardingDialog from '../features/onboarding/components/OnboardingDialog';

const DashboardUI = () => {
  const { isProfileOpen, closeProfile, isUsersDrawerOpen, closeUsersDrawer, isOnboardingOpen, handleOnboardingComplete } = useDashboardContext();

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      
      // LA REJILLA MAESTRA:
      display: 'grid',
      // Columna 1 (Auto: Sidebar), Columna 2 (Fijo: Contactos), Columna 3 (Flexible: Chat)
      gridTemplateColumns: 'auto 380px 1fr', 
      gap: '20px',
      
      // En móvil cambiamos a algo más simple (opcional, por ahora full desktop)
      '@media (max-width: 900px)': {
         gridTemplateColumns: '80px 1fr', // Ocultamos lista en tablet
      }
    }}>
      
      {/* 1. Sidebar (Altura automática gracias al grid) */}
      <Sidebar />
      
      {/* 2. Contactos */}
      <UserContactList />
      
      {/* 3. Chat */}
      <ChatWindow />

      {/* Capas flotantes */}
      <Dialog open={isProfileOpen} onClose={closeProfile} maxWidth="md" PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}>
        <ProfileEditor />
      </Dialog>
      
      <Drawer anchor="right" open={isUsersDrawerOpen} onClose={closeUsersDrawer}>
        <UsersOn onUserSelected={closeUsersDrawer} />
      </Drawer>
      
      <OnboardingDialog open={isOnboardingOpen} onClose={handleOnboardingComplete} />
    </Box>
  );
};

export default function DashboardLayout() {
  return (
    <ChatProvider>
      <DashboardProvider>
        <DashboardUI />
      </DashboardProvider>
    </ChatProvider>
  );
}