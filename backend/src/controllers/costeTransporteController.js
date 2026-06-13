const CosteTransporteModel = require('../models/costeTransporteModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');
const { procesarCosteTransporte, round2 } = require('../utils/calculosCostes');

const listar = asyncHandler(async (req, res) => {
  res.json(await CosteTransporteModel.findAll());
});

const obtener = asyncHandler(async (req, res) => {
  const item = await CosteTransporteModel.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Coste de transporte no encontrado' });
  res.json(item);
});

// RF07 + RF08 - Registro de coste de transporte con cálculo automático (incluye coste/km)
const crear = asyncHandler(async (req, res) => {
  const {
    vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos,
    coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor, operacion_referencia,
  } = req.body;

  if (!vehiculo_id) return res.status(400).json({ error: 'vehiculo_id es obligatorio' });
  if (kilometros_recorridos == null || kilometros_recorridos < 0) {
    return res.status(400).json({ error: 'kilometros_recorridos debe ser un número positivo' });
  }

  const coste_total = round2(
    Number(coste_combustible || 0) + Number(coste_peajes || 0) +
    Number(coste_mantenimiento || 0) + Number(coste_conductor || 0)
  );

  const coste = await CosteTransporteModel.create({
    vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos,
    coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor,
    coste_total, operacion_referencia, usuario_registra_id: req.user.id,
  });

  await registrarAuditoria(req, 'INSERT', 'costes_transporte', coste.id, null, coste);

  const { registro, alerta, costePorKm } = await procesarCosteTransporte(coste);

  res.status(201).json({ coste, coste_registrado: registro, coste_por_km: costePorKm, alerta_generada: alerta });
});

module.exports = { listar, obtener, crear };
