const { query } = require('../database/db');

const AlmacenModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM almacenes ORDER BY id');
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM almacenes WHERE id = $1', [id]);
    return rows[0];
  },
  async create({ nombre, ubicacion, capacidad_total, coste_mensual_operacion }) {
    const { rows } = await query(
      `INSERT INTO almacenes (nombre, ubicacion, capacidad_total, coste_mensual_operacion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, ubicacion, capacidad_total, coste_mensual_operacion || 0]
    );
    return rows[0];
  },
  async update(id, { nombre, ubicacion, capacidad_total, coste_mensual_operacion, activo }) {
    const { rows } = await query(
      `UPDATE almacenes SET
         nombre = COALESCE($1, nombre),
         ubicacion = COALESCE($2, ubicacion),
         capacidad_total = COALESCE($3, capacidad_total),
         coste_mensual_operacion = COALESCE($4, coste_mensual_operacion),
         activo = COALESCE($5, activo)
       WHERE id = $6 RETURNING *`,
      [nombre, ubicacion, capacidad_total, coste_mensual_operacion, activo, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await query('DELETE FROM almacenes WHERE id = $1 RETURNING id', [id]);
    return rows[0];
  },
};

module.exports = AlmacenModel;
