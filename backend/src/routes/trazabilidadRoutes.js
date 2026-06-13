const express = require('express');
const ctrl = require('../controllers/trazabilidadController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.panelGeneral);
router.get('/orden/:id', ctrl.trazabilidadOrden);

module.exports = router;
