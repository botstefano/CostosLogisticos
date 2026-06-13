const { query } = require('../database/db');

const InventarioModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT i.*, p.nombre AS producto_nombre, p.precio_unitario, a.nombre AS almacen_nombre
       FROM inventarios i
       JOIN productos p ON p.id = i.producto_id
       JOIN almacenes a ON a.id = i.almacen_id
       ORDER BY a.nombre, p.nombre`
    );
    return rows;
  },

  async findByAlmacen(almacenId) {
    const { rows } = await query(
      `SELECT i.*, p.nombre AS producto_nombre, p.precio_unitario
       FROM inventarios i JOIN productos p ON p.id = i.producto_id
       WHERE i.almacen_id = $1
       ORDER BY p.nombre`,
      [almacenId]
    );
    return rows;
  },

  async findByProducto(productoId) {
    const { rows } = await query(
      `SELECT i.*, a.nombre AS almacen_nombre
       FROM inventarios i JOIN almacenes a ON a.id = i.almacen_id
       WHERE i.producto_id = $1
       ORDER BY a.nombre`,
      [productoId]
    );
    return rows;
  },

  /**
   * Ajuste manual de inventario (ej: corrección, merma).
   * delta puede ser positivo o negativo.
   */
  async ajustar(productoId, almacenId, delta, ubicacion_estanteria = null) {
    const { rows: existing } = await query(
      'SELECT * FROM inventarios WHERE producto_id = $1 AND almacen_id = $2',
      [productoId, almacenId]
    );

    let result;
    if (existing[0]) {
      const { rows } = await query(
        `UPDATE inventarios SET cantidad = cantidad + $1,
           ubicacion_estanteria = COALESCE($2, ubicacion_estanteria),
           ultima_actualizacion = NOW()
         WHERE producto_id = $3 AND almacen_id = $4 RETURNING *`,
        [delta, ubicacion_estanteria, productoId, almacenId]
      );
      result = rows[0];
    } else {
      const { rows } = await query(
        `INSERT INTO inventarios (producto_id, almacen_id, cantidad, ubicacion_estanteria, ultima_actualizacion)
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [productoId, almacenId, delta, ubicacion_estanteria]
      );
      result = rows[0];
    }

    await query('UPDATE productos SET stock_actual = stock_actual + $1 WHERE id = $2', [delta, productoId]);

    return result;
  },
};

module.exports = InventarioModel;
