import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ResidentesTable from './components/residentes/ResidentesTable';
import FinanzasPage from './components/finanzas/FinanzasPage';
import SeguridadPage from './components/seguridad/SeguridadPage';
import MantenimientoPage from './components/mantenimiento/MantenimientoPage';
import ReservasTable from './components/reservas/ReservasTable';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="residentes" element={<ResidentesTable />} />
            <Route path="finanzas" element={<FinanzasPage />} />
            <Route path="seguridad" element={<SeguridadPage />} />
            <Route path="mantenimiento" element={<MantenimientoPage />} />
            <Route path="reservas" element={<ReservasTable />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
