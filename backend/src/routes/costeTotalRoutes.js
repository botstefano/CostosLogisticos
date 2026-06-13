const express = require('express');
const ctrl = require('../controllers/costeTotalController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.get('/dashboard', ctrl.dashboard);
router.get('/producto/:productoId/coste-unitario', ctrl.costePorUnidad);
router.get('/orden/:ordenId/rentabilidad', ctrl.rentabilidadPorOrden);

module.exports = router;
