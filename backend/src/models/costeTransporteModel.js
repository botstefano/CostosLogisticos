const { query } = require('../database/db');

const CosteTransporteModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT ct.*, v.placa, v.modelo
       FROM costes_transporte ct JOIN vehiculos v ON v.id = ct.vehiculo_id
       ORDER BY ct.fecha DESC, ct.id DESC`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM costes_transporte WHERE id = $1', [id]);
    return rows[0];
  },
  async create(data) {
    const {
      vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos,
      coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor,
      coste_total, operacion_referencia, usuario_registra_id,
    } = data;

    const { rows } = await query(
      `INSERT INTO costes_transporte
         (vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos,
          coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor,
          coste_total, operacion_referencia, usuario_registra_id)
       VALUES (
          $1, COALESCE($2, CURRENT_DATE), $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12)
       RETURNING *`,
      [
        vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos || 0,
        coste_combustible || 0, coste_peajes || 0, coste_mantenimiento || 0, coste_conductor || 0,
        coste_total || 0, operacion_referencia, usuario_registra_id,
      ]
    );
    return rows[0];
  },
};

module.exports = CosteTransporteModel;
