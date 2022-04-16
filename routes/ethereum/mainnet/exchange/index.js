const express = require('express');
const router = express.Router();
router.use("/uniswap", require("./uniswap"));
router.use("/sushiswap", require("./sushiswap"));
router.post("/debug", console.log);
module.exports = router;
