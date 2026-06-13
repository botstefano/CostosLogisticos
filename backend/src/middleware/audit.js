const { query } = require('../database/db');

/**
 * Registra un cambio en la tabla auditorias.
 * Uso: await registrarAuditoria(req, 'UPDATE', 'productos', id, datosAnteriores, datosNuevos)
 */
async function registrarAuditoria(req, accion, tabla, registroId, datosAnteriores = null, datosNuevos = null) {
  try {
    const usuarioId = req.user ? req.user.id : null;
    await query(
      `INSERT INTO auditorias (usuario_id, accion, tabla_afectada, registro_id, datos_anteriores_json, datos_nuevos_json)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [usuarioId, accion, tabla, registroId, datosAnteriores ? JSON.stringify(datosAnteriores) : null, datosNuevos ? JSON.stringify(datosNuevos) : null]
    );
  } catch (err) {
    console.error('Error registrando auditoría:', err.message);
  }
}

module.exports = { registrarAuditoria };
