const { query } = require('../database/db');

/**
 * Utilidades de cálculo automático de costes logísticos (RF08, RF12).
 *
 * Cada función de "registrar" persiste un registro en costes_logisticos_totales
 * con tipo_operacion correspondiente, y evalúa si se dispara una alerta de sobrecoste
 * comparando contra configuracion_alertas.
 */

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/**
 * Inserta un registro en costes_logisticos_totales.
 */
async function registrarCosteTotal({ operacion_referencia, tipo_operacion, fecha, monto_total, desglose }) {
  const { rows } = await query(
    `INSERT INTO costes_logisticos_totales (operacion_referencia, tipo_operacion, fecha, monto_total, desglose_json)
     VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5)
     RETURNING *`,
    [operacion_referencia, tipo_operacion, fecha, round2(monto_total), desglose ? JSON.stringify(desglose) : null]
  );
  return rows[0];
}

/**
 * Obtiene configuración de alertas para un tipo de operación.
 */
async function obtenerConfiguracionAlerta(tipo) {
  const { rows } = await query('SELECT * FROM configuracion_alertas WHERE tipo = $1', [tipo]);
  return rows[0] || null;
}

/**
 * Evalúa si el monto acumulado del mes para un tipo de operación supera
 * el presupuesto mensual configurado (más el umbral de tolerancia).
 * Si lo supera, crea una alerta en alertas_sobrecostes.
 */
async function evaluarAlertaMensual(tipo, operacion_referencia) {
  const config = await obtenerConfiguracionAlerta(tipo);
  if (!config || !config.monto_presupuestado_mensual) return null;

  const { rows } = await query(
    `SELECT COALESCE(SUM(monto_total), 0) AS total
     FROM costes_logisticos_totales
     WHERE tipo_operacion = $1
       AND date_trunc('month', fecha) = date_trunc('month', CURRENT_DATE)`,
    [tipo]
  );

  const montoReal = Number(rows[0].total);
  const montoEsperado = Number(config.monto_presupuestado_mensual);
  const umbral = Number(config.umbral_porcentaje);
  const limite = montoEsperado * (1 + umbral / 100);

  if (montoReal > limite) {
    const diferencia = montoReal - montoEsperado;
    const porcentajeExceso = montoEsperado > 0 ? round2((diferencia / montoEsperado) * 100) : 100;

    // Evitar duplicar alertas activas del mismo tipo en el mismo día
    const { rows: existentes } = await query(
      `SELECT id FROM alertas_sobrecostes
       WHERE tipo = $1 AND estado = 'activa' AND date_trunc('day', fecha) = date_trunc('day', NOW())`,
      [tipo]
    );
    if (existentes.length > 0) return null;

    const { rows: alerta } = await query(
      `INSERT INTO alertas_sobrecostes (tipo, operacion_referencia, monto_esperado, monto_real, diferencia, porcentaje_exceso, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'activa') RETURNING *`,
      [tipo, operacion_referencia, round2(montoEsperado), round2(montoReal), round2(diferencia), porcentajeExceso]
    );
    return alerta[0];
  }
  return null;
}

/**
 * RF08 - Registra el coste logístico de una orden de compra y evalúa alertas.
 */
async function procesarCosteCompra(orden) {
  const operacion_referencia = `OC-${orden.id}`;
  const registro = await registrarCosteTotal({
    operacion_referencia,
    tipo_operacion: 'compra',
    fecha: orden.fecha_emision,
    monto_total: orden.total,
    desglose: { orden_compra_id: orden.id, proveedor_id: orden.proveedor_id, total: orden.total },
  });
  const alerta = await evaluarAlertaMensual('compra', operacion_referencia);
  return { registro, alerta };
}

/**
 * RF06 - Registra el coste de almacenamiento y evalúa alertas + coste por hora.
 */
async function procesarCosteAlmacenamiento(coste) {
  const operacion_referencia = coste.operacion_referencia || `ALM-${coste.id}`;
  const registro = await registrarCosteTotal({
    operacion_referencia,
    tipo_operacion: 'almacenamiento',
    fecha: coste.fecha,
    monto_total: coste.monto,
    desglose: { coste_almacenamiento_id: coste.id, almacen_id: coste.almacen_id, concepto: coste.concepto, tipo_gasto: coste.tipo_gasto },
  });
  const alerta = await evaluarAlertaMensual('almacenamiento', operacion_referencia);
  return { registro, alerta };
}

