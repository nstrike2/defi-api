const express = require('express');
const router = express.Router();
router.use('/stake', require('./stake'));
module.exports = router;