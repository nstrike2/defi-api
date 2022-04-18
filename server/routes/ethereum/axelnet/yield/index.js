const express = require('express');
const router = express.Router();
router.use('/yearn', require('./yearn'));
module.exports = router;