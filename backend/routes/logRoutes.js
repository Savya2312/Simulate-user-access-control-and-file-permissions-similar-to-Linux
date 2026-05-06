const express = require('express');
const router = express.Router();
const { getLogs, clearLogs } = require('../controllers/logController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getLogs);
router.delete('/', protect, admin, clearLogs);

module.exports = router;
