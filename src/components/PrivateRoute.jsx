// frontend/src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';

const PrivateRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Show toast notification when redirecting
    toast.error('Please sign in to access this feature', {
      duration: 3000,
      position: 'top-center',
    });
    
    // Redirect to sign-in page, but remember where the user was trying to go
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
