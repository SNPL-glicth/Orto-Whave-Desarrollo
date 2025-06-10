import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Eliminar el prefijo 'ROLE_' del rol si existe
      const userRole = user.rol?.replace('ROLE_', '').toLowerCase();
      
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          // Si el rol no coincide con ninguno de los anteriores
          navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-600">Redirigiendo...</div>
    </div>
  );
};

export default Dashboard; 