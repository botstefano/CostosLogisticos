const { query } = require('../database/db');

const ProveedorModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM proveedores ORDER BY id');
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM proveedores WHERE id = $1', [id]);
    return rows[0];
  },
  async create({ nombre, contacto, telefono, email, direccion }) {
    const { rows } = await query(
      `INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, contacto, telefono, email, direccion]
    );
    return rows[0];
  },
  async update(id, { nombre, contacto, telefono, email, direccion, activo }) {
    const { rows } = await query(
      `UPDATE proveedores SET
         nombre = COALESCE($1, nombre),
         contacto = COALESCE($2, contacto),
         telefono = COALESCE($3, telefono),
         email = COALESCE($4, email),
         direccion = COALESCE($5, direccion),
         activo = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [nombre, contacto, telefono, email, direccion, activo, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await query('DELETE FROM proveedores WHERE id = $1 RETURNING id', [id]);
    return rows[0];
  },
};

module.exports = ProveedorModel;
