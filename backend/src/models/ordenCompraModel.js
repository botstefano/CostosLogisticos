const { query, pool } = require('../database/db');

const OrdenCompraModel = {
  async findAll() {
    const { rows } = await query(
      `SELECT oc.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre, a.nombre AS almacen_nombre
       FROM ordenes_compra oc
       LEFT JOIN proveedores p ON p.id = oc.proveedor_id
       LEFT JOIN usuarios u ON u.id = oc.usuario_registra_id
       LEFT JOIN almacenes a ON a.id = oc.almacen_destino_id
       ORDER BY oc.id DESC`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT oc.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre, a.nombre AS almacen_nombre
       FROM ordenes_compra oc
       LEFT JOIN proveedores p ON p.id = oc.proveedor_id
       LEFT JOIN usuarios u ON u.id = oc.usuario_registra_id
       LEFT JOIN almacenes a ON a.id = oc.almacen_destino_id
       WHERE oc.id = $1`,
      [id]
    );
    if (!rows[0]) return null;

    const { rows: detalles } = await query(
      `SELECT dc.*, pr.nombre AS producto_nombre
       FROM detalles_compra dc JOIN productos pr ON pr.id = dc.producto_id
       WHERE dc.orden_compra_id = $1
       ORDER BY dc.id`,
      [id]
    );

    return { ...rows[0], detalles };
  },

  /**
   * Crea una orden de compra junto con sus detalles, en una transacción.
   * items: [{ producto_id, cantidad, precio_unitario }]
   */
  async crearConDetalles({ proveedor_id, fecha_emision, fecha_entrega_esperada, almacen_destino_id, usuario_registra_id, items }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const total = items.reduce((acc, it) => acc + Number(it.cantidad) * Number(it.precio_unitario), 0);

      const { rows } = await client.query(
        `INSERT INTO ordenes_compra (proveedor_id, fecha_emision, fecha_entrega_esperada, total, estado, usuario_registra_id, almacen_destino_id)
         VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, 'pendiente', $5, $6)
         RETURNING *`,
        [proveedor_id, fecha_emision, fecha_entrega_esperada, total, usuario_registra_id, almacen_destino_id]
      );
      const orden = rows[0];

      for (const item of items) {
        const subtotal = Number(item.cantidad) * Number(item.precio_unitario);
        await client.query(
          `INSERT INTO detalles_compra (orden_compra_id, producto_id, cantidad, precio_unitario, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [orden.id, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
        );
      }

      await client.query('COMMIT');
      return orden;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async actualizarEstado(id, estado, fecha_entrega_real = null) {
    const { rows } = await query(
      `UPDATE ordenes_compra SET estado = $1, fecha_entrega_real = COALESCE($2, fecha_entrega_real)
       WHERE id = $3 RETURNING *`,
      [estado, fecha_entrega_real, id]
    );
    return rows[0];
  },

  /**
   * Recibe la mercancía de una orden: actualiza inventarios y cambia estado a 'en almacen'.
   * Devuelve la orden actualizada junto a los movimientos de inventario realizados.
   */
  async recibirMercancia(ordenId, almacenId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: ordenRows } = await client.query('SELECT * FROM ordenes_compra WHERE id = $1', [ordenId]);
      const orden = ordenRows[0];
      if (!orden) throw Object.assign(new Error('Orden de compra no encontrada'), { status: 404 });
      if (orden.estado === 'entregado') throw Object.assign(new Error('La orden ya fue entregada'), { status: 400 });

      const targetAlmacen = almacenId || orden.almacen_destino_id;
      if (!targetAlmacen) throw Object.assign(new Error('Debe especificar un almacén destino'), { status: 400 });

      const { rows: detalles } = await client.query(
        'SELECT * FROM detalles_compra WHERE orden_compra_id = $1',
        [ordenId]
      );

      for (const detalle of detalles) {
        // Actualizar stock global del producto
        await client.query(
          'UPDATE productos SET stock_actual = stock_actual + $1 WHERE id = $2',
          [detalle.cantidad, detalle.producto_id]
        );

        // Actualizar/crear registro de inventario por almacén
        const { rows: invRows } = await client.query(
          'SELECT * FROM inventarios WHERE producto_id = $1 AND almacen_id = $2',
          [detalle.producto_id, targetAlmacen]
        );

        if (invRows[0]) {
          await client.query(
            `UPDATE inventarios SET cantidad = cantidad + $1, ultima_actualizacion = NOW()
             WHERE producto_id = $2 AND almacen_id = $3`,
            [detalle.cantidad, detalle.producto_id, targetAlmacen]
          );
        } else {
          await client.query(
            `INSERT INTO inventarios (producto_id, almacen_id, cantidad, ultima_actualizacion)
             VALUES ($1, $2, $3, NOW())`,
            [detalle.producto_id, targetAlmacen, detalle.cantidad]
          );
        }
      }

      const { rows: updatedOrden } = await client.query(
        `UPDATE ordenes_compra SET estado = 'en almacen', fecha_entrega_real = CURRENT_DATE, almacen_destino_id = $1
         WHERE id = $2 RETURNING *`,
        [targetAlmacen, ordenId]
      );

      await client.query('COMMIT');
      return { orden: updatedOrden[0], detalles };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = OrdenCompraModel;
