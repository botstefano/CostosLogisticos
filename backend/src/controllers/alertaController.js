const { AlertaModel, ConfiguracionAlertaModel } = require('../models/alertaModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');

const listar = asyncHandler(async (req, res) => {
  const { estado } = req.query;
  res.json(await AlertaModel.findAll({ estado }));
});

const actualizarEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const anterior = await AlertaModel.findById(req.params.id);
  if (!anterior) return res.status(404).json({ error: 'Alerta no encontrada' });

  const actualizada = await AlertaModel.actualizarEstado(req.params.id, estado);
  await registrarAuditoria(req, 'UPDATE', 'alertas_sobrecostes', req.params.id, { estado: anterior.estado }, { estado });

  res.json(actualizada);
});

const listarConfiguracion = asyncHandler(async (req, res) => {
  res.json(await ConfiguracionAlertaModel.findAll());
});

// RF12 - Configuración de umbral de sobrecoste (solo Administrador/Gerente)
const actualizarConfiguracion = asyncHandler(async (req, res) => {
  const { tipo } = req.params;
  const { umbral_porcentaje, monto_presupuestado_mensual } = req.body;

  const actualizado = await ConfiguracionAlertaModel.update(tipo, { umbral_porcentaje, monto_presupuestado_mensual });
  if (!actualizado) return res.status(404).json({ error: 'Tipo de configuración no encontrado' });

  await registrarAuditoria(req, 'UPDATE', 'configuracion_alertas', tipo, null, actualizado);
  res.json(actualizado);
});

module.exports = { listar, actualizarEstado, listarConfiguracion, actualizarConfiguracion };
