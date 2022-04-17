const express = require('express');
const router = express.Router();
router.use('/rocket-pool', require('./rocket-pool'));
router.use('/lido', require('./lido'));
module.exports = router;
