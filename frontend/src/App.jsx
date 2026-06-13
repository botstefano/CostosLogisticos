import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Compras from './pages/Compras';
import Inventario from './pages/Inventario';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores';
import Almacenes from './pages/Almacenes';
import Vehiculos from './pages/Vehiculos';
import Costes from './pages/Costes';
import Distribucion from './pages/Distribucion';
import Alertas from './pages/Alertas';
import Trazabilidad from './pages/Trazabilidad';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Auditoria from './pages/Auditoria';
import Backups from './pages/Backups';

const TODOS = ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'];

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<ProtectedRoute roles={TODOS}><Dashboard /></ProtectedRoute>} />
        <Route path="/compras" element={<ProtectedRoute roles={TODOS}><Compras /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute roles={TODOS}><Inventario /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute roles={TODOS}><Productos /></ProtectedRoute>} />
        <Route path="/proveedores" element={<ProtectedRoute roles={TODOS}><Proveedores /></ProtectedRoute>} />
        <Route path="/almacenes" element={<ProtectedRoute roles={TODOS}><Almacenes /></ProtectedRoute>} />
        <Route path="/vehiculos" element={<ProtectedRoute roles={TODOS}><Vehiculos /></ProtectedRoute>} />
        <Route path="/costes" element={<ProtectedRoute roles={TODOS}><Costes /></ProtectedRoute>} />
        <Route path="/distribucion" element={<ProtectedRoute roles={TODOS}><Distribucion /></ProtectedRoute>} />
        <Route path="/alertas" element={<ProtectedRoute roles={TODOS}><Alertas /></ProtectedRoute>} />
        <Route path="/trazabilidad" element={<ProtectedRoute roles={TODOS}><Trazabilidad /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute roles={TODOS}><Reportes /></ProtectedRoute>} />

        <Route path="/usuarios" element={<ProtectedRoute roles={['Administrador']}><Usuarios /></ProtectedRoute>} />
        <Route path="/auditoria" element={<ProtectedRoute roles={['Administrador', 'Supervisor']}><Auditoria /></ProtectedRoute>} />
        <Route path="/backups" element={<ProtectedRoute roles={['Administrador']}><Backups /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
