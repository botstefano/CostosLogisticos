import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Adjunta el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maneja expiración de sesión (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Descarga un archivo binario (PDF/Excel) desde el backend usando el token JWT
 * y lo guarda en el navegador del usuario.
 */
export async function descargarArchivo(url, filenameFallback = 'reporte') {
  const response = await api.get(url, { responseType: 'blob' });

  const disposition = response.headers['content-disposition'];
  let filename = filenameFallback;
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }

  const blob = new Blob([response.data]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

