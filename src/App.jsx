import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ResidentesTable from './components/residentes/ResidentesTable';
import CuotasTable from './components/finanzas/CuotasTable';
import AlertasPanel from './components/seguridad/AlertasPanel';
import TicketsPanel from './components/mantenimiento/TicketsPanel';
import ReservasTable from './components/reservas/ReservasTable';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="residentes" element={<ResidentesTable />} />
            <Route path="finanzas" element={<CuotasTable />} />
            <Route path="seguridad" element={<AlertasPanel />} />
            <Route path="mantenimiento" element={<TicketsPanel />} />
            <Route path="reservas" element={<ReservasTable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
