const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');

/**
 * Genera controladores CRUD estándar (listar, obtener, crear, actualizar, eliminar)
 * a partir de un modelo y nombre de tabla, registrando auditoría automáticamente.
 */
function crudControllerFactory(model, tablaNombre) {
  const listar = asyncHandler(async (req, res) => {
    const items = await model.findAll();
    res.json(items);
  });

  const obtener = asyncHandler(async (req, res) => {
    const item = await model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: `${tablaNombre} no encontrado` });
    res.json(item);
  });

  const crear = asyncHandler(async (req, res) => {
    const item = await model.create(req.body);
    await registrarAuditoria(req, 'INSERT', tablaNombre, item.id, null, item);
    res.status(201).json(item);
  });

  const actualizar = asyncHandler(async (req, res) => {
    const anterior = await model.findById(req.params.id);
    if (!anterior) return res.status(404).json({ error: `${tablaNombre} no encontrado` });

    const actualizado = await model.update(req.params.id, req.body);
    await registrarAuditoria(req, 'UPDATE', tablaNombre, req.params.id, anterior, actualizado);
    res.json(actualizado);
  });

  const eliminar = asyncHandler(async (req, res) => {
    const anterior = await model.findById(req.params.id);
    if (!anterior) return res.status(404).json({ error: `${tablaNombre} no encontrado` });

    await model.delete(req.params.id);
    await registrarAuditoria(req, 'DELETE', tablaNombre, req.params.id, anterior, null);
    res.json({ message: `${tablaNombre} eliminado correctamente` });
  });

  return { listar, obtener, crear, actualizar, eliminar };
}

module.exports = crudControllerFactory;
