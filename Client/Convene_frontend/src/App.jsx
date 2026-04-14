import { useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './styles/globals.css';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Tutors from './pages/Tutors';
import Sessions from './pages/Sessions';
import Summaries from './pages/Summaries';
import Support from './pages/Support';
import ConsultationRoom from './pages/ConsultationRoom';
import InfoPage from './pages/InfoPage';
import { clearAuthSession, logout } from './lib/api';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" replace />;
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  return (
    <Auth
      initialMode={mode}
      onSuccess={() => navigate('/dashboard', { replace: true })}
      onBack={() => navigate('/')}
    />
  );
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Convene';
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (localStorage.getItem('auth_token')) {
        await logout();
      }
    } catch {
      // Swallow API logout errors and clear the local session regardless.
    }

    clearAuthSession();
    navigate('/');
  }, [navigate]);

  return (
    <Routes>
        <Route path="/" element={<Landing onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="role" />} />
        <Route path="/privacy" element={<InfoPage variant="privacy" />} />
        <Route path="/terms" element={<InfoPage variant="terms" />} />
        <Route path="/contact" element={<InfoPage variant="contact" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/tutors"
          element={
            <PrivateRoute>
              <Tutors onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/sessions"
          element={
            <PrivateRoute>
              <Sessions onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/sessions/:sessionId/room"
          element={
            <PrivateRoute>
              <ConsultationRoom onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/summaries"
          element={
            <PrivateRoute>
              <Summaries onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/support"
          element={
            <PrivateRoute>
              <Support onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}