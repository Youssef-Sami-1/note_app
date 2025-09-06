import { Navigate } from 'react-router-dom';
import { authApi } from '../api/notesApi';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verify = async () => {
      // Quick local check first
      if (!authApi.isAuthenticated()) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      // Server-side validation: try to fetch current user (or fallback)
      try {
        await authApi.getCurrentUser();
        setAllowed(true);
      } catch (e) {
        // Invalid/expired token: clear it
        authApi.logout();
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-gray-600 text-sm">Checking session…</div>
      </div>
    );
  }

  if (!allowed) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
