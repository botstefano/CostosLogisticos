const { query } = require('../database/db');

const UsuarioModel = {
  async findByEmail(email) {
    const { rows } = await query(
      `SELECT u.*, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id
       WHERE u.email = $1`,
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre AS rol, u.activo, u.created_at, u.updated_at
       FROM usuarios u JOIN roles r ON r.id = u.rol_id
       WHERE u.id = $1`,
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await query(
      `SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre AS rol, u.activo, u.created_at, u.updated_at
       FROM usuarios u JOIN roles r ON r.id = u.rol_id
       ORDER BY u.id`
    );
    return rows;
  },

  async create({ nombre, email, password_hash, rol_id }) {
    const { rows } = await query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol_id, activo, created_at, updated_at`,
      [nombre, email, password_hash, rol_id]
    );
    return rows[0];
  },

  async update(id, { nombre, email, rol_id, activo }) {
    const { rows } = await query(
      `UPDATE usuarios
       SET nombre = COALESCE($1, nombre),
           email = COALESCE($2, email),
           rol_id = COALESCE($3, rol_id),
           activo = COALESCE($4, activo)
       WHERE id = $5
       RETURNING id, nombre, email, rol_id, activo, created_at, updated_at`,
      [nombre, email, rol_id, activo, id]
    );
    return rows[0];
  },

  async updatePassword(id, password_hash) {
    await query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [password_hash, id]);
  },

  async delete(id) {
    const { rows } = await query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    return rows[0];
  },
};

module.exports = UsuarioModel;
