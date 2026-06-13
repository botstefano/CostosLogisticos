const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/alertaController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.put(
  '/:id/estado',
  authorize('Administrador', 'Supervisor', 'Gerente'),
  [body('estado').isIn(['activa', 'revisada', 'resuelta', 'descartada'])],
  validate,
  ctrl.actualizarEstado
);

router.get('/configuracion', authorize('Administrador', 'Gerente'), ctrl.listarConfiguracion);
router.put(
  '/configuracion/:tipo',
  authorize('Administrador', 'Gerente'),
  [
    body('umbral_porcentaje').optional().isFloat({ min: 0 }),
    body('monto_presupuestado_mensual').optional().isFloat({ min: 0 }),
  ],
  validate,
  ctrl.actualizarConfiguracion
);

module.exports = router;
