const { query } = require('../database/db');
const { asyncHandler } = require('../middleware/validation');

// RF16 + panel adicional - Trazabilidad completa de un pedido (orden de compra)
const trazabilidadOrden = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { rows: ordenRows } = await query(
    `SELECT oc.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre
     FROM ordenes_compra oc
     LEFT JOIN proveedores p ON p.id = oc.proveedor_id
     LEFT JOIN usuarios u ON u.id = oc.usuario_registra_id
     WHERE oc.id = $1`,
    [id]
  );
  const orden = ordenRows[0];
  if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });

  const { rows: detalles } = await query(
    `SELECT dc.*, pr.nombre AS producto_nombre
     FROM detalles_compra dc JOIN productos pr ON pr.id = dc.producto_id
     WHERE dc.orden_compra_id = $1`,
    [id]
  );

  const { rows: distribuciones } = await query(
    `SELECT d.*, v.placa, v.modelo
     FROM distribuciones d LEFT JOIN vehiculos v ON v.id = d.vehiculo_id
     WHERE d.orden_compra_id = $1
     ORDER BY d.id`,
    [id]
  );

  const { rows: costes } = await query(
    `SELECT * FROM costes_logisticos_totales
     WHERE operacion_referencia = $1 OR desglose_json->>'orden_compra_id' = $2
     ORDER BY fecha`,
    [`OC-${id}`, String(id)]
  );

  const { rows: auditoria } = await query(
    `SELECT a.*, u.nombre AS usuario_nombre
     FROM auditorias a LEFT JOIN usuarios u ON u.id = a.usuario_id
     WHERE a.tabla_afectada IN ('ordenes_compra', 'distribuciones')
       AND (a.registro_id = $1 OR a.datos_nuevos_json->>'orden_compra_id' = $2)
     ORDER BY a.fecha_cambio`,
    [id, String(id)]
  );

  // Línea de tiempo combinada de estados
  const timeline = [
    { evento: 'Orden registrada', fecha: orden.created_at, estado: 'pendiente' },
  ];
  if (orden.fecha_entrega_real) {
    timeline.push({ evento: 'Mercancía recibida en almacén', fecha: orden.fecha_entrega_real, estado: 'en almacen' });
  }
  distribuciones.forEach((d) => {
    if (d.fecha_salida) timeline.push({ evento: `Salida a distribución (Vehículo ${d.placa || d.vehiculo_id})`, fecha: d.fecha_salida, estado: 'en transito' });
    if (d.fecha_entrega) timeline.push({ evento: 'Entrega completada', fecha: d.fecha_entrega, estado: 'entregado' });
  });

  res.json({
    orden: { ...orden, detalles },
    estado_actual: orden.estado,
    distribuciones,
    costes_asociados: costes,
    auditoria,
    timeline: timeline.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
  });
});

// Panel general: lista de todos los pedidos con su estado actual
const panelGeneral = asyncHandler(async (req, res) => {
  const { estado } = req.query;
  let sql = `
    SELECT oc.id, oc.estado, oc.fecha_emision, oc.fecha_entrega_esperada, oc.fecha_entrega_real,
           oc.total, p.nombre AS proveedor_nombre, a.nombre AS almacen_nombre
    FROM ordenes_compra oc
    LEFT JOIN proveedores p ON p.id = oc.proveedor_id
    LEFT JOIN almacenes a ON a.id = oc.almacen_destino_id
  `;
  const params = [];
  if (estado) {
    sql += ' WHERE oc.estado = $1';
    params.push(estado);
  }
  sql += ' ORDER BY oc.id DESC';

  const { rows } = await query(sql, params);
  res.json(rows);
});

module.exports = { trazabilidadOrden, panelGeneral };
