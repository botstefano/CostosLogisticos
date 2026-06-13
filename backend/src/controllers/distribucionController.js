const DistribucionModel = require('../models/distribucionModel');
const OrdenCompraModel = require('../models/ordenCompraModel');
const VehiculoModel = require('../models/vehiculoModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');
const { procesarCosteDistribucion } = require('../utils/calculosCostes');

const listar = asyncHandler(async (req, res) => {
  res.json(await DistribucionModel.findAll());
});

const obtener = asyncHandler(async (req, res) => {
  const item = await DistribucionModel.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Distribución no encontrada' });
  res.json(item);
});

// RF15 - Gestión de distribución logística (asignación de rutas y vehículos)
const crear = asyncHandler(async (req, res) => {
  const { orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, coste_total_transporte } = req.body;

  if (orden_compra_id) {
    const orden = await OrdenCompraModel.findById(orden_compra_id);
    if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });
  }
  if (vehiculo_id) {
    const vehiculo = await VehiculoModel.findById(vehiculo_id);
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    await VehiculoModel.update(vehiculo_id, { estado: 'en ruta' });
  }

  const distribucion = await DistribucionModel.create({
    orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, coste_total_transporte,
  });

  await registrarAuditoria(req, 'INSERT', 'distribuciones', distribucion.id, null, distribucion);

  const { registro, alerta } = await procesarCosteDistribucion(distribucion);

  res.status(201).json({ distribucion, coste_registrado: registro, alerta_generada: alerta });
});

// RF16 - Trazabilidad: actualizar estado de la distribución (y de la orden asociada)
const actualizarEstado = asyncHandler(async (req, res) => {
  const { estado, fecha_salida, fecha_entrega } = req.body;
  const estadosValidos = ['pendiente', 'en almacen', 'en transito', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
  }

  const anterior = await DistribucionModel.findById(req.params.id);
  if (!anterior) return res.status(404).json({ error: 'Distribución no encontrada' });

  const actualizado = await DistribucionModel.actualizarEstado(req.params.id, estado, { fecha_salida, fecha_entrega });

  // Propagar estado a la orden de compra asociada (trazabilidad unificada)
  if (anterior.orden_compra_id) {
    await OrdenCompraModel.actualizarEstado(anterior.orden_compra_id, estado, estado === 'entregado' ? new Date() : null);
  }

  // Liberar vehículo si se entregó o canceló
  if (anterior.vehiculo_id && (estado === 'entregado' || estado === 'cancelado')) {
    await VehiculoModel.update(anterior.vehiculo_id, { estado: 'disponible' });
  }

  await registrarAuditoria(req, 'UPDATE', 'distribuciones', req.params.id, { estado: anterior.estado }, { estado });

  res.json(actualizado);
});

module.exports = { listar, obtener, crear, actualizarEstado };
