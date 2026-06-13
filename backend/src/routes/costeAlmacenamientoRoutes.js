const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/costeAlmacenamientoController');
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
    body('almacen_id').isInt().withMessage('almacen_id es obligatorio'),
    body('concepto').notEmpty().withMessage('El concepto es obligatorio'),
    body('monto').isFloat({ min: 0 }).withMessage('monto debe ser un número positivo'),
    body('tipo_gasto').isIn(['alquiler', 'mantenimiento', 'mano_obra', 'servicios', 'otros']),
  ],
  validate,
  ctrl.crear
);

module.exports = router;
