const express = require('express');
const ctrl = require('../controllers/backupController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('Administrador'));

router.get('/', ctrl.listarBackups);
router.post('/', ctrl.crearBackup);
router.get('/:filename/descargar', ctrl.descargarBackup);

module.exports = router;
