import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = {
    colors: {
      primary: '#1e3a8a', // azul corporativo
      secondary: '#64748b', // gris
      background: '#f1f5f9',
      surface: '#ffffff',
    },
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
