const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/proveedorController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

const reglas = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido'),
];

router.post('/', authorize('Administrador', 'Operador Logistico'), reglas, validate, ctrl.crear);
router.put('/:id', authorize('Administrador', 'Operador Logistico'), validate, ctrl.actualizar);
router.delete('/:id', authorize('Administrador'), ctrl.eliminar);

module.exports = router;
