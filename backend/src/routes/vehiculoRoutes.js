const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/vehiculoController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

const reglas = [
  body('placa').notEmpty().withMessage('La placa es obligatoria'),
  body('capacidad_carga').optional().isFloat({ min: 0 }),
  body('coste_por_km').optional().isFloat({ min: 0 }),
  body('estado').optional().isIn(['disponible', 'en ruta', 'mantenimiento', 'inactivo']),
];

router.post('/', authorize('Administrador', 'Operador Logistico'), reglas, validate, ctrl.crear);
router.put('/:id', authorize('Administrador', 'Operador Logistico'), validate, ctrl.actualizar);
router.delete('/:id', authorize('Administrador'), ctrl.eliminar);

module.exports = router;
