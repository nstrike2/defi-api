const express = require('express');
const router = express.Router();
router.use('/uniswap', require('./uniswap'));
module.exports = router;
