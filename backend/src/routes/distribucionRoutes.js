const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/distribucionController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

router.post(
  '/',
  authorize('Administrador', 'Operador Logistico'),
  [
    body('orden_compra_id').optional().isInt(),
    body('vehiculo_id').optional().isInt(),
    body('coste_total_transporte').optional().isFloat({ min: 0 }),
  ],
  validate,
  ctrl.crear
);

router.put(
  '/:id/estado',
  authorize('Administrador', 'Operador Logistico', 'Supervisor'),
  [body('estado').notEmpty()],
  validate,
  ctrl.actualizarEstado
);

module.exports = router;
