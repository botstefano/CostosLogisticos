const { query } = require('../database/db');
const { asyncHandler } = require('../middleware/validation');
const { generarPDF, generarExcel } = require('../utils/generadorReportes');
const { obtenerResumenCostes, obtenerTopProductosCosteAlmacenaje, obtenerCosteTransportePorKm } = require('../utils/calculosCostes');

/**
 * Definición de "fuentes de reporte" disponibles. Cada una define su consulta SQL
 * y las columnas a exportar.
 */
const FUENTES = {
  proveedores: {
    titulo: 'Proveedores',
    sql: 'SELECT id, nombre, contacto, telefono, email, direccion, activo FROM proveedores ORDER BY id',
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'nombre', label: 'Nombre', width: 30 },
      { key: 'contacto', label: 'Contacto', width: 20 },
      { key: 'telefono', label: 'Teléfono', width: 15 },
      { key: 'email', label: 'Email', width: 25 },
      { key: 'direccion', label: 'Dirección', width: 30 },
      { key: 'activo', label: 'Activo', width: 10 },
    ],
  },
  productos: {
    titulo: 'Productos',
    sql: `SELECT p.id, p.nombre, p.precio_unitario, p.stock_actual, p.stock_minimo, pr.nombre AS proveedor
          FROM productos p LEFT JOIN proveedores pr ON pr.id = p.proveedor_id ORDER BY p.id`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'nombre', label: 'Nombre', width: 30 },
      { key: 'precio_unitario', label: 'Precio Unitario', width: 15 },
      { key: 'stock_actual', label: 'Stock Actual', width: 12 },
      { key: 'stock_minimo', label: 'Stock Mínimo', width: 12 },
      { key: 'proveedor', label: 'Proveedor', width: 25 },
    ],
  },
  inventarios: {
    titulo: 'Inventarios',
    sql: `SELECT i.id, p.nombre AS producto, a.nombre AS almacen, i.cantidad, i.ubicacion_estanteria, i.ultima_actualizacion
          FROM inventarios i JOIN productos p ON p.id = i.producto_id JOIN almacenes a ON a.id = i.almacen_id
          ORDER BY a.nombre, p.nombre`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'producto', label: 'Producto', width: 30 },
      { key: 'almacen', label: 'Almacén', width: 25 },
      { key: 'cantidad', label: 'Cantidad', width: 12 },
      { key: 'ubicacion_estanteria', label: 'Ubicación', width: 15 },
      { key: 'ultima_actualizacion', label: 'Última Actualización', width: 22 },
    ],
  },
  ordenes_compra: {
    titulo: 'Órdenes de Compra',
    sql: `SELECT oc.id, p.nombre AS proveedor, oc.fecha_emision, oc.fecha_entrega_esperada,
                 oc.fecha_entrega_real, oc.total, oc.estado
          FROM ordenes_compra oc LEFT JOIN proveedores p ON p.id = oc.proveedor_id
          ORDER BY oc.id DESC`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'proveedor', label: 'Proveedor', width: 28 },
      { key: 'fecha_emision', label: 'Fecha Emisión', width: 15 },
      { key: 'fecha_entrega_esperada', label: 'Entrega Esperada', width: 15 },
      { key: 'fecha_entrega_real', label: 'Entrega Real', width: 15 },
      { key: 'total', label: 'Total', width: 12 },
      { key: 'estado', label: 'Estado', width: 15 },
    ],
  },
  costes_almacenamiento: {
    titulo: 'Costes de Almacenamiento',
    sql: `SELECT ca.id, a.nombre AS almacen, ca.fecha, ca.concepto, ca.tipo_gasto, ca.monto
          FROM costes_almacenamiento ca JOIN almacenes a ON a.id = ca.almacen_id
          ORDER BY ca.fecha DESC`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'almacen', label: 'Almacén', width: 25 },
      { key: 'fecha', label: 'Fecha', width: 14 },
      { key: 'concepto', label: 'Concepto', width: 30 },
      { key: 'tipo_gasto', label: 'Tipo de Gasto', width: 18 },
      { key: 'monto', label: 'Monto', width: 12 },
    ],
  },
  costes_transporte: {
    titulo: 'Costes de Transporte',
    sql: `SELECT ct.id, v.placa, ct.fecha, ct.ruta_origen, ct.ruta_destino, ct.kilometros_recorridos,
                 ct.coste_combustible, ct.coste_peajes, ct.coste_mantenimiento, ct.coste_conductor, ct.coste_total
          FROM costes_transporte ct JOIN vehiculos v ON v.id = ct.vehiculo_id
          ORDER BY ct.fecha DESC`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'placa', label: 'Vehículo', width: 12 },
      { key: 'fecha', label: 'Fecha', width: 14 },
      { key: 'ruta_origen', label: 'Origen', width: 20 },
      { key: 'ruta_destino', label: 'Destino', width: 20 },
      { key: 'kilometros_recorridos', label: 'KM', width: 10 },
      { key: 'coste_combustible', label: 'Combustible', width: 14 },
      { key: 'coste_peajes', label: 'Peajes', width: 12 },
      { key: 'coste_mantenimiento', label: 'Mantenimiento', width: 14 },
      { key: 'coste_conductor', label: 'Conductor', width: 12 },
      { key: 'coste_total', label: 'Total', width: 12 },
    ],
  },
  costes_logisticos_totales: {
    titulo: 'Costes Logísticos Totales',
    sql: `SELECT id, operacion_referencia, tipo_operacion, fecha, monto_total FROM costes_logisticos_totales ORDER BY fecha DESC`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'operacion_referencia', label: 'Operación', width: 18 },
      { key: 'tipo_operacion', label: 'Tipo', width: 18 },
      { key: 'fecha', label: 'Fecha', width: 14 },
      { key: 'monto_total', label: 'Monto Total', width: 14 },
    ],
  },
  alertas_sobrecostes: {
    titulo: 'Alertas de Sobrecostes',
    sql: `SELECT id, fecha, tipo, operacion_referencia, monto_esperado, monto_real, diferencia, porcentaje_exceso, estado
          FROM alertas_sobrecostes ORDER BY fecha DESC`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'fecha', label: 'Fecha', width: 18 },
      { key: 'tipo', label: 'Tipo', width: 16 },
      { key: 'operacion_referencia', label: 'Operación', width: 18 },
      { key: 'monto_esperado', label: 'Monto Esperado', width: 16 },
      { key: 'monto_real', label: 'Monto Real', width: 14 },
      { key: 'diferencia', label: 'Diferencia', width: 14 },
      { key: 'porcentaje_exceso', label: '% Exceso', width: 12 },
      { key: 'estado', label: 'Estado', width: 12 },
    ],
  },
  vehiculos: {
    titulo: 'Vehículos',
    sql: 'SELECT id, placa, modelo, capacidad_carga, coste_por_km, estado FROM vehiculos ORDER BY id',
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'placa', label: 'Placa', width: 14 },
      { key: 'modelo', label: 'Modelo', width: 30 },
      { key: 'capacidad_carga', label: 'Capacidad Carga', width: 16 },
      { key: 'coste_por_km', label: 'Coste/KM', width: 12 },
      { key: 'estado', label: 'Estado', width: 14 },
    ],
  },
  auditorias: {
    titulo: 'Auditorías',
    sql: `SELECT a.id, u.nombre AS usuario, a.accion, a.tabla_afectada, a.registro_id, a.fecha_cambio
          FROM auditorias a LEFT JOIN usuarios u ON u.id = a.usuario_id
          ORDER BY a.fecha_cambio DESC LIMIT 500`,
    columnas: [
      { key: 'id', label: 'ID', width: 8 },
      { key: 'usuario', label: 'Usuario', width: 22 },
      { key: 'accion', label: 'Acción', width: 12 },
      { key: 'tabla_afectada', label: 'Tabla', width: 22 },
      { key: 'registro_id', label: 'Registro ID', width: 12 },
      { key: 'fecha_cambio', label: 'Fecha de Cambio', width: 22 },
    ],
  },
};

