const { body } = require('express-validator');
const OrdenCompraModel = require('../models/ordenCompraModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');
const { procesarCosteCompra } = require('../utils/calculosCostes');

const listar = asyncHandler(async (req, res) => {
  const ordenes = await OrdenCompraModel.findAll();
  res.json(ordenes);
});

const obtener = asyncHandler(async (req, res) => {
  const orden = await OrdenCompraModel.findById(req.params.id);
  if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });
  res.json(orden);
});

// RF04 - Registro de orden de compra + RF03 - validación automática de datos (express-validator)
const crear = asyncHandler(async (req, res) => {
  const { proveedor_id, fecha_emision, fecha_entrega_esperada, almacen_destino_id, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La orden debe incluir al menos un producto (items)' });
  }

  for (const item of items) {
    if (!item.producto_id || !item.cantidad || item.cantidad <= 0 || item.precio_unitario == null || item.precio_unitario < 0) {
      return res.status(400).json({ error: 'Cada item debe tener producto_id, cantidad > 0 y precio_unitario >= 0' });
    }
  }

  const orden = await OrdenCompraModel.crearConDetalles({
    proveedor_id,
    fecha_emision,
    fecha_entrega_esperada,
    almacen_destino_id,
    usuario_registra_id: req.user.id,
    items,
  });

  await registrarAuditoria(req, 'INSERT', 'ordenes_compra', orden.id, null, orden);

  // RF08 - Cálculo automático de coste logístico al registrar la compra
  const { registro, alerta } = await procesarCosteCompra(orden);

  const ordenCompleta = await OrdenCompraModel.findById(orden.id);
  res.status(201).json({ orden: ordenCompleta, coste_registrado: registro, alerta_generada: alerta });
});

// RF16 - Trazabilidad: actualizar estado del pedido
const actualizarEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ['pendiente', 'en almacen', 'en transito', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}` });
  }

  const anterior = await OrdenCompraModel.findById(req.params.id);
  if (!anterior) return res.status(404).json({ error: 'Orden de compra no encontrada' });

  const actualizado = await OrdenCompraModel.actualizarEstado(req.params.id, estado);
  await registrarAuditoria(req, 'UPDATE', 'ordenes_compra', req.params.id, { estado: anterior.estado }, { estado: actualizado.estado });

  res.json(actualizado);
});

// RF05 - Recepción de mercancía -> actualización automática de inventario
const recibirMercancia = asyncHandler(async (req, res) => {
  const { almacen_id } = req.body;

  const resultado = await OrdenCompraModel.recibirMercancia(req.params.id, almacen_id);

  await registrarAuditoria(req, 'UPDATE', 'ordenes_compra', req.params.id, null, {
    accion: 'recepcion_mercancia',
    almacen_id: almacen_id || resultado.orden.almacen_destino_id,
    detalles: resultado.detalles,
  });

  res.json({
    message: 'Mercancía recibida y stock actualizado correctamente',
    orden: resultado.orden,
    movimientos_inventario: resultado.detalles.map((d) => ({
      producto_id: d.producto_id,
      cantidad_recibida: d.cantidad,
    })),
  });
});

module.exports = { listar, obtener, crear, actualizarEstado, recibirMercancia };
