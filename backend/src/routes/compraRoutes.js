const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/compraController');
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
    body('proveedor_id').isInt().withMessage('proveedor_id es obligatorio'),
    body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
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

router.post(
  '/:id/recibir',
  authorize('Administrador', 'Operador Logistico'),
  ctrl.recibirMercancia
);

module.exports = router;
