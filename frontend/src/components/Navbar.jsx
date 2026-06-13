import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { toggleSidebar } = useTheme();

  return (
    <header className="bg-primary-900 text-white h-16 flex items-center justify-between px-4 shadow-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-primary-800 lg:hidden">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-semibold text-lg leading-tight">Sistema de Costes Logísticos</h1>
          <p className="text-xs text-primary-200 hidden sm:block">Gestión y control de operaciones logísticas</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-primary-800/60 px-3 py-1.5 rounded-md">
          <User size={16} />
          <div className="text-sm leading-tight">
            <p className="font-medium">{usuario?.nombre}</p>
            <p className="text-xs text-primary-200">{usuario?.rol}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="p-2 rounded hover:bg-primary-800 transition-colors flex items-center gap-1"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-sm">Salir</span>
        </button>
      </div>
    </header>
  );
}
