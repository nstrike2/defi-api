const express = require('express');
const router = express.Router();
router.use('/uniswap', require('./uniswap'));
router.use('/sushiswap', require('./sushiswap'));
module.exports = router;
