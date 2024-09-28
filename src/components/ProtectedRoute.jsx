import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado inicial como null
  const location = useLocation();

  // Verifica la autenticación al montar el componente
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true'); // Solo se ejecuta una vez
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez

  // Muestra un indicador de carga mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirigir si no está autenticado y no está en la página de inicio de sesión
  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  // Renderiza los hijos si está autenticado o ya está en la página de inicio de sesión
  return children;
}

export default ProtectedRoute;
