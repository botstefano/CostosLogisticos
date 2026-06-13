const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/productoController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/bajo-stock', ctrl.bajoStock);
router.get('/:id', ctrl.obtener);

const reglas = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('precio_unitario').isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
  body('stock_minimo').optional().isInt({ min: 0 }),
  body('proveedor_id').optional({ nullable: true }).isInt(),
];

router.post('/', authorize('Administrador', 'Operador Logistico'), reglas, validate, ctrl.crear);
router.put('/:id', authorize('Administrador', 'Operador Logistico'), validate, ctrl.actualizar);
router.delete('/:id', authorize('Administrador'), ctrl.eliminar);

module.exports = router;
