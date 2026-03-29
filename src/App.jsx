import { useState } from 'react';
import './styles/globals.css';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState('landing');   // 'landing' | 'auth' | 'dashboard'
  const [authMode, setAuthMode] = useState('login');
  const [userRole, setUserRole] = useState(null);

  const goAuth = (mode = 'login') => {
    setAuthMode(mode);
    setPage('auth');
  };

  const onAuthSuccess = (role) => {
    setUserRole(role);
    setPage('dashboard');
  };

  return (
    <>
      {page === 'landing' && (
        <Landing
          onLogin={() => goAuth('login')}
          onSignup={() => goAuth('signup')}
        />
      )}

      {page === 'auth' && (
        <Auth
          initialMode={authMode}
          onSuccess={onAuthSuccess}
          onBack={() => setPage('landing')}
        />
      )}

      {page === 'dashboard' && (
        <Dashboard
          role={userRole}
          onLogout={() => setPage('landing')}
        />
      )}
    </>
  );
}