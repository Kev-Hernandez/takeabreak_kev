// fileName: src/App.jsx (VERSIÓN CORREGIDA)
import { Routes, Route } from 'react-router-dom'; // <-- Ya no importas BrowserRouter/Router
import ProtectedRoute from './middleware/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExploreUsers from './features/users/components/ExploreUsers';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  console.log('1. renederizando app')
  // Eliminamos <Router> de aquí
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/explore" element={<ExploreUsers />} />

      {/* Rutas Protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;