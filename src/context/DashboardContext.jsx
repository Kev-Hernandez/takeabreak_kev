import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from './AuthContext'; 

const DashboardContext = createContext();

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);


  const { user, isLoadingUser, logout, updateUser } = useAuthContext(); 

 
  useEffect(() => {
    
    if (!isLoadingUser && user) {
      
      if (user.hasCompletedOnboarding === false) {
        setIsOnboardingOpen(true);
      }
    }
  }, [user, isLoadingUser]); 

  const handleLogout = () => {
    logout(); 
  };
  
  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    
    if (user) {
      updateUser({ ...user, hasCompletedOnboarding: true });
    }
  };

  const value = {
    isProfileOpen,
    isUsersDrawerOpen,
    isOnboardingOpen,
    openProfile: () => setIsProfileOpen(true),
    closeProfile: () => setIsProfileOpen(false),
    toggleUsersDrawer: () => setIsUsersDrawerOpen(prev => !prev),
    closeUsersDrawer: () => setIsUsersDrawerOpen(false),
    handleLogout,
    handleOnboardingComplete,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};