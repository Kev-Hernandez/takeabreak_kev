// fileName: src/context/DashboardContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardContext = createContext();

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUsersDrawerOpen, setIsUsersDrawerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const navigate = useNavigate();

  // Lógica para decidir si se muestra la encuesta de onboarding
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser && !currentUser.hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };
  
  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    // Estados
    isProfileOpen,
    isUsersDrawerOpen,
    isOnboardingOpen,
    // Funciones
    openProfile: () => setIsProfileOpen(true),
    closeProfile: () => setIsProfileOpen(false),
    toggleUsersDrawer: () => setIsUsersDrawerOpen(prev => !prev),
    closeUsersDrawer: () => setIsUsersDrawerOpen(false),
    handleLogout,
    handleOnboardingComplete,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};