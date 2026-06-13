const express = require('express');
const ctrl = require('../controllers/inventarioController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.listar);
router.post('/ajuste', authorize('Administrador', 'Operador Logistico', 'Supervisor'), ctrl.ajustar);

module.exports = router;
