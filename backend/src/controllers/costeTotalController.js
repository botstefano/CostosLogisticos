const { query } = require('../database/db');
const { asyncHandler } = require('../middleware/validation');
const {
  obtenerResumenCostes,
  obtenerTopProductosCosteAlmacenaje,
  obtenerCosteTransportePorKm,
  obtenerCostePorUnidadProducto,
  obtenerRentabilidadPorOrden,
  obtenerConfiguracionAlerta,
} = require('../utils/calculosCostes');

const listar = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM costes_logisticos_totales ORDER BY fecha DESC, id DESC');
  res.json(rows);
});

const costePorUnidad = asyncHandler(async (req, res) => {
  const resultado = await obtenerCostePorUnidadProducto(req.params.productoId);
  if (!resultado) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(resultado);
});

const rentabilidadPorOrden = asyncHandler(async (req, res) => {
  const resultado = await obtenerRentabilidadPorOrden(req.params.ordenId);
  if (!resultado) return res.status(404).json({ error: 'Orden de compra no encontrada' });
  res.json(resultado);
});

// RF10 - Dashboard ejecutivo con KPIs principales
const dashboard = asyncHandler(async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  const resumen = await obtenerResumenCostes(fechaInicio, fechaFin);
  const topProductos = await obtenerTopProductosCosteAlmacenaje(3);
  const transportePorKm = await obtenerCosteTransportePorKm();
  const configGeneral = await obtenerConfiguracionAlerta('general');

  const { rows: alertasActivas } = await query(
    `SELECT * FROM alertas_sobrecostes WHERE estado = 'activa' ORDER BY fecha DESC LIMIT 10`
  );

  const presupuestoGeneral = configGeneral ? Number(configGeneral.monto_presupuestado_mensual) : 0;

  res.json({
    coste_logistico_total_mes: resumen.total,
    desglose_por_tipo: resumen.desglose,
    comparativa_real_vs_presupuesto: {
      real: resumen.total,
      presupuesto: presupuestoGeneral,
      diferencia: Math.round((resumen.total - presupuestoGeneral) * 100) / 100,
      porcentaje_uso: presupuestoGeneral > 0
        ? Math.round((resumen.total / presupuestoGeneral) * 10000) / 100
        : null,
    },
    top_productos_coste_almacenaje: topProductos,
    transporte: transportePorKm,
    alertas_activas: alertasActivas,
  });
});

module.exports = { listar, costePorUnidad, rentabilidadPorOrden, dashboard };
