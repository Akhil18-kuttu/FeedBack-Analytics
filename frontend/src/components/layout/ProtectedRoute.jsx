import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PageLoader } from '../ui/Spinner';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
