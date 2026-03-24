import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user ID or token exists in localStorage
  const isAuthenticated = localStorage.getItem('userId'); 

  if (!isAuthenticated) {
    // If not logged in, send them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;