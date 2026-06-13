import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

export default function ProtectedRoute({ children, roles }) {
  const { usuario, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(...roles)) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Acceso restringido</h2>
          <p className="text-gray-500">No tiene permisos para acceder a esta sección.</p>
        </div>
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
}