// RF09 - Generación de reportes financieros (PDF y Excel) genérica por tabla
const exportarTabla = asyncHandler(async (req, res) => {
  const { tabla, formato } = req.params;

  const fuente = FUENTES[tabla];
  if (!fuente) {
    return res.status(404).json({ error: `Reporte no disponible para la tabla "${tabla}"` });
  }
  if (!['pdf', 'excel'].includes(formato)) {
    return res.status(400).json({ error: 'Formato inválido. Use "pdf" o "excel"' });
  }

  const { rows } = await query(fuente.sql);
  const filename = `${tabla}_${new Date().toISOString().slice(0, 10)}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;

  if (formato === 'pdf') {
    return generarPDF(res, { titulo: fuente.titulo, columnas: fuente.columnas, filas: rows, filename });
  }
  return generarExcel(res, { titulo: fuente.titulo, columnas: fuente.columnas, filas: rows, filename });
});

// Reporte financiero ejecutivo (resumen de costes del mes) en PDF/Excel
const exportarResumenFinanciero = asyncHandler(async (req, res) => {
  const { formato } = req.params;
  if (!['pdf', 'excel'].includes(formato)) {
    return res.status(400).json({ error: 'Formato inválido. Use "pdf" o "excel"' });
  }

  const resumen = await obtenerResumenCostes();
  const topProductos = await obtenerTopProductosCosteAlmacenaje(3);
  const transporte = await obtenerCosteTransportePorKm();

  const filas = [
    { concepto: 'Coste total de compras', monto: resumen.desglose.compra },
    { concepto: 'Coste total de almacenamiento', monto: resumen.desglose.almacenamiento },
    { concepto: 'Coste total de transporte', monto: resumen.desglose.transporte },
    { concepto: 'Coste total de distribución', monto: resumen.desglose.distribucion },
    { concepto: 'COSTE LOGÍSTICO TOTAL DEL MES', monto: resumen.total },
    { concepto: 'Coste de transporte por kilómetro', monto: transporte.coste_por_km },
    ...topProductos.map((p, i) => ({
      concepto: `Top ${i + 1} producto por coste de almacenaje: ${p.nombre}`,
      monto: p.coste_almacenaje_estimado,
    })),
  ];

  const columnas = [
    { key: 'concepto', label: 'Concepto', width: 45 },
    { key: 'monto', label: 'Monto (S/)', width: 16 },
  ];

  const filename = `resumen_financiero_${new Date().toISOString().slice(0, 10)}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
  const titulo = 'Resumen Financiero Logístico - Mes Actual';

  if (formato === 'pdf') {
    return generarPDF(res, { titulo, columnas, filas, filename });
  }
  return generarExcel(res, { titulo, columnas, filas, filename });
});

const fuentesDisponibles = asyncHandler(async (req, res) => {
  res.json(Object.keys(FUENTES).map((key) => ({ tabla: key, titulo: FUENTES[key].titulo })));
});

module.exports = { exportarTabla, exportarResumenFinanciero, fuentesDisponibles };
