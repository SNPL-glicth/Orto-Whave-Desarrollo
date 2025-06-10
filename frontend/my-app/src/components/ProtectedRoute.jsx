import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si se especifica un rol requerido, verificar que el usuario tenga ese rol
  if (requiredRole && user.rol?.replace('ROLE_', '').toLowerCase() !== requiredRole.toLowerCase()) {
    // Si el usuario no tiene el rol requerido, redirigir a su dashboard correspondiente
    const userRole = user.rol?.replace('ROLE_', '').toLowerCase();
    return <Navigate to={`/${userRole}/dashboard`} />;
  }

  return children;
};

export default ProtectedRoute; 