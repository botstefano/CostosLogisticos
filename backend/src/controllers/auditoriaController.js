const { query } = require('../database/db');
const { asyncHandler } = require('../middleware/validation');

// RF17 - Auditoría de cambios (quién modificó qué y cuándo)
const listar = asyncHandler(async (req, res) => {
  const { tabla, usuario_id, limit } = req.query;

  let sql = `
    SELECT a.*, u.nombre AS usuario_nombre, u.email AS usuario_email
    FROM auditorias a LEFT JOIN usuarios u ON u.id = a.usuario_id
  `;
  const conditions = [];
  const params = [];

  if (tabla) {
    params.push(tabla);
    conditions.push(`a.tabla_afectada = $${params.length}`);
  }
  if (usuario_id) {
    params.push(usuario_id);
    conditions.push(`a.usuario_id = $${params.length}`);
  }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');

  sql += ' ORDER BY a.fecha_cambio DESC';

  params.push(limit ? Math.min(parseInt(limit), 500) : 100);
  sql += ` LIMIT $${params.length}`;

  const { rows } = await query(sql, params);
  res.json(rows);
});

module.exports = { listar };
