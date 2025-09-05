import { Navigate } from 'react-router-dom';
import { authApi } from '../api/notesApi';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
