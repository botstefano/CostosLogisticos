const { query } = require('../database/db');

const ProductoModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT p.*, pr.nombre AS proveedor_nombre
       FROM productos p LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
       ORDER BY p.id`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await query(
      `SELECT p.*, pr.nombre AS proveedor_nombre
       FROM productos p LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0];
  },
  async findBajoStock() {
    const { rows } = await query(
      `SELECT * FROM productos WHERE stock_actual <= stock_minimo AND activo = true ORDER BY id`
    );
    return rows;
  },
  async create({ nombre, descripcion, precio_unitario, stock_actual, stock_minimo, proveedor_id }) {
    const { rows } = await query(
      `INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, proveedor_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio_unitario, stock_actual || 0, stock_minimo || 0, proveedor_id]
    );
    return rows[0];
  },
  async update(id, { nombre, descripcion, precio_unitario, stock_minimo, proveedor_id, activo }) {
    const { rows } = await query(
      `UPDATE productos SET
         nombre = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion),
         precio_unitario = COALESCE($3, precio_unitario),
         stock_minimo = COALESCE($4, stock_minimo),
         proveedor_id = COALESCE($5, proveedor_id),
         activo = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [nombre, descripcion, precio_unitario, stock_minimo, proveedor_id, activo, id]
    );
    return rows[0];
  },
  async ajustarStock(id, cantidadDelta, client = null) {
    const executor = client || require('../database/db');
    const { rows } = await executor.query(
      `UPDATE productos SET stock_actual = stock_actual + $1 WHERE id = $2 RETURNING *`,
      [cantidadDelta, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
    return rows[0];
  },
};

module.exports = ProductoModel;
