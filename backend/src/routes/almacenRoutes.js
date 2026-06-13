const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/almacenController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

const reglas = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('capacidad_total').optional().isFloat({ min: 0 }),
  body('coste_mensual_operacion').optional().isFloat({ min: 0 }),
];

router.post('/', authorize('Administrador'), reglas, validate, ctrl.crear);
router.put('/:id', authorize('Administrador'), validate, ctrl.actualizar);
router.delete('/:id', authorize('Administrador'), ctrl.eliminar);

module.exports = router;
