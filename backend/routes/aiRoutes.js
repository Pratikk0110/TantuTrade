const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aiController');

router.post('/chat', ctrl.chat);
router.post('/compare', ctrl.compare);

module.exports = router;
