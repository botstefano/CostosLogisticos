const express = require('express');
const ctrl = require('../controllers/reporteController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/fuentes', ctrl.fuentesDisponibles);
router.get('/resumen-financiero/:formato', ctrl.exportarResumenFinanciero);
router.get('/:tabla/:formato', ctrl.exportarTabla);

module.exports = router;
