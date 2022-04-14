const express = require('express');
const router = express.Router();
router.use('/lend', require('./lend'));
module.exports = router;