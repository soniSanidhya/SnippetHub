import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}