/**
 * RF07 - Registra el coste de transporte (suma de sub-costes) y evalúa alertas + coste/km.
 */
async function procesarCosteTransporte(coste) {
  const total = round2(
    Number(coste.coste_combustible || 0) +
    Number(coste.coste_peajes || 0) +
    Number(coste.coste_mantenimiento || 0) +
    Number(coste.coste_conductor || 0)
  );

  const operacion_referencia = coste.operacion_referencia || `TRA-${coste.id}`;
  const costePorKm = coste.kilometros_recorridos > 0 ? round2(total / Number(coste.kilometros_recorridos)) : 0;

  const registro = await registrarCosteTotal({
    operacion_referencia,
    tipo_operacion: 'transporte',
    fecha: coste.fecha,
    monto_total: total,
    desglose: {
      coste_transporte_id: coste.id,
      vehiculo_id: coste.vehiculo_id,
      kilometros_recorridos: coste.kilometros_recorridos,
      coste_por_km: costePorKm,
      desagregado: {
        combustible: coste.coste_combustible,
        peajes: coste.coste_peajes,
        mantenimiento: coste.coste_mantenimiento,
        conductor: coste.coste_conductor,
      },
    },
  });

  const alerta = await evaluarAlertaMensual('transporte', operacion_referencia);
  return { registro, alerta, total, costePorKm };
}

/**
 * RF15 - Registra el coste de una distribución (asignación ruta/vehículo).
 */
async function procesarCosteDistribucion(distribucion) {
  const operacion_referencia = `DIST-${distribucion.id}`;
  const registro = await registrarCosteTotal({
    operacion_referencia,
    tipo_operacion: 'distribucion',
    fecha: distribucion.fecha_salida || new Date(),
    monto_total: distribucion.coste_total_transporte || 0,
    desglose: { distribucion_id: distribucion.id, orden_compra_id: distribucion.orden_compra_id, vehiculo_id: distribucion.vehiculo_id },
  });
  const alerta = await evaluarAlertaMensual('distribucion', operacion_referencia);
  return { registro, alerta };
}

/**
 * Calcula el coste logístico total general para un rango de fechas (por defecto, mes actual)
 * y los KPIs requeridos por el dashboard ejecutivo.
 */
async function obtenerResumenCostes(fechaInicio, fechaFin) {
  const params = [];
  let whereClause = '';
  if (fechaInicio && fechaFin) {
    whereClause = 'WHERE fecha BETWEEN $1 AND $2';
    params.push(fechaInicio, fechaFin);
  } else {
    whereClause = `WHERE date_trunc('month', fecha) = date_trunc('month', CURRENT_DATE)`;
  }

  const { rows: porTipo } = await query(
    `SELECT tipo_operacion, COALESCE(SUM(monto_total), 0) AS total
     FROM costes_logisticos_totales
     ${whereClause}
     GROUP BY tipo_operacion`,
    params
  );

  const desglose = {
    compra: 0, almacenamiento: 0, transporte: 0, distribucion: 0, general: 0,
  };
  porTipo.forEach((r) => { desglose[r.tipo_operacion] = round2(Number(r.total)); });

  const total = round2(Object.values(desglose).reduce((a, b) => a + b, 0));

  return { desglose, total };
}

/**
 * Top N productos con mayor coste de almacenaje (estimado: coste_mensual_operacion del
 * almacén distribuido proporcionalmente a la cantidad de cada producto en inventario).
 */
