import { useAuth } from './AuthContext'; //custom Auth context to access authentication state
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useAuth(); // Get the current user from Auth context
  const location = useLocation(); // Get the current location for redirect purposes

  // If the user is authenticated, render the child components (Outlet).
  // Otherwise, redirect the user to the login page, preserving the current location.
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;