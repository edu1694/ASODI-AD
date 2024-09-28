// ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute; // Asegúrate de que esto esté presente