async function obtenerTopProductosCosteAlmacenaje(limit = 3) {
  const { rows } = await query(
    `SELECT p.id, p.nombre,
            SUM(i.cantidad) AS cantidad_total,
            SUM(
              (i.cantidad::numeric /
                NULLIF((SELECT SUM(i2.cantidad) FROM inventarios i2 WHERE i2.almacen_id = i.almacen_id), 0)
              ) * a.coste_mensual_operacion
            ) AS coste_almacenaje_estimado
     FROM inventarios i
     JOIN productos p ON p.id = i.producto_id
     JOIN almacenes a ON a.id = i.almacen_id
     GROUP BY p.id, p.nombre
     ORDER BY coste_almacenaje_estimado DESC
     LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({
    ...r,
    coste_almacenaje_estimado: round2(Number(r.coste_almacenaje_estimado || 0)),
  }));
}

/**
 * Coste de transporte por kilómetro (promedio del mes actual).
 */
async function obtenerCosteTransportePorKm() {
  const { rows } = await query(
    `SELECT
       COALESCE(SUM(coste_combustible + coste_peajes + coste_mantenimiento + coste_conductor), 0) AS coste_total,
       COALESCE(SUM(kilometros_recorridos), 0) AS km_total
     FROM costes_transporte
     WHERE date_trunc('month', fecha) = date_trunc('month', CURRENT_DATE)`
  );
  const costeTotal = Number(rows[0].coste_total);
  const kmTotal = Number(rows[0].km_total);
  return {
    coste_total: round2(costeTotal),
    km_total: round2(kmTotal),
    coste_por_km: kmTotal > 0 ? round2(costeTotal / kmTotal) : 0,
  };
}

/**
 * Coste por unidad de producto (precio_unitario base; podría extenderse para incluir
 * costes logísticos prorrateados).
 */
async function obtenerCostePorUnidadProducto(productoId) {
  const { rows } = await query('SELECT id, nombre, precio_unitario, stock_actual FROM productos WHERE id = $1', [productoId]);
  const producto = rows[0];
  if (!producto) return null;

  const topAlmacenaje = await obtenerTopProductosCosteAlmacenaje(1000);
  const item = topAlmacenaje.find((p) => p.id === producto.id);
  const costeAlmacenajeUnitario = item && producto.stock_actual > 0
    ? round2(item.coste_almacenaje_estimado / producto.stock_actual)
    : 0;

  return {
    producto_id: producto.id,
    nombre: producto.nombre,
    precio_unitario: Number(producto.precio_unitario),
    coste_almacenaje_unitario: costeAlmacenajeUnitario,
    coste_total_unitario: round2(Number(producto.precio_unitario) + costeAlmacenajeUnitario),
  };
}

/**
 * Rentabilidad logística por pedido (orden de compra):
 * margen = total_venta_estimado - (total_compra + costes_logisticos asociados)
 * Como este sistema es de costes (no ventas), se interpreta "rentabilidad" como
 * eficiencia: total compra vs costes logísticos asociados a esa operación.
 */
async function obtenerRentabilidadPorOrden(ordenId) {
  const { rows: ordenRows } = await query('SELECT * FROM ordenes_compra WHERE id = $1', [ordenId]);
  const orden = ordenRows[0];
  if (!orden) return null;

  const operacion_referencia = `OC-${ordenId}`;
  const { rows: costesAsociados } = await query(
    `SELECT COALESCE(SUM(monto_total), 0) AS total
     FROM costes_logisticos_totales
     WHERE desglose_json->>'orden_compra_id' = $1 OR operacion_referencia = $2`,
    [String(ordenId), operacion_referencia]
  );

  const costeTotal = Number(costesAsociados[0].total);
  const costeCompra = Number(orden.total);
  const costeLogisticoAdicional = round2(costeTotal - costeCompra);

  return {
    orden_compra_id: ordenId,
    coste_compra: costeCompra,
    coste_logistico_total: round2(costeTotal),
    coste_logistico_adicional: costeLogisticoAdicional,
    porcentaje_sobre_compra: costeCompra > 0 ? round2((costeLogisticoAdicional / costeCompra) * 100) : 0,
  };
}

module.exports = {
  round2,
  registrarCosteTotal,
  obtenerConfiguracionAlerta,
  evaluarAlertaMensual,
  procesarCosteCompra,
  procesarCosteAlmacenamiento,
  procesarCosteTransporte,
  procesarCosteDistribucion,
  obtenerResumenCostes,
  obtenerTopProductosCosteAlmacenaje,
  obtenerCosteTransportePorKm,
  obtenerCostePorUnidadProducto,
  obtenerRentabilidadPorOrden,
};
