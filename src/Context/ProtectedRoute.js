import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext'; // Hook de autenticación

// Componente para proteger rutas con roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth(); // Obtiene el usuario actual y sus datos

  // Mostrar un cargando mientras los datos del usuario están cargando
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!currentUser) {
    // Si no hay un usuario autenticado, redirige al login
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    // Si el usuario no tiene el rol permitido, redirige a la página de acceso denegado
    return <Navigate to="/access-denied" />;
  }

  // Si el usuario está autenticado y tiene un rol permitido, renderiza los hijos (children)
  return children;
};

export default ProtectedRoute;
