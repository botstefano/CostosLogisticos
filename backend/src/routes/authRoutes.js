const express = require('express');
const { body } = require('express-validator');
const { login, me, cambiarPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  login
);

router.get('/me', authenticate, me);

router.post(
  '/cambiar-password',
  authenticate,
  [
    body('password_actual').notEmpty(),
    body('password_nueva').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  cambiarPassword
);

module.exports = router;
