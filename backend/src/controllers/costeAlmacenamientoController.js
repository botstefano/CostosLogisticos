const CosteAlmacenamientoModel = require('../models/costeAlmacenamientoModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');
const { procesarCosteAlmacenamiento } = require('../utils/calculosCostes');

const listar = asyncHandler(async (req, res) => {
  res.json(await CosteAlmacenamientoModel.findAll());
});

const obtener = asyncHandler(async (req, res) => {
  const item = await CosteAlmacenamientoModel.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Coste de almacenamiento no encontrado' });
  res.json(item);
});

// RF06 + RF08 - Registro de coste de almacenamiento con cálculo automático
const crear = asyncHandler(async (req, res) => {
  const { almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia } = req.body;

  const tiposValidos = ['alquiler', 'mantenimiento', 'mano_obra', 'servicios', 'otros'];
  if (!tiposValidos.includes(tipo_gasto)) {
    return res.status(400).json({ error: `tipo_gasto inválido. Valores permitidos: ${tiposValidos.join(', ')}` });
  }
  if (monto == null || monto < 0) {
    return res.status(400).json({ error: 'monto debe ser un número positivo' });
  }

  const coste = await CosteAlmacenamientoModel.create({
    almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia,
    usuario_registra_id: req.user.id,
  });

  await registrarAuditoria(req, 'INSERT', 'costes_almacenamiento', coste.id, null, coste);

  const { registro, alerta } = await procesarCosteAlmacenamiento(coste);

  res.status(201).json({ coste, coste_registrado: registro, alerta_generada: alerta });
});

module.exports = { listar, obtener, crear };
