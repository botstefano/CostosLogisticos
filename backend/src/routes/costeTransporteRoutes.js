const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/costeTransporteController');
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
    body('vehiculo_id').isInt().withMessage('vehiculo_id es obligatorio'),
    body('kilometros_recorridos').isFloat({ min: 0 }).withMessage('kilometros_recorridos debe ser un número positivo'),
    body('coste_combustible').optional().isFloat({ min: 0 }),
    body('coste_peajes').optional().isFloat({ min: 0 }),
    body('coste_mantenimiento').optional().isFloat({ min: 0 }),
    body('coste_conductor').optional().isFloat({ min: 0 }),
  ],
  validate,
  ctrl.crear
);

module.exports = router;
