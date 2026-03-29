import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './styles/globals.css';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/');
  };

  return (
    <>
        <title>Convene</title>
        <link rel="icon" type="image/png" href="/CONVENE_LOGO.png"></link>
        <Routes>
        <Route path="/" element={<Landing onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="role" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
    
  );
}