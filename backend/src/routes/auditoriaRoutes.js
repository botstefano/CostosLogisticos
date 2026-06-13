const express = require('express');
const ctrl = require('../controllers/auditoriaController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('Administrador', 'Supervisor'));

router.get('/', ctrl.listar);

module.exports = router;
