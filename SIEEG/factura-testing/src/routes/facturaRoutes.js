const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

router.post('/cfdi/list', facturaController.listCfdis);

module.exports = router; 