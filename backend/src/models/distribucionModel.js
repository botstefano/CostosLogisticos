const { query } = require('../database/db');

const DistribucionModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT d.*, v.placa, v.modelo, oc.proveedor_id, oc.total AS total_orden
       FROM distribuciones d
       LEFT JOIN vehiculos v ON v.id = d.vehiculo_id
       LEFT JOIN ordenes_compra oc ON oc.id = d.orden_compra_id
       ORDER BY d.id DESC`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await query(
      `SELECT d.*, v.placa, v.modelo
       FROM distribuciones d LEFT JOIN vehiculos v ON v.id = d.vehiculo_id
       WHERE d.id = $1`,
      [id]
    );
    return rows[0];
  },
  async create({ orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, coste_total_transporte }) {
    const { rows } = await query(
      `INSERT INTO distribuciones (orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, estado, coste_total_transporte)
       VALUES ($1, $2, $3, $4, 'pendiente', $5) RETURNING *`,
      [orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, coste_total_transporte || 0]
    );
    return rows[0];
  },
  async actualizarEstado(id, estado, extra = {}) {
    const { rows } = await query(
      `UPDATE distribuciones SET
         estado = $1,
         fecha_salida = COALESCE($2, fecha_salida),
         fecha_entrega = COALESCE($3, fecha_entrega)
       WHERE id = $4 RETURNING *`,
      [estado, extra.fecha_salida || null, extra.fecha_entrega || null, id]
    );
    return rows[0];
  },
};

module.exports = DistribucionModel;
