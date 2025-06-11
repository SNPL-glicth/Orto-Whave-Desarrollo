import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importación de páginas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { AdminDashboard } from '../components/dashboards/AdminDashboard.tsx';
import { DoctorDashboard } from '../components/dashboards/DoctorDashboard.tsx';
import { PatientDashboard } from '../components/dashboards/PatientDashboard.tsx';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.rol?.toLowerCase()) {
    case 'administrador':
      return <Navigate to="/dashboard/admin" />;
    case 'doctor':
      return <Navigate to="/dashboard/doctor" />;
    case 'paciente':
      return <Navigate to="/dashboard/patient" />;
    default:
      console.log('Rol no reconocido:', user.rol);
      return <Navigate to="/login" />;
  }
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ruta de redirección según rol */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="any">
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Rutas específicas por rol */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="administrador">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute requiredRole="paciente">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes; 