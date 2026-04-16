import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps protected pages — if the user isn't logged in, redirect them to /login
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
