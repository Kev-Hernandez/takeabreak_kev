// fileName: src/layouts/DashboardLayout.jsx (VERSIÓN MODULARIZADA)

import { Box, Dialog, Drawer } from '@mui/material';
import { ChatProvider } from '../context/ChatContext';
import { DashboardProvider, useDashboardContext } from '../context/DashboardContext';

import ProfileEditor from '../features/profile/components/ProfileEditor';
import ChatWindow from '../features/chat/components/ChatWindow';
import UsersOn from '../features/chat/components/UsersOn';
import UserContactList from '../features/users/components/UserContactList';
import Sidebar from './SideBar';
import OnboardingDialog from '../features/onboarding/components/OnboardingDialog';

// Componente interno que renderiza la UI y tiene acceso a ambos contextos
const DashboardUI = () => {
  const { 
    isProfileOpen, closeProfile, 
    isUsersDrawerOpen, closeUsersDrawer, 
    isOnboardingOpen, handleOnboardingComplete 
  } = useDashboardContext();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <UserContactList />
      <Box sx={{ flex: 2, display: 'flex' }}>
        <ChatWindow />
      </Box>

      {/* MODALES Y DRAWERS */}
      <Dialog open={isProfileOpen} onClose={closeProfile} maxWidth="md">
        <ProfileEditor />
      </Dialog>
      <Drawer anchor="right" open={isUsersDrawerOpen} onClose={closeUsersDrawer}>
        <UsersOn onUserSelected={closeUsersDrawer} />
      </Drawer>
      <OnboardingDialog 
        open={isOnboardingOpen} 
        onClose={handleOnboardingComplete} 
      />
    </Box>
  );
};

// El layout principal ahora solo se encarga de proveer los contextos
const DashboardLayout = () => {
  return (
    <ChatProvider>
      <DashboardProvider>
        <DashboardUI />
      </DashboardProvider>
    </ChatProvider>
  );
};

export default DashboardLayout;