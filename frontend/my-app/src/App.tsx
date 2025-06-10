import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { authService } from './services/auth.service';

// Componente de protección de rutas
const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const user = authService.getCurrentUser();
  
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['administrador']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard/doctor"
          element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard/patient"
          element={
            <PrivateRoute allowedRoles={['paciente']}>
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        {/* Redirección por defecto al login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App; 