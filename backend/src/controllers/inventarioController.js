const InventarioModel = require('../models/inventarioModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');

const listar = asyncHandler(async (req, res) => {
  const { almacen_id, producto_id } = req.query;
  if (almacen_id) return res.json(await InventarioModel.findByAlmacen(almacen_id));
  if (producto_id) return res.json(await InventarioModel.findByProducto(producto_id));
  res.json(await InventarioModel.findAll());
});

// Ajuste manual de inventario (correcciones, mermas, etc.)
const ajustar = asyncHandler(async (req, res) => {
  const { producto_id, almacen_id, delta, ubicacion_estanteria, motivo } = req.body;

  if (!producto_id || !almacen_id || delta === undefined) {
    return res.status(400).json({ error: 'producto_id, almacen_id y delta son obligatorios' });
  }

  const resultado = await InventarioModel.ajustar(producto_id, almacen_id, Number(delta), ubicacion_estanteria);

  await registrarAuditoria(req, 'UPDATE', 'inventarios', resultado.id, null, {
    producto_id, almacen_id, delta, motivo: motivo || 'Ajuste manual',
  });

  res.json(resultado);
});

module.exports = { listar, ajustar };
