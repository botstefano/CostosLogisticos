import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Warehouse, ShoppingCart, Package,
  Boxes, AlertTriangle, Map, Users, History, DatabaseBackup, FileBarChart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/compras', label: 'Compras', icon: ShoppingCart, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/inventario', label: 'Inventario', icon: Boxes, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/productos', label: 'Productos', icon: Package, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/proveedores', label: 'Proveedores', icon: Users, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/almacenes', label: 'Almacenes', icon: Warehouse, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/vehiculos', label: 'Vehículos', icon: Truck, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/costes', label: 'Costes', icon: FileBarChart, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/distribucion', label: 'Distribución', icon: Map, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/alertas', label: 'Alertas', icon: AlertTriangle, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/trazabilidad', label: 'Trazabilidad', icon: Map, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/reportes', label: 'Reportes', icon: FileBarChart, roles: ['Administrador', 'Operador Logistico', 'Supervisor', 'Gerente'] },
  { to: '/usuarios', label: 'Usuarios', icon: Users, roles: ['Administrador'] },
  { to: '/auditoria', label: 'Auditoría', icon: History, roles: ['Administrador', 'Supervisor'] },
  { to: '/backups', label: 'Respaldos', icon: DatabaseBackup, roles: ['Administrador'] },
];

export default function Sidebar() {
  const { hasRole } = useAuth();
  const { sidebarOpen } = useTheme();

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-200 overflow-y-auto
        ${sidebarOpen ? 'w-60' : 'w-0 lg:w-60'} flex-shrink-0`}
    >
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.filter((item) => hasRole(...item.roles)).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-800'}`
              }
            >
              <Icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
