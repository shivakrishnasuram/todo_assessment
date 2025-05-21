const express = require('express');
const router = express.Router();
const { summarizeTodos } = require('../controllers/summarizeController');

router.post('/', summarizeTodos);

module.exports = router;
