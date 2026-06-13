const { query } = require('../database/db');

const CosteAlmacenamientoModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT ca.*, a.nombre AS almacen_nombre
       FROM costes_almacenamiento ca JOIN almacenes a ON a.id = ca.almacen_id
       ORDER BY ca.fecha DESC, ca.id DESC`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM costes_almacenamiento WHERE id = $1', [id]);
    return rows[0];
  },
  async create({ almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia, usuario_registra_id }) {
    const { rows } = await query(
      `INSERT INTO costes_almacenamiento (almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia, usuario_registra_id)
       VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, $6, $7) RETURNING *`,
      [almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia, usuario_registra_id]
    );
    return rows[0];
  },
};

module.exports = CosteAlmacenamientoModel;
