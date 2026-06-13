const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/usuarioController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Todas las rutas requieren autenticación y rol Administrador
router.use(authenticate, authorize('Administrador'));

router.get('/roles', ctrl.listarRoles);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol_id').isInt().withMessage('rol_id debe ser un número'),
  ],
  validate,
  ctrl.crear
);

router.put(
  '/:id',
  [
    body('nombre').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('rol_id').optional().isInt(),
    body('activo').optional().isBoolean(),
  ],
  validate,
  ctrl.actualizar
);

router.put(
  '/:id/reset-password',
  [body('password_nueva').isLength({ min: 6 })],
  validate,
  ctrl.resetPassword
);

router.delete('/:id', ctrl.eliminar);

module.exports = router;
