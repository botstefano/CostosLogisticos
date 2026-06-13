const { query } = require('../database/db');

const VehiculoModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM vehiculos ORDER BY id');
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM vehiculos WHERE id = $1', [id]);
    return rows[0];
  },
  async create({ placa, modelo, capacidad_carga, coste_por_km, estado }) {
    const { rows } = await query(
      `INSERT INTO vehiculos (placa, modelo, capacidad_carga, coste_por_km, estado)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'disponible')) RETURNING *`,
      [placa, modelo, capacidad_carga, coste_por_km || 0, estado]
    );
    return rows[0];
  },
  async update(id, { placa, modelo, capacidad_carga, coste_por_km, estado, activo }) {
    const { rows } = await query(
      `UPDATE vehiculos SET
         placa = COALESCE($1, placa),
         modelo = COALESCE($2, modelo),
         capacidad_carga = COALESCE($3, capacidad_carga),
         coste_por_km = COALESCE($4, coste_por_km),
         estado = COALESCE($5, estado),
         activo = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [placa, modelo, capacidad_carga, coste_por_km, estado, activo, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await query('DELETE FROM vehiculos WHERE id = $1 RETURNING id', [id]);
    return rows[0];
  },
};

module.exports = VehiculoModel;
