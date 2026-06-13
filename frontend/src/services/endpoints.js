import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const proveedoresService = {
  listar: () => api.get('/proveedores'),
  crear: (data) => api.post('/proveedores', data),
  actualizar: (id, data) => api.put(`/proveedores/${id}`, data),
  eliminar: (id) => api.delete(`/proveedores/${id}`),
};

export const productosService = {
  listar: () => api.get('/productos'),
  bajoStock: () => api.get('/productos/bajo-stock'),
  crear: (data) => api.post('/productos', data),
  actualizar: (id, data) => api.put(`/productos/${id}`, data),
  eliminar: (id) => api.delete(`/productos/${id}`),
};

export const almacenesService = {
  listar: () => api.get('/almacenes'),
  crear: (data) => api.post('/almacenes', data),
  actualizar: (id, data) => api.put(`/almacenes/${id}`, data),
  eliminar: (id) => api.delete(`/almacenes/${id}`),
};

export const vehiculosService = {
  listar: () => api.get('/vehiculos'),
  crear: (data) => api.post('/vehiculos', data),
  actualizar: (id, data) => api.put(`/vehiculos/${id}`, data),
  eliminar: (id) => api.delete(`/vehiculos/${id}`),
};

export const comprasService = {
  listar: () => api.get('/compras'),
  obtener: (id) => api.get(`/compras/${id}`),
  crear: (data) => api.post('/compras', data),
  actualizarEstado: (id, estado) => api.put(`/compras/${id}/estado`, { estado }),
  recibir: (id, almacen_id) => api.post(`/compras/${id}/recibir`, { almacen_id }),
};

export const inventarioService = {
  listar: (params) => api.get('/inventarios', { params }),
  ajustar: (data) => api.post('/inventarios/ajuste', data),
};

export const costesAlmacenamientoService = {
  listar: () => api.get('/costes-almacenamiento'),
  crear: (data) => api.post('/costes-almacenamiento', data),
};

export const costesTransporteService = {
  listar: () => api.get('/costes-transporte'),
  crear: (data) => api.post('/costes-transporte', data),
};

export const costesTotalesService = {
  listar: () => api.get('/costes-totales'),
  dashboard: (params) => api.get('/costes-totales/dashboard', { params }),
  costePorUnidad: (productoId) => api.get(`/costes-totales/producto/${productoId}/coste-unitario`),
  rentabilidadOrden: (ordenId) => api.get(`/costes-totales/orden/${ordenId}/rentabilidad`),
};

export const alertasService = {
  listar: (estado) => api.get('/alertas', { params: estado ? { estado } : {} }),
  actualizarEstado: (id, estado) => api.put(`/alertas/${id}/estado`, { estado }),
  configuracion: () => api.get('/alertas/configuracion'),
  actualizarConfiguracion: (tipo, data) => api.put(`/alertas/configuracion/${tipo}`, data),
};

export const distribucionesService = {
  listar: () => api.get('/distribuciones'),
  crear: (data) => api.post('/distribuciones', data),
  actualizarEstado: (id, data) => api.put(`/distribuciones/${id}/estado`, data),
};

export const trazabilidadService = {
  panel: (estado) => api.get('/trazabilidad', { params: estado ? { estado } : {} }),
  ordenDetalle: (id) => api.get(`/trazabilidad/orden/${id}`),
};

export const auditoriaService = {
  listar: (params) => api.get('/auditorias', { params }),
};

export const usuariosService = {
  listar: () => api.get('/usuarios'),
  roles: () => api.get('/usuarios/roles'),
  crear: (data) => api.post('/usuarios', data),
  actualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  resetPassword: (id, password_nueva) => api.put(`/usuarios/${id}/reset-password`, { password_nueva }),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

export const backupsService = {
  listar: () => api.get('/backups'),
  crear: () => api.post('/backups'),
};

export const REPORT_TABLES = [
  { key: 'proveedores', label: 'Proveedores' },
  { key: 'productos', label: 'Productos' },
  { key: 'inventarios', label: 'Inventarios' },
  { key: 'ordenes_compra', label: 'Órdenes de Compra' },
  { key: 'costes_almacenamiento', label: 'Costes de Almacenamiento' },
  { key: 'costes_transporte', label: 'Costes de Transporte' },
  { key: 'costes_logisticos_totales', label: 'Costes Logísticos Totales' },
  { key: 'alertas_sobrecostes', label: 'Alertas de Sobrecostes' },
  { key: 'vehiculos', label: 'Vehículos' },
  { key: 'auditorias', label: 'Auditorías' },
];
