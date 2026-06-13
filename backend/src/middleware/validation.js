const { validationResult } = require('express-validator');

// Ejecuta las reglas de express-validator y devuelve 400 si hay errores
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Manejador global de errores
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
}

// Wrapper para controladores async, evita try/catch repetitivo
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { validate, errorHandler, asyncHandler };
