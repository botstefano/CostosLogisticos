const { query } = require('../database/db');

const AlertaModel = {
  async findAll({ estado } = {}) {
    let sql = 'SELECT * FROM alertas_sobrecostes';
    const params = [];
    if (estado) {
      sql += ' WHERE estado = $1';
      params.push(estado);
    }
    sql += ' ORDER BY fecha DESC';
    const { rows } = await query(sql, params);
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM alertas_sobrecostes WHERE id = $1', [id]);
    return rows[0];
  },
  async actualizarEstado(id, estado) {
    const estadosValidos = ['activa', 'revisada', 'resuelta', 'descartada'];
    if (!estadosValidos.includes(estado)) {
      throw Object.assign(new Error('Estado de alerta inválido'), { status: 400 });
    }
    const { rows } = await query(
      'UPDATE alertas_sobrecostes SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    return rows[0];
  },
};

const ConfiguracionAlertaModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM configuracion_alertas ORDER BY id');
    return rows;
  },
  async update(tipo, { umbral_porcentaje, monto_presupuestado_mensual }) {
    const { rows } = await query(
      `UPDATE configuracion_alertas SET
         umbral_porcentaje = COALESCE($1, umbral_porcentaje),
         monto_presupuestado_mensual = COALESCE($2, monto_presupuestado_mensual),
         updated_at = NOW()
       WHERE tipo = $3 RETURNING *`,
      [umbral_porcentaje, monto_presupuestado_mensual, tipo]
    );
    return rows[0];
  },
};

module.exports = { AlertaModel, ConfiguracionAlertaModel };